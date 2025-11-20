// Core API functionality
export { api, API_BASE_URL, API_TIMEOUT } from './core';

// Error handling
export { handleApiError, handleBusinessError } from './error-handler';

// Utilities
export {
    buildQueryParams,
    createCacheKey,
    createExportUrl,
    fetchExportBlob,
    RETRY_ATTEMPTS,
    RETRY_DELAY,
    retryRequest
} from './utils';

// Interceptors and auth
export { setDirectAuthFailureHandler, setGlobalAuthFailureHandler } from './interceptors';

// Cache management
export { ApiCache } from './cache';

// Legacy API service object for backward compatibility
import { environment } from '@/config/environment';
import { AxiosRequestConfig } from 'axios';
import { ApiCache } from './cache';
import { api } from './core';
import { buildQueryParams, createCacheKey } from './utils';

// Cache-aware request methods
const createCacheKeyFromUrl = (url: string, config?: AxiosRequestConfig): string => {
  return createCacheKey(url, config?.params);
};

export const apiService = {
  // Generic request methods
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const cacheKey = createCacheKeyFromUrl(url, config);

    // Check cache first
    if (environment.features.enableCaching) {
      const cachedData = ApiCache.get(cacheKey);
      if (cachedData) {
        return cachedData as T;
      }
    }

    try {
      const response = await api.get(url, config);

      // Cache successful responses - determine type from URL
      if (environment.features.enableCaching) {
        let cacheType: 'appointments' | 'users' | 'calendar' | 'lookups' | undefined;
        if (url.includes('appointments')) {
          cacheType = 'appointments';
        } else if (url.includes('users')) {
          cacheType = 'users';
        } else if (url.includes('calendar') || url.includes('veterinarians')) {
          cacheType = 'calendar';
        } else if (url.includes('/distinct/')) {
          cacheType = 'lookups';
        }
        if (cacheType) {
          ApiCache.set(cacheKey, response.data, cacheType);
        }
      }

      return response.data;
    } catch (error) {
      // Return cached data on error if available
      if (environment.features.enableOfflineMode) {
        const cachedData = ApiCache.get(cacheKey);
        if (cachedData) {
          console.warn('Using cached data due to network error.');
          return cachedData as T;
        }
      }
      throw error;
    }
  },

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    api.post(url, data, config).then(response => response.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    api.put(url, data, config).then(response => response.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config).then(response => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete(url, config).then(response => response.data),

  // File upload
  upload: <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> =>
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
    ApiCache.clear(type);
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

export default apiService;
