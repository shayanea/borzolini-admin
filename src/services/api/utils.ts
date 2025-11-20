import { environment } from '@/config/environment';
import { AxiosError, AxiosResponse } from 'axios';
import { api } from './core';

// Type for query parameters
export type QueryParams = Record<string, string | number | boolean | string[] | null | undefined>;

// Retry logic
export const RETRY_ATTEMPTS = environment.api.retryAttempts;
export const RETRY_DELAY = environment.api.retryDelay;

export const retryRequest = async (error: AxiosError, retryCount: number = 0): Promise<AxiosResponse> => {
  if (retryCount >= RETRY_ATTEMPTS) {
    throw error;
  }

  // Only retry on network errors or 5xx server errors
  const hasRetryableStatus =
    (error.response?.status !== undefined && error.response.status >= 500) || 
    error.code === 'ECONNABORTED' || 
    error.code === 'ERR_NETWORK';
    
  if (hasRetryableStatus) {
    await new Promise(resolve => window.setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));

    try {
      const config = error.config;
      if (!config) {
        throw error;
      }
      return await api.request(config);
    } catch (retryError) {
      // Type guard to ensure retryError is AxiosError before recursive call
      if (retryError instanceof Error && 'isAxiosError' in retryError) {
        return retryRequest(retryError as AxiosError, retryCount + 1);
      }
      throw retryError;
    }
  }

  throw error;
};

// Utility function for building query parameters consistently
export const buildQueryParams = (filters: QueryParams): URLSearchParams => {
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

// Cache-aware request methods - create cache key utility
export const createCacheKey = (url: string, params?: QueryParams): string => {
  const paramString = params ? JSON.stringify(params) : '';
  return `${url}${paramString}`;
};

// Export functionality helper
export const createExportUrl = (
  baseUrl: string,
  params: QueryParams,
  format: 'csv' | 'excel'
): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.append(key, value.join(','));
        }
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const queryString = queryParams.toString();
  return `${baseUrl}/export/${format}${queryString ? `?${queryString}` : ''}`;
};

// Fetch blob for export functions
export const fetchExportBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Export failed');
  }

  return await response.blob();
};

export default {
  buildQueryParams,
  createCacheKey,
  createExportUrl,
  fetchExportBlob,
  retryRequest,
};
