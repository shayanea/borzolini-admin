import { environment } from '@/config/environment';

// Types for API responses
export interface ApiError {
  message: string;
  code?: string;
}

// Simple HTTP client following PWA pattern
export const simpleApi = {
  post: async <T>(endpoint: string, data?: unknown, errorMessage?: string): Promise<T> => {
    const response = await fetch(`${environment.api.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      // Handle 401 specifically for auth failures
      if (response.status === 401) {
        // Don't redirect here - let React Query handle the error
        throw new Error('Authentication failed');
      }

      const error: ApiError = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || errorMessage || 'Request failed');
    }

    return response.json();
  },

  get: async <T>(endpoint: string, errorMessage?: string): Promise<T> => {
    const response = await fetch(`${environment.api.baseUrl}${endpoint}`, {
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      // Handle 401 specifically for auth failures
      if (response.status === 401) {
        // Don't redirect here - let React Query handle the error
        throw new Error('Authentication failed');
      }

      const error: ApiError = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || errorMessage || 'Request failed');
    }

    return response.json();
  },

  put: async <T>(endpoint: string, data?: unknown, errorMessage?: string): Promise<T> => {
    const response = await fetch(`${environment.api.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      // Handle 401 specifically for auth failures
      if (response.status === 401) {
        // Don't redirect here - let React Query handle the error
        throw new Error('Authentication failed');
      }

      const error: ApiError = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || errorMessage || 'Request failed');
    }

    return response.json();
  },

  patch: async <T>(endpoint: string, data?: unknown, errorMessage?: string): Promise<T> => {
    const response = await fetch(`${environment.api.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      // Handle 401 specifically for auth failures
      if (response.status === 401) {
        // Don't redirect here - let React Query handle the error
        throw new Error('Authentication failed');
      }

      const error: ApiError = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || errorMessage || 'Request failed');
    }

    return response.json();
  },

  delete: async <T>(endpoint: string, errorMessage?: string): Promise<T> => {
    const response = await fetch(`${environment.api.baseUrl}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      // Handle 401 specifically for auth failures
      if (response.status === 401) {
        // Don't redirect here - let React Query handle the error
        throw new Error('Authentication failed');
      }

      const error: ApiError = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || errorMessage || 'Request failed');
    }

    return response.json();
  },
};
