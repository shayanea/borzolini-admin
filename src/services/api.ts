import { appointmentsCache, calendarCache, lookupsCache, usersCache } from './cache.service';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { emitAuthUnauthorized } from './event-emitter.service';
import { environment } from '@/config/environment';
import { message } from 'antd';

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

  // Clear all caches
  appointmentsCache.clear();
  usersCache.clear();
  calendarCache.clear();

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

// API Configuration
const API_BASE_URL = environment.api.baseUrl;
const API_TIMEOUT = environment.api.timeout;
const RETRY_ATTEMPTS = environment.api.retryAttempts;
const RETRY_DELAY = environment.api.retryDelay;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Retry logic
const retryRequest = async (error: any, retryCount: number = 0): Promise<AxiosResponse> => {
  if (retryCount >= RETRY_ATTEMPTS) {
    throw error;
  }

  // Only retry on network errors or 5xx server errors
  const hasRetryableStatus =
    error.response?.status >= 500 || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
  if (hasRetryableStatus) {
    await new Promise(resolve => window.setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));

    try {
      const config = error.config;
      return await api.request(config);
    } catch (retryError) {
      return retryRequest(retryError, retryCount + 1);
    }
  }

  throw error;
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cookie-based auth: do not attach Authorization header
    // Add request timestamp for performance/caching diagnostics
    (config as InternalAxiosRequestConfig & { metadata: { startTime: number } }).metadata = {
      startTime: Date.now(),
    };

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
  (response: AxiosResponse) => {
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

// Centralized error handling for all HTTP status codes
const handleApiError = (error: any) => {
  const { response } = error;

  if (response) {
    const { status, data } = response;

    // Handle all HTTP status codes in one place
    switch (status) {
      // 401 is handled by axios interceptor for automatic token refresh
      case 403:
        message.error('Access denied. You do not have permission to perform this action.');
        break;

      case 404:
        message.error('The requested resource was not found.');
        break;

      case 409:
        message.error('Conflict: The resource already exists or cannot be created.');
        break;

      case 422:
        // Validation error - show detailed messages
        if (data.message && Array.isArray(data.message)) {
          message.error(data.message.join(', '));
        } else if (data.message) {
          message.error(data.message);
        } else {
          message.error('Validation failed. Please check your input and try again.');
        }
        break;

      case 429:
        message.error('Too many requests. Please try again later.');
        break;

      case 500:
        message.error('An internal server error occurred. Please try again later.');
        break;

      case 502:
        message.error('Bad gateway. Please try again later.');
        break;

      case 503:
        message.error('Service temporarily unavailable. Please try again later.');
        break;

      case 504:
        message.error('Gateway timeout. Please try again later.');
        break;

      default:
        // Other HTTP errors
        if (data.message) {
          message.error(data.message);
        } else {
          message.error(`Request failed with status ${status}. Please try again.`);
        }
    }
  } else if (error.request) {
    // Network errors
    if (error.code === 'ERR_NETWORK') {
      message.error('Network error. Please check your connection and try again.');
    } else if (error.code === 'ECONNABORTED') {
      message.error('Request timeout. Please try again.');
    } else if (environment.features.enableOfflineMode) {
      message.warning('Network error. Showing cached data if available.');
    } else {
      message.error('Network error. Please check your connection and try again.');
    }
  } else {
    // Other errors (like business logic errors from services)
    if (error.message) {
      message.error(error.message);
    } else {
      message.error('An unexpected error occurred.');
    }
  }

  return Promise.reject(error);
};

// Cache-aware request methods
const createCacheKey = (url: string, params?: any): string => {
  const paramString = params ? JSON.stringify(params) : '';
  return `${url}${paramString}`;
};

// Utility function for building query parameters consistently
const buildQueryParams = (filters: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    const isValidValue = value !== undefined && value !== null && value !== '';
    if (isValidValue) {
      // Handle arrays by joining with commas
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(key, value.join(','));
        }
      } else {
        params.append(key, String(value));
      }
    }
  });

  return params;
};

// API methods
export const apiService = {
  // Generic request methods
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const cacheKey = createCacheKey(url, config?.params);

    // Check cache first
    if (environment.features.enableCaching) {
      const cachedData =
        appointmentsCache.get(cacheKey) ||
        usersCache.get(cacheKey) ||
        calendarCache.get(cacheKey) ||
        lookupsCache.get(cacheKey);
      if (cachedData) {
        return cachedData as T;
      }
    }

    try {
      const response = await api.get(url, config);

      // Cache successful responses
      if (environment.features.enableCaching) {
        if (url.includes('appointments')) {
          appointmentsCache.set(cacheKey, response.data);
        } else if (url.includes('users')) {
          usersCache.set(cacheKey, response.data);
        } else if (url.includes('calendar') || url.includes('veterinarians')) {
          calendarCache.set(cacheKey, response.data);
        } else if (url.includes('/distinct/')) {
          lookupsCache.set(cacheKey, response.data);
        }
      }

      return response.data;
    } catch (error) {
      // Return cached data on error if available
      if (environment.features.enableOfflineMode) {
        const cachedData =
          appointmentsCache.get(cacheKey) ||
          usersCache.get(cacheKey) ||
          calendarCache.get(cacheKey) ||
          lookupsCache.get(cacheKey);
        if (cachedData) {
          message.warning('Using cached data due to network error.');
          return cachedData as T;
        }
      }
      throw error;
    }
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.post(url, data, config).then(response => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.put(url, data, config).then(response => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config).then(response => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete(url, config).then(response => response.data),

  // File upload
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> =>
    api
      .post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      })
      .then(response => response.data),

  // Query parameter utilities
  buildQueryParams,

  // Cache management
  clearCache: (type?: 'appointments' | 'users' | 'calendar') => {
    if (type === 'appointments') {
      appointmentsCache.clear();
    } else if (type === 'users') {
      usersCache.clear();
    } else if (type === 'calendar') {
      calendarCache.clear();
    } else {
      appointmentsCache.clear();
      usersCache.clear();
      calendarCache.clear();
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};

export default api;
