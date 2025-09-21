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
  retryRequest,
} from './utils';

// Interceptors and auth
export { setDirectAuthFailureHandler, setGlobalAuthFailureHandler } from './interceptors';

// Cache management
export { ApiCache } from './cache';

// Legacy API service object for backward compatibility
import { environment } from '@/config/environment';
import { ApiCache } from './cache';
import { api } from './core';
import { buildQueryParams, createCacheKey } from './utils';

// Cache-aware request methods
const createCacheKeyFromUrl = (url: string, config?: any): string => {
  return createCacheKey(url, config?.params);
};

export const apiService = {
  // Generic request methods
  get: async <T = any>(url: string, config?: any): Promise<T> => {
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
    } catch (error: any) {
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

  post: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    api.post(url, data, config).then(response => response.data),

  put: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    api.put(url, data, config).then(response => response.data),

  patch: <T = any>(url: string, data?: any, config?: any): Promise<T> =>
    api.patch(url, data, config).then(response => response.data),

  delete: <T = any>(url: string, config?: any): Promise<T> =>
    api.delete(url, config).then(response => response.data),

  // File upload
  upload: <T = any>(url: string, formData: FormData, config?: any): Promise<T> =>
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
