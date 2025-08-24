import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api/v1';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      // Handle specific error cases
      switch (status) {
        case 401:
          // Unauthorized - clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
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
      // Network error
      message.error('Network error. Please check your connection and try again.');
    } else {
      // Other errors
      message.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Generic request methods
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.get(url, config).then(response => response.data),

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
    api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }).then(response => response.data),
};

export default api;
