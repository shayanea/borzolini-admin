import { InternalAxiosRequestConfig } from 'axios';
import { TokenService } from '../token.service';
import { api } from './core';
import { emitAuthUnauthorized } from '../event-emitter.service';
import { environment } from '@/config/environment';
import { handleApiError } from './error-handler';
import { retryRequest } from './utils';

// Auth response type for refresh token handling
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: any;
}

// Global auth failure handler
let globalAuthFailureHandler: (() => void) | null = null;

export const setGlobalAuthFailureHandler = (handler: () => void) => {
  globalAuthFailureHandler = handler;
};

// Direct auth failure handler - will be set by the app
let directAuthFailureHandler: (() => void) | null = null;

export const setDirectAuthFailureHandler = (handler: () => void) => {
  directAuthFailureHandler = handler;
};

// Force immediate logout when refresh fails
const forceLogout = () => {
  console.log('API Service: Force logout due to authentication failure');

  // Clear tokens in development mode
  if (environment.app.environment === 'development') {
    TokenService.clearTokens();
  }

  // Clear all caches - will be handled by individual services
  // Call all handlers
  if (globalAuthFailureHandler) {
    globalAuthFailureHandler();
  }
  if (directAuthFailureHandler) {
    directAuthFailureHandler();
  }

  // Emit event for components
  emitAuthUnauthorized();

  // Force page reload to clear any remaining state
  window.location.href = '/login';
};

// Proactive token refresh for development mode
const checkAndRefreshTokenIfNeeded = async (config: InternalAxiosRequestConfig): Promise<void> => {
  const isDevelopment = environment.app.environment === 'development';
  const isAuthRoute = config.url?.startsWith('/auth/');

  // Only check for non-auth routes in development mode
  if (!isDevelopment || isAuthRoute || isRefreshing) {
    return;
  }

  // Check if access token is close to expiry (within 10 minutes)
  const tokenData = TokenService.getTokenData();
  if (!tokenData) {
    return;
  }

  const now = Date.now();
  const timeUntilExpiry = tokenData.expiresAt - now;
  const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

  if (timeUntilExpiry < tenMinutes && timeUntilExpiry > 0) {
    console.log('🔄 [DEV] Token expires soon, proactively refreshing...');

    isRefreshing = true;
    try {
      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available for proactive refresh');
      }

      const refreshResponse = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });

      if (refreshResponse.data.accessToken && refreshResponse.data.refreshToken) {
        TokenService.setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
        console.log('✅ [DEV] Proactive token refresh successful');
      }
    } catch (error) {
      console.warn('⚠️ [DEV] Proactive token refresh failed:', error);
      // Don't throw here, let the original request proceed and handle 401 if it occurs
    } finally {
      isRefreshing = false;
    }
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add request timestamp for performance/caching diagnostics
    (config as InternalAxiosRequestConfig & { metadata: { startTime: number } }).metadata = {
      startTime: Date.now(),
    };

    // Check and refresh token proactively if needed (dev mode only)
    await checkAndRefreshTokenIfNeeded(config);

    // Hybrid authentication approach
    const isDevelopment = environment.app.environment === 'development';
    const isAuthRoute = config.url?.startsWith('/auth/');

    // Define public auth routes that should always use cookies
    const publicAuthRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/logout',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email',
      '/auth/resend-verification',
    ];
    const isPublicAuthRoute = publicAuthRoutes.some(route => config.url?.startsWith(route));

    // Define protected auth routes that need authentication
    const protectedAuthRoutes = [
      '/auth/me',
      '/auth/profile',
      '/auth/status',
      '/auth/change-password',
    ];
    const isProtectedAuthRoute = protectedAuthRoutes.some(route => config.url?.startsWith(route));

    if (isAuthRoute) {
      if (isPublicAuthRoute) {
        // Public auth routes always use cookies
        console.log('🍪 Using cookie authentication for public auth route:', config.url);
      } else if (isProtectedAuthRoute && isDevelopment) {
        // Protected auth routes use headers in development
        const authHeader = TokenService.getAuthorizationHeader();
        if (authHeader) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = authHeader;
          console.log(
            '🔑 [DEV] Adding Authorization header for protected auth route',
            config.url,
            ':',
            authHeader.substring(0, 20) + '...'
          );
        } else {
          console.log(
            '⚠️ [DEV] No Authorization header available for protected auth route',
            config.url
          );
        }
      } else {
        // Fallback to cookies for other auth routes
        console.log('🍪 Using cookie authentication for auth route:', config.url);
      }
    } else if (isDevelopment) {
      // Development mode: Add token-based authentication for non-auth routes
      const authHeader = TokenService.getAuthorizationHeader();
      if (authHeader) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = authHeader;
        console.log(
          '🔑 [DEV] Adding Authorization header for',
          config.url,
          ':',
          authHeader.substring(0, 20) + '...'
        );
      } else {
        console.log('⚠️ [DEV] No Authorization header available for', config.url);
      }
    } else {
      console.log('🍪 [PROD] Using cookie authentication for', config.url);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];
