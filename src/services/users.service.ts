import type { PaginatedResponse, User, UserRole } from '@/types';

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
  isActive?: boolean;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  dateRange?: [string, string];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  city?: string;
  country?: string;
  isVerified?: boolean;
  lastLoginFrom?: string;
  lastLoginTo?: string;
}

export class UsersService {
  // Get all users with pagination and filters
  static async getUsers(params: UsersQueryParams = {}): Promise<PaginatedResponse<User>> {
    // Use the utility function for consistent query parameter handling
    const queryParams = apiService.buildQueryParams(params);
    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await apiService.get<any>(url);

    if (response && Array.isArray(response.users)) {
      // Direct array format - wrap it in PaginatedResponse structure
      return {
        data: response.users,
        total: response.total,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: Math.ceil(response.total / (params.limit || 10)),
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
    return apiService.put<User>(`/users/${id}`, data);
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

  // Export users to CSV
  static async exportUsersToCSV(params: UsersQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const url = `/users/export/csv${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  // Export users to Excel
  static async exportUsersToExcel(params: UsersQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const url = `/users/export/excel${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }
}

export default UsersService;
