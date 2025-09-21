import { environment } from '@/config/environment';
import { AxiosResponse } from 'axios';
import { api } from './core';

// Retry logic
export const RETRY_ATTEMPTS = environment.api.retryAttempts;
export const RETRY_DELAY = environment.api.retryDelay;

export const retryRequest = async (error: any, retryCount: number = 0): Promise<AxiosResponse> => {
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

// Utility function for building query parameters consistently
export const buildQueryParams = (filters: Record<string, any>): URLSearchParams => {
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
export const createCacheKey = (url: string, params?: any): string => {
  const paramString = params ? JSON.stringify(params) : '';
  return `${url}${paramString}`;
};

// Export functionality helper
export const createExportUrl = (
  baseUrl: string,
  params: Record<string, any>,
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
