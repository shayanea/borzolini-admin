import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { appointmentsCache, calendarCache, usersCache } from './cache.service';

import { environment } from '@/config/environment';
import { message } from 'antd';

// API Configuration
const API_BASE_URL = environment.api.baseUrl;
const API_TIMEOUT = environment.api.timeout;
const RETRY_ATTEMPTS = environment.api.retryAttempts;
const RETRY_DELAY = environment.api.retryDelay;

// Custom event for authentication failures
export const createAuthFailureEvent = () => {
  if (typeof window !== 'undefined' && window.CustomEvent) {
    return new window.CustomEvent('auth:unauthorized', {
      detail: { timestamp: Date.now() }
    });
  }
  // Fallback for environments without CustomEvent
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent('auth:unauthorized', false, false, { timestamp: Date.now() });
  return event;
};

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
const retryRequest = async (error: any, retryCount: number = 0): Promise<any> => {
  if (retryCount >= RETRY_ATTEMPTS) {
    throw error;
  }

  // Only retry on network errors or 5xx server errors
  if (
    error.response?.status >= 500 ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK'
  ) {
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
    (config as any).metadata = { startTime: Date.now() };

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time for performance monitoring
    if ((response.config as any).metadata?.startTime) {
      const responseTime = Date.now() - (response.config as any).metadata.startTime;
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
        // Replay queued requests
        pendingRequests.forEach(callback => callback());
        pendingRequests = [];
        return api.request(originalRequest);
      } catch (refreshError) {
        pendingRequests = [];
        // On refresh fail, dispatch auth failure event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(createAuthFailureEvent());
        }
        // Fall through to error handler
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

// Error handling
const handleApiError = (error: any) => {
  const { response } = error;

  if (response) {
    const { status, data } = response;

    // Handle specific error cases
    switch (status) {
      case 401:
        // Unauthorized - dispatch auth failure event instead of redirecting
        if (typeof window !== 'undefined') {
          window.dispatchEvent(createAuthFailureEvent());
        }
        // Don't show error message for 401 as it's handled by auth system
        break;

      case 403:
        // Forbidden - show access denied message
        message.error('Access denied. You do not have permission to perform this action.');
        break;

      case 404:
        // Not found
        message.error('The requested resource was not found.');
        break;

      case 422:
        // Validation error
        if (data.message && Array.isArray(data.message)) {
          message.error(data.message.join(', '));
        } else if (data.message) {
          message.error(data.message);
        }
        break;

      case 429:
        // Rate limited
        message.error('Too many requests. Please try again later.');
        break;

      case 500:
        // Server error
        message.error('An internal server error occurred. Please try again later.');
        break;

      default:
        // Other errors
        if (data.message) {
          message.error(data.message);
        } else {
          message.error('An unexpected error occurred.');
        }
    }
  } else if (error.request) {
    // Network error - check if we have cached data
    if (environment.features.enableOfflineMode) {
      message.warning('Network error. Showing cached data if available.');
    } else {
      message.error('Network error. Please check your connection and try again.');
    }
  } else {
    // Other errors
    message.error('An unexpected error occurred.');
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
    if (value !== undefined && value !== null && value !== '') {
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
        appointmentsCache.get(cacheKey) || usersCache.get(cacheKey) || calendarCache.get(cacheKey);
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
        }
      }

      return response.data;
    } catch (error) {
      // Return cached data on error if available
      if (environment.features.enableOfflineMode) {
        const cachedData =
          appointmentsCache.get(cacheKey) ||
          usersCache.get(cacheKey) ||
          calendarCache.get(cacheKey);
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
