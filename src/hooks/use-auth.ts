import type {
  ChangePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  User,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AuthService } from '@/services/auth.service';
import { ROUTES } from '@/constants';
import { useAuthActions } from '@/stores/auth.store';
import { useMessage } from './use-message';
import { useNavigate } from 'react-router-dom';

interface AuthResponse {
  user: User;
  message?: string;
}

// API functions using the existing AuthService
const authApi = {
  login: (data: LoginCredentials): Promise<AuthResponse> => AuthService.login(data),
  register: (data: RegisterData): Promise<AuthResponse> => AuthService.register(data),
  getCurrentUser: (): Promise<User> => AuthService.getCurrentUser(),
  logout: (): Promise<{ message: string }> => AuthService.logout(),
  changePassword: (data: ChangePasswordData): Promise<{ message: string }> =>
    AuthService.changePassword(data),
  forgotPassword: (data: ForgotPasswordData): Promise<{ message: string }> =>
    AuthService.forgotPassword(data),
  resetPassword: (data: ResetPasswordData): Promise<{ message: string }> =>
    AuthService.resetPassword(data),
  verifyEmail: (token: string): Promise<{ message: string }> => AuthService.verifyEmail(token),
  resendVerification: (email: string): Promise<{ message: string }> =>
    AuthService.resendVerification(email),
};

// Helper functions for auth state management
const clearAuthState = (queryClient: any, clearAuth: () => void) => {
  queryClient.setQueryData(['current-user'], null);
  queryClient.clear();
  clearAuth();
};

const updateAuthState = (queryClient: any, setUser: (user: User) => void, user: User) => {
  queryClient.setQueryData(['current-user'], user);
  queryClient.invalidateQueries({ queryKey: ['current-user'] });
  setUser(user);
};

// Custom hook for common auth dependencies
const useAuthDependencies = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login: setUser, logout: clearAuth } = useAuthActions();

  return { queryClient, navigate, setUser, clearAuth };
};

// Custom hooks following PWA pattern
export function useLogin() {
  const { queryClient, navigate, setUser } = useAuthDependencies();
  const { success, error } = useMessage();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      updateAuthState(queryClient, setUser, data.user);
      success('Login successful!');
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    },
  });
}

export function useRegister() {
  const { queryClient, navigate, setUser } = useAuthDependencies();
  const { success, error } = useMessage();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: data => {
      updateAuthState(queryClient, setUser, data.user);
      success('Registration successful! Please check your email to verify your account.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      error(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.getCurrentUser,
    retry: false, // Don't retry on auth failures
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on mount if data exists
  });
}

export function useLogout() {
  const { queryClient, navigate, clearAuth } = useAuthDependencies();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthState(queryClient, clearAuth);
      message.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      // Even if logout fails, clear local state
      clearAuthState(queryClient, clearAuth);
      navigate(ROUTES.LOGIN);
    },
  });
}

export function useChangePassword() {
  const { success, error } = useMessage();

  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      success('Password changed successfully!');
    },
    onError: (error: any) => {
      error(error.response?.data?.message || 'Failed to change password');
    },
  });
}

export function useForgotPassword() {
  const { success, error } = useMessage();

  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      success('Password reset email sent! Please check your inbox.');
    },
    onError: (error: any) => {
      error(error.response?.data?.message || 'Failed to send reset email');
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  const { success, error } = useMessage();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      success('Password reset successfully! You can now login with your new password.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      error(error.response?.data?.message || 'Failed to reset password');
    },
  });
}

export function useVerifyEmail() {
  const { success, error } = useMessage();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      success('Email verified successfully!');
    },
    onError: (error: any) => {
      error(error.response?.data?.message || 'Failed to verify email');
    },
  });
}

export function useResendVerification() {
  const { success, error } = useMessage();

  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => {
      success('Verification email sent! Please check your inbox.');
    },
    onError: (error: any) => {
      error(error.response?.data?.message || 'Failed to resend verification email');
    },
  });
}

// Legacy useAuth hook for backward compatibility
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const changePasswordMutation = useChangePassword();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();

  return {
    // State
    user,
    isAuthenticated: !!user && !error,
    isLoading,

    // Mutations
    loginMutation,
    registerMutation,
    logoutMutation,
    changePasswordMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    verifyEmailMutation,
    resendVerificationMutation,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    resendVerification: resendVerificationMutation.mutate,
  };
};

// Hook for getting current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: AuthService.getProfile,
    enabled: false, // Only fetch when explicitly called
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for getting authentication status
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: AuthService.getAuthStatus,
    enabled: false, // Only fetch when explicitly called
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
