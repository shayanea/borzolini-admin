import { message } from 'antd';
import { AxiosError } from 'axios';

// Centralized error handling for all HTTP status codes
export const handleApiError = (error: unknown): Promise<never> => {
  // Type guard for AxiosError
  if (!(error instanceof Error)) {
    message.error('An unexpected error occurred.');
    return Promise.reject(error);
  }

  const axiosError = error as AxiosError<{ message?: string | string[] }>;
  const { response } = axiosError;

  if (response) {
    const { status, data } = response;

    // Handle all HTTP status codes in one place
    switch (status) {
      // 401 is handled by axios interceptor for automatic token refresh
      case 403:
        message.error('Access denied. You do not have permission to perform this action.');
        break;

      case 404:
        message.error('The requested resource was not found.');
        break;

      case 409:
        message.error('Conflict: The resource already exists or cannot be created.');
        break;

      case 422:
        // Validation error - show detailed messages
        if (data.message && Array.isArray(data.message)) {
          message.error(data.message.join(', '));
        } else if (data.message) {
          message.error(data.message);
        } else {
          message.error('Validation failed. Please check your input and try again.');
        }
        break;

      case 429:
        message.error('Too many requests. Please try again later.');
        break;

      case 500:
        message.error('An internal server error occurred. Please try again later.');
        break;

      case 502:
        message.error('Bad gateway. Please try again later.');
        break;

      case 503:
        message.error('Service temporarily unavailable. Please try again later.');
        break;

      case 504:
        message.error('Gateway timeout. Please try again later.');
        break;

      default:
        // Other HTTP errors
        if (data.message) {
          message.error(data.message);
        } else {
          message.error(`Request failed with status ${status}. Please try again.`);
        }
    }
  } else if (axiosError.request) {
    // Network errors
    if (axiosError.code === 'ERR_NETWORK') {
      message.error('Network error. Please check your connection and try again.');
    } else if (axiosError.code === 'ECONNABORTED') {
      message.error('Request timeout. Please try again.');
    } else {
      message.error('Network error. Please check your connection and try again.');
    }
  } else {
    // Other errors (like business logic errors from services)
    if (error.message) {
      message.error(error.message);
    } else {
      message.error('An unexpected error occurred.');
    }
  }

  return Promise.reject(error);
};

// Business logic error handling helper
export const handleBusinessError = (error: unknown, context: string): Promise<never> => {
  console.error(`Failed to ${context}:`, error);

  // Type guard for AxiosError
  const isAxiosError = (err: unknown): err is AxiosError => {
    return err instanceof Error && ('response' in err || 'request' in err);
  };

  // If it's already an API error, let the interceptor handle it
  if (isAxiosError(error)) {
    return Promise.reject(error);
  }

  // For business logic errors, show message and re-throw
  if (error instanceof Error && error.message) {
    message.error(error.message);
  }

  return Promise.reject(error);
};

export default handleApiError;
