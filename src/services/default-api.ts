import { environment } from '@/config/environment';
import { TokenService } from './token.service';

// Types for API responses
export interface ApiError {
  message: string;
  code?: string;
}

// Helper function to get headers for requests
const getRequestHeaders = (endpoint: string): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  const isDevelopment = environment.app.environment === 'development';
  const isAuthRoute = endpoint.startsWith('/auth/');
  
  // Define public auth routes that should always use cookies
  const publicAuthRoutes = ['/auth/login', '/auth/register', '/auth/logout', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email', '/auth/resend-verification'];
  const isPublicAuthRoute = publicAuthRoutes.some(route => endpoint.startsWith(route));
  
  // Define protected auth routes that need authentication
  const protectedAuthRoutes = ['/auth/me', '/auth/profile', '/auth/status', '/auth/change-password'];
  const isProtectedAuthRoute = protectedAuthRoutes.some(route => endpoint.startsWith(route));

  if (isAuthRoute) {
    if (isPublicAuthRoute) {
      // Public auth routes always use cookies
      console.log('🍪 Using cookie authentication for public auth route:', endpoint);
      return headers;
    } else if (isProtectedAuthRoute && isDevelopment) {
      // Protected auth routes use headers in development
      const authHeader = TokenService.getAuthorizationHeader();
      if (authHeader) {
        headers['Authorization'] = authHeader;
        console.log(
          '🔑 [DEV] Adding Authorization header for protected auth route',
          endpoint,
          ':',
          authHeader.substring(0, 20) + '...'
        );
      } else {
        console.log('⚠️ [DEV] No Authorization header available for protected auth route', endpoint);
      }
      return headers;
    } else {
      // Fallback to cookies for other auth routes
      console.log('🍪 Using cookie authentication for auth route:', endpoint);
      return headers;
    }
  }

  // For non-auth routes, use hybrid approach based on environment
  if (isDevelopment) {
    // Development mode: Use token-based authentication
    const authHeader = TokenService.getAuthorizationHeader();
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log(
        '🔑 [DEV] Adding Authorization header for',
        endpoint,
        ':',
        authHeader.substring(0, 20) + '...'
      );
    } else {
      console.log('⚠️ [DEV] No Authorization header available for', endpoint);
    }
  } else {
    // Production mode: Use cookie-based authentication only
    console.log('🍪 [PROD] Using cookie authentication for', endpoint);
  }

  return headers;
};

// Default HTTP client following PWA pattern
export const defaultApi = {
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
