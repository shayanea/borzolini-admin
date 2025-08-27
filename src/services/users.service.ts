import type { AccountStatus, PaginatedResponse, User, UserRole } from '@/types';

import { apiService } from './api';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  role?: UserRole;
  accountStatus?: AccountStatus;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: AccountStatus;
  dateRange?: [string, string];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class UsersService {
  // Get all users with pagination and filters
  static async getUsers(params: UsersQueryParams = {}): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.dateRange) {
      queryParams.append('startDate', params.dateRange[0]);
      queryParams.append('endDate', params.dateRange[1]);
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await apiService.get<any>(url);

    // Handle both response formats:
    // 1. PaginatedResponse format: { data: User[], total: number, ... }
    // 2. Direct array format: User[]
    if (response && typeof response === 'object' && 'data' in response && 'total' in response) {
      // PaginatedResponse format
      return response as PaginatedResponse<User>;
    } else if (Array.isArray(response)) {
      // Direct array format - wrap it in PaginatedResponse structure
      return {
        data: response,
        total: response.length,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(response.length / (params.limit || 10)),
      };
    } else {
      // Fallback - empty response
      console.warn('Unexpected response format:', response);
      return {
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0,
      };
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  }

  // Create new user
  static async createUser(data: CreateUserData): Promise<User> {
    return apiService.post<User>('/users', data);
  }

  // Update user
  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return apiService.patch<User>(`/users/${id}`, data);
  }

  // Delete user
  static async deleteUser(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/users/${id}`);
  }

  // Search users by email
  static async searchUsersByEmail(email: string): Promise<User[]> {
    return apiService.get<User[]>(`/users/search/email?email=${encodeURIComponent(email)}`);
  }

  // Get user profile completion
  static async getUserProfileCompletion(id: string): Promise<{
    completionPercentage: number;
    missingFields: string[];
    suggestions: string[];
  }> {
    return apiService.get(`/users/profile/completion/${id}`);
  }

  // Recalculate user profile completion
  static async recalculateProfileCompletion(id: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/users/profile/completion/recalculate/${id}`);
  }

  // Get user activities
  static async getUserActivities(id: string, limit: number = 50): Promise<any[]> {
    return apiService.get<any[]>(`/users/activities/${id}?limit=${limit}`);
  }

  // Get user activity summary
  static async getUserActivitySummary(id: string): Promise<{
    totalActivities: number;
    lastActivity: string;
    activityTypes: Record<string, number>;
  }> {
    return apiService.get(`/users/activities/summary/${id}`);
  }

  // Request phone verification for user
  static async requestPhoneVerification(
    userId: string,
    phone: string
  ): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/users/phone/verification/request`, {
      userId,
      phone,
    });
  }

  // Verify user phone
  static async verifyUserPhone(
    userId: string,
    phone: string,
    otp: string
  ): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(`/users/phone/verification/verify`, {
      userId,
      phone,
      otp,
    });
  }

  // Get phone verification status
  static async getPhoneVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    phone: string;
    lastAttempt: string;
  }> {
    return apiService.get(`/users/phone/verification/status/${userId}`);
  }

  // Bulk operations
  static async bulkUpdateUsers(
    userIds: string[],
    updates: Partial<UpdateUserData>
  ): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>('/users/bulk-update', {
      userIds,
      updates,
    });
  }

  static async bulkDeleteUsers(userIds: string[]): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>('/users/bulk-delete', {
      data: { userIds },
    });
  }

  // Export users
  static async exportUsers(params: UsersQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.dateRange) {
      queryParams.append('startDate', params.dateRange[0]);
      queryParams.append('endDate', params.dateRange[1]);
    }

    const url = `/users/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await apiService.get(url, {
      responseType: 'blob',
    });

    return response;
  }
}

export default UsersService;
