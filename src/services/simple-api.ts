import { TokenService } from './token.service';
import { environment } from '@/config/environment';

// Types for API responses
export interface ApiError {
  message: string;
  code?: string;
}

// Helper function to get headers for requests
const getRequestHeaders = (endpoint: string): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Only add Authorization header for non-auth routes
  const isAuthRoute = endpoint.startsWith('/auth/');
  if (!isAuthRoute) {
    const authHeader = TokenService.getAuthorizationHeader();
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
  }

  return headers;
};

// Simple HTTP client following PWA pattern
export const simpleApi = {
  post: async <T>(endpoint: string, data?: unknown, errorMessage?: string): Promise<T> => {
    const response = await fetch(`${environment.api.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: getRequestHeaders(endpoint),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Keep for auth routes
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
      headers: getRequestHeaders(endpoint),
      credentials: 'include', // Keep for auth routes
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
      headers: getRequestHeaders(endpoint),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Keep for auth routes
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
      headers: getRequestHeaders(endpoint),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include', // Keep for auth routes
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
      headers: getRequestHeaders(endpoint),
      credentials: 'include', // Keep for auth routes
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
