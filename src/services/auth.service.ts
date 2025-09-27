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

import { TokenService } from './token.service';
import { defaultApi } from './default-api';

export class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await defaultApi.post<AuthResponse>(
      '/auth/login',
      credentials,
      'Login failed'
    );

    // Store tokens in localStorage if they exist (development mode)
    if (response.accessToken && response.refreshToken) {
      TokenService.setTokens(response.accessToken, response.refreshToken);
    } else {
      console.log('⚠️ No tokens received in login response');
    }

    return response;
  }

  // Register
  static async register(data: RegisterData): Promise<AuthResponse> {
    return defaultApi.post<AuthResponse>('/auth/register', data, 'Registration failed');
  }

  // Logout
  static async logout(): Promise<{ message: string }> {
    try {
      const response = await defaultApi.post<{ message: string }>(
        '/auth/logout',
        undefined,
        'Logout failed'
      );
      // Clear tokens from localStorage
      TokenService.clearTokens();
      return response;
    } catch (error) {
      // Clear tokens even if logout request fails
      TokenService.clearTokens();
      throw error;
    }
  }

  // Get current user profile
  static async getProfile(): Promise<User> {
    return defaultApi.get<User>('/auth/profile', 'Failed to get profile');
  }

  // Get current user info
  static async getCurrentUser(): Promise<User> {
    return defaultApi.get<User>('/auth/me', 'Failed to get user info');
  }

  // Get authentication status
  static async getAuthStatus(): Promise<AuthStatus> {
    return defaultApi.get<AuthStatus>('/auth/status', 'Failed to get auth status');
  }

  // Change password
  static async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return defaultApi.post<{ message: string }>(
      '/auth/change-password',
      data,
      'Failed to change password'
    );
  }

  // Forgot password
  static async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return defaultApi.post<{ message: string }>(
      '/auth/forgot-password',
      data,
      'Failed to send reset email'
    );
  }

  // Reset password
  static async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return defaultApi.post<{ message: string }>(
      '/auth/reset-password',
      data,
      'Failed to reset password'
    );
  }

  // Verify email
  static async verifyEmail(token: string): Promise<{ message: string }> {
    return defaultApi.post<{ message: string }>(
      `/auth/verify-email/${token}`,
      undefined,
      'Failed to verify email'
    );
  }

  // Resend verification email
  static async resendVerification(email: string): Promise<{ message: string }> {
    return defaultApi.post<{ message: string }>(
      '/auth/resend-verification',
      { email },
      'Failed to resend verification'
    );
  }

  // Request phone verification
  static async requestPhoneVerification(phone: string): Promise<{ message: string }> {
    return defaultApi.post<{ message: string }>(
      '/auth/request-phone-verification',
      { phone },
      'Failed to send phone verification'
    );
  }

  // Verify phone
  static async verifyPhone(phone: string, otp: string): Promise<{ message: string }> {
    return defaultApi.post<{ message: string }>(
      '/auth/verify-phone',
      { phone, otp },
      'Failed to verify phone'
    );
  }

  // Check if user has valid tokens
  static isAuthenticated(): boolean {
    return TokenService.hasTokens() && TokenService.isAccessTokenValid();
  }

  // Get stored tokens
  static getStoredTokens() {
    return TokenService.getTokenData();
  }

  // Clear stored tokens
  static clearStoredTokens(): void {
    TokenService.clearTokens();
  }
}

export default AuthService;
