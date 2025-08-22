import { apiService } from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthStatus,
  User,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
} from '@/types';

export class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  }

  // Register
  static async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', data);
  }

  // Logout
  static async logout(): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/logout');
  }

  // Get current user profile
  static async getProfile(): Promise<User> {
    return apiService.get<User>('/auth/profile');
  }

  // Get current user info
  static async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }

  // Get authentication status
  static async getAuthStatus(): Promise<AuthStatus> {
    return apiService.get<AuthStatus>('/auth/status');
  }

  // Change password
  static async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/change-password', data);
  }

  // Forgot password
  static async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/forgot-password', data);
  }

  // Reset password
  static async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/reset-password', data);
  }

  // Verify email
  static async verifyEmail(token: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/auth/verify-email/${token}`);
  }

  // Resend verification email
  static async resendVerification(email: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/resend-verification', { email });
  }

  // Request phone verification
  static async requestPhoneVerification(phone: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/request-phone-verification', { phone });
  }

  // Verify phone
  static async verifyPhone(phone: string, otp: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/verify-phone', { phone, otp });
  }

  // Refresh token
  static async refreshToken(): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/refresh');
  }
}

export default AuthService;
