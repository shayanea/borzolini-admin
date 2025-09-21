import { environment } from '@/config/environment';
import { InternalAxiosRequestConfig } from 'axios';
import { emitAuthUnauthorized } from '../event-emitter.service';
import { TokenService } from '../token.service';
import { api } from './core';
import { handleApiError } from './error-handler';
import { retryRequest } from './utils';

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

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request timestamp for performance/caching diagnostics
    (config as InternalAxiosRequestConfig & { metadata: { startTime: number } }).metadata = {
      startTime: Date.now(),
    };

    // Hybrid authentication approach
    const isAuthRoute = config.url?.startsWith('/auth/');
    const isDevelopment = environment.app.environment === 'development';

    if (!isAuthRoute && isDevelopment) {
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
    } else if (isAuthRoute) {
      console.log('🍪 Using cookie authentication for auth route:', config.url);
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
        await api.post('/auth/refresh');
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