let refreshFailureCount = 0;
const MAX_REFRESH_FAILURES = 3;

api.interceptors.response.use(
  response => {
    // Log response time for performance monitoring
    if (
      (response.config as InternalAxiosRequestConfig & { metadata: { startTime: number } }).metadata
        ?.startTime
    ) {
      const responseTime =
        Date.now() -
        (response.config as InternalAxiosRequestConfig & { metadata: { startTime: number } })
          .metadata.startTime;
      if (environment.app.debug) {
        console.log(`API Response Time: ${responseTime}ms for ${response.config.url}`);
      }
    }
    return response;
  },
  async error => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 with cookie-based refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we've exceeded max refresh failures
      if (refreshFailureCount >= MAX_REFRESH_FAILURES) {
        console.log('Max refresh failures reached, forcing logout');
        forceLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          pendingRequests.push(() => {
            api.request(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;
      try {
        const isDevelopment = environment.app.environment === 'development';
        let refreshResponse;

        if (isDevelopment) {
          // Development mode: Send refresh token from localStorage
          const refreshToken = TokenService.getRefreshToken();
          if (!refreshToken) {
            console.error('🚨 [DEV] No refresh token available in localStorage');
            throw new Error('No refresh token available');
          }

          console.log('🔄 [DEV] Attempting token refresh with localStorage refresh token');
          refreshResponse = await api.post<AuthResponse>('/auth/refresh', {
            refreshToken,
          });

          // Store new tokens from response in development mode
          if (refreshResponse.data.accessToken && refreshResponse.data.refreshToken) {
            TokenService.setTokens(
              refreshResponse.data.accessToken,
              refreshResponse.data.refreshToken
            );
            console.log('✅ [DEV] New tokens stored successfully after refresh');
          } else {
            console.warn('⚠️ [DEV] Refresh response missing tokens:', refreshResponse.data);
          }
        } else {
          // Production mode: Use cookie-based refresh
          console.log('🔄 [PROD] Attempting cookie-based token refresh');
          refreshResponse = await api.post('/auth/refresh');
          console.log('✅ [PROD] Cookie-based refresh successful');
        }

        // Reset failure count on successful refresh
        refreshFailureCount = 0;

        // Replay queued requests
        pendingRequests.forEach(callback => callback());
        pendingRequests = [];

        return api.request(originalRequest);
      } catch (refreshError) {
        pendingRequests = [];
        refreshFailureCount++;

        // On refresh fail, emit auth failure event using event emitter service
        if (environment.app.debug) {
          console.log(
            `Token refresh failed (${refreshFailureCount}/${MAX_REFRESH_FAILURES}), emitting auth failure event:`,
            refreshError
          );
        }
        console.log('refreshError', refreshError);

        // Force immediate logout when refresh fails
        forceLogout();

        // Don't fall through to error handler for auth failures
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Try to retry the request for network/5xx errors
    try {
      return await retryRequest(error);
    } catch (retryError) {
      return handleApiError(retryError);
    }
  }
);

export default {
  setGlobalAuthFailureHandler,
  setDirectAuthFailureHandler,
};
