import type { PaginatedResponse, User, UserRole } from '@/types';

import { BaseQueryParams, BaseService, ValidationHelper } from '../core/base.service';

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
  clinic_id?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string;
  avatar?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
  clinic_id?: string;
}

export interface UsersQueryParams extends BaseQueryParams {
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

export class UsersService extends BaseService<User, CreateUserData, UpdateUserData> {
  constructor() {
    super('/users', 'users');
  }

  protected getEntityName(): string {
    return 'user';
  }

  // Get all users with pagination and filters
  static async getUsers(params: UsersQueryParams = {}): Promise<PaginatedResponse<User>> {
    const service = new UsersService();
    const response = await service.getAll(params);

    // Handle the specific response format for users
    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: Math.ceil(response.total / response.limit),
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
    const service = new UsersService();
    return service.getById(id);
  }

  // Create new user
  static async createUser(data: CreateUserData): Promise<User> {
    const service = new UsersService();
    return service.create(data);
  }

  // Update user
  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const service = new UsersService();
    return service.update(id, data);
  }

  // Override update to use PUT instead of PATCH
  async update(id: string, data: UpdateUserData): Promise<User> {
    ValidationHelper.requireId(id, this.getEntityName());
    ValidationHelper.requireData(data, this.getEntityName());

    const response = await this.putRequest<User>(`${this.baseUrl}/${id}`, data);

    this.invalidateCache();
    this.validateObjectResponse(response, this.getEntityName());

    return response;
  }

  // Delete user
  static async deleteUser(id: string): Promise<{ message: string }> {
    const service = new UsersService();
    return service.delete(id);
  }

  // Search users by email
  static async searchUsersByEmail(email: string): Promise<User[]> {
    const service = new UsersService();
    return service.getRequest<User[]>(`/users/search/email`, { email });
  }

  // Get user profile completion
  static async getUserProfileCompletion(id: string): Promise<{
    completionPercentage: number;
    missingFields: string[];
    suggestions: string[];
  }> {
    const service = new UsersService();
    return service.getRequest(`/users/profile/completion/${id}`);
  }

  // Recalculate user profile completion
  static async recalculateProfileCompletion(id: string): Promise<{ message: string }> {
    const service = new UsersService();
    return service.postRequest<{ message: string }>(`/users/profile/completion/recalculate/${id}`);
  }

  // Get user activities
  static async getUserActivities(id: string, limit: number = 50): Promise<any[]> {
    const service = new UsersService();
    return service.getRequest<any[]>(`/users/activities/${id}`, { limit });
  }

  // Get user activity summary
  static async getUserActivitySummary(id: string): Promise<{
    totalActivities: number;
    lastActivity: string;
    activityTypes: Record<string, number>;
  }> {
    const service = new UsersService();
    return service.getRequest(`/users/activities/summary/${id}`);
  }

  // Request phone verification for user
  static async requestPhoneVerification(
    userId: string,
    phone: string
  ): Promise<{ message: string }> {
    const service = new UsersService();
    return service.postRequest<{ message: string }>(`/users/phone/verification/request`, {
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
    const service = new UsersService();
    return service.postRequest<{ message: string }>(`/users/phone/verification/verify`, {
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
    const service = new UsersService();
    return service.getRequest(`/users/phone/verification/status/${userId}`);
  }

  // Bulk operations
  static async bulkUpdateUsers(userIds: string[], updates: Partial<UpdateUserData>): Promise<any> {
    const service = new UsersService();
    return service.bulkUpdate(userIds, updates);
  }

  static async bulkDeleteUsers(userIds: string[]): Promise<any> {
    const service = new UsersService();
    return service.bulkDelete(userIds);
  }

  // Export users to CSV
  static async exportUsersToCSV(params: UsersQueryParams = {}): Promise<Blob> {
    const service = new UsersService();
    return service.exportToCSV(params);
  }

  // Export users to Excel
  static async exportUsersToExcel(params: UsersQueryParams = {}): Promise<Blob> {
    const service = new UsersService();
    return service.exportToExcel(params);
  }
}

export default UsersService;
