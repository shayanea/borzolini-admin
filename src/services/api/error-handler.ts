import { toast } from '@/utils/toast';
import { AxiosError } from 'axios';

// Centralized error handling for all HTTP status codes
export const handleApiError = (error: unknown): Promise<never> => {
  // Type guard for AxiosError
  if (!(error instanceof Error)) {
    toast.error('An unexpected error occurred.');
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
        toast.error('Access denied', 'You do not have permission to perform this action.');
        break;

      case 404:
        toast.error('Not Found', 'The requested resource was not found.');
        break;

      case 409:
        toast.error('Conflict', 'The resource already exists or cannot be created.');
        break;

      case 422:
        // Validation error - show detailed messages
        if (data.message && Array.isArray(data.message)) {
          toast.error('Validation Warning', data.message.join(', '));
        } else if (data.message) {
          toast.error('Validation Warning', data.message as string);
        } else {
          toast.error('Validation Failed', 'Please check your input and try again.');
        }
        break;

      case 429:
        toast.error('Too Many Requests', 'Please try again later.');
        break;

      case 500:
        toast.error('Server Error', 'An internal server error occurred. Please try again later.');
        break;

      case 502:
        toast.error('Bad Gateway', 'Please try again later.');
        break;

      case 503:
        toast.error('Service Unavailable', 'Please try again later.');
        break;

      case 504:
        toast.error('Gateway Timeout', 'Please try again later.');
        break;

      default:
        // Other HTTP errors
        if (data.message) {
          toast.error('Error', data.message as string);
        } else {
          toast.error('Error', `Request failed with status ${status}. Please try again.`);
        }
    }
  } else if (axiosError.request) {
    // Network errors
    if (axiosError.code === 'ERR_NETWORK') {
      toast.error('Network Error', 'Please check your connection and try again.');
    } else if (axiosError.code === 'ECONNABORTED') {
      toast.error('Request Timeout', 'Please try again.');
    } else {
      toast.error('Network Error', 'Please check your connection and try again.');
    }
  } else {
    // Other errors (like business logic errors from services)
    if (error.message) {
      toast.error('Error', error.message);
    } else {
      toast.error('Error', 'An unexpected error occurred.');
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
    toast.error('Error', error.message);
  }

  return Promise.reject(error);
};

export default handleApiError;
