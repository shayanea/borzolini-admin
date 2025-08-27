import type {
  ChangePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
} from '@/types';
import { useAuthActions, useAuthStore } from '@/stores/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AuthService } from '@/services/auth.service';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const {
    login: loginStore,
    logout: logoutStore,
    setLoading,
    setError,
    handleAuthFailure,
  } = useAuthActions();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: data => {
      loginStore(data.user);
      message.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Login failed');
      message.error('Login failed. Please check your credentials.');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      message.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Registration failed');
      message.error('Registration failed. Please try again.');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      message.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      // Even if logout fails, clear local state
      logoutStore();
      queryClient.clear();
      navigate('/login');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      message.success('Password changed successfully!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      message.success('Password reset email sent! Please check your inbox.');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to send reset email');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      message.success('Password reset successfully! You can now login with your new password.');
      navigate('/login');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to reset password');
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: () => {
      message.success('Email verified successfully!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to verify email');
    },
  });

  // Resend verification mutation
  const resendVerificationMutation = useMutation({
    mutationFn: AuthService.resendVerification,
    onSuccess: () => {
      message.success('Verification email sent! Please check your inbox.');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to resend verification email');
    },
  });

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setLoading('loading');
    try {
      await loginMutation.mutateAsync(credentials);
    } finally {
      setLoading('idle');
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    setLoading('loading');
    try {
      await registerMutation.mutateAsync(data);
    } finally {
      setLoading('idle');
    }
  };

  // Logout function
  const logout = async () => {
    setLoading('loading');
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setLoading('idle');
    }
  };

  // Change password function
  const changePassword = async (data: ChangePasswordData) => {
    await changePasswordMutation.mutateAsync(data);
  };

  // Forgot password function
  const forgotPassword = async (data: ForgotPasswordData) => {
    await forgotPasswordMutation.mutateAsync(data);
  };

  // Reset password function
  const resetPassword = async (data: ResetPasswordData) => {
    await resetPasswordMutation.mutateAsync(data);
  };

  // Verify email function
  const verifyEmail = async (token: string) => {
    await verifyEmailMutation.mutateAsync(token);
  };

  // Resend verification function
  const resendVerification = async (email: string) => {
    await resendVerificationMutation.mutateAsync(email);
  };

  // Handle authentication failure manually
  const triggerAuthFailure = () => {
    handleAuthFailure();
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,

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
    login,
    register,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    triggerAuthFailure,
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
