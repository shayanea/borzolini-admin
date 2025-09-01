import type {
  AuthResponse,
  AuthStatus,
  ChangePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  User,
} from '@/types';

import { simpleApi } from './simple-api';

export class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return simpleApi.post<AuthResponse>('/auth/login', credentials, 'Login failed');
  }

  // Register
  static async register(data: RegisterData): Promise<AuthResponse> {
    return simpleApi.post<AuthResponse>('/auth/register', data, 'Registration failed');
  }

  // Logout
  static async logout(): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>('/auth/logout', undefined, 'Logout failed');
  }

  // Get current user profile
  static async getProfile(): Promise<User> {
    return simpleApi.get<User>('/auth/profile', 'Failed to get profile');
  }

  // Get current user info
  static async getCurrentUser(): Promise<User> {
    return simpleApi.get<User>('/auth/me', 'Failed to get user info');
  }

  // Get authentication status
  static async getAuthStatus(): Promise<AuthStatus> {
    return simpleApi.get<AuthStatus>('/auth/status', 'Failed to get auth status');
  }

  // Change password
  static async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>(
      '/auth/change-password',
      data,
      'Failed to change password'
    );
  }

  // Forgot password
  static async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>(
      '/auth/forgot-password',
      data,
      'Failed to send reset email'
    );
  }

  // Reset password
  static async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>(
      '/auth/reset-password',
      data,
      'Failed to reset password'
    );
  }

  // Verify email
  static async verifyEmail(token: string): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>(
      `/auth/verify-email/${token}`,
      undefined,
      'Failed to verify email'
    );
  }

  // Resend verification email
  static async resendVerification(email: string): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>(
      '/auth/resend-verification',
      { email },
      'Failed to resend verification'
    );
  }

  // Request phone verification
  static async requestPhoneVerification(phone: string): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>(
      '/auth/request-phone-verification',
      { phone },
      'Failed to send phone verification'
    );
  }

  // Verify phone
  static async verifyPhone(phone: string, otp: string): Promise<{ message: string }> {
    return simpleApi.post<{ message: string }>(
      '/auth/verify-phone',
      { phone, otp },
      'Failed to verify phone'
    );
  }
}

export default AuthService;
