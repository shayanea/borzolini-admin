import { environment } from '@/config/environment';
import axios, { AxiosInstance } from 'axios';

// API Configuration
export const API_BASE_URL = environment.api.baseUrl;
export const API_TIMEOUT = environment.api.timeout;

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

export default api;
