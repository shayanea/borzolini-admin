import { buildQueryParams, createExportUrl, fetchExportBlob } from './api/utils';

import { ApiCache } from './api/cache';
import { AxiosRequestConfig } from 'axios';
import { apiService } from './api/index';
import { handleBusinessError } from './api/error-handler';

// Generic response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface BulkOperationResponse {
  message: string;
  successCount?: number;
  failureCount?: number;
  errors?: Array<{ id: string; error: string }>;
}

// Query parameters interface
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
  dateRange?: [string, string];
  startDate?: string;
  endDate?: string;
}

// Export parameters interface
export interface ExportParams extends BaseQueryParams {
  format?: 'csv' | 'excel';
}

// Validation helpers
export class ValidationHelper {
  static requireId(id: string | undefined, entityName: string): void {
    if (!id) {
      throw new Error(`${entityName} ID is required`);
    }
  }

  static requireData(data: any, entityName: string): void {
    if (!data) {
      throw new Error(`${entityName} data is required`);
    }
  }

  static validateDate(date: string, fieldName: string): void {
    if (!date || isNaN(Date.parse(date))) {
      throw new Error(`Valid ${fieldName} is required`);
    }
  }

  static validateArray(array: any[], fieldName: string): void {
    if (!Array.isArray(array)) {
      throw new Error(`${fieldName} must be an array`);
    }
  }

  static validateMinLength(array: any[], minLength: number, fieldName: string): void {
    if (array.length < minLength) {
      throw new Error(`${fieldName} must contain at least ${minLength} item(s)`);
    }
  }
}

// Base service class with common patterns
export abstract class BaseService<T, TCreate, TUpdate = Partial<TCreate>> {
  protected readonly baseUrl: string;
  protected readonly cacheType?: 'appointments' | 'users' | 'calendar' | 'lookups';

  constructor(baseUrl: string, cacheType?: 'appointments' | 'users' | 'calendar' | 'lookups') {
    this.baseUrl = baseUrl;
    this.cacheType = cacheType;
  }

  // Generic CRUD operations
  async getAll(params: BaseQueryParams = {}): Promise<PaginatedResponse<T>> {
    try {
      const queryParams = buildQueryParams(params);
      const url = queryParams.toString()
        ? `${this.baseUrl}?${queryParams.toString()}`
        : this.baseUrl;

      const response = await apiService.get<any>(url);

      // Validate that the response has the correct structure
      if (!response || typeof response !== 'object') {
        throw new Error(`Invalid response format: expected paginated response object`);
      }

      // Handle different API response formats
      let data: T[];
      let total: number;
      let page: number;
      let limit: number;
      let totalPages: number;

      // Check if response follows the standard PaginatedResponse format
      if (Array.isArray(response.data)) {
        data = response.data;
        total = response.total || 0;
        page = response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle clinics endpoint format
      else if (Array.isArray(response.clinics)) {
        data = response.clinics;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle users endpoint format
      else if (Array.isArray(response.users)) {
        data = response.users;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle appointments endpoint format
      else if (Array.isArray(response.appointments)) {
        data = response.appointments;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle reviews endpoint format
      else if (Array.isArray(response.reviews)) {
        data = response.reviews;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle contacts endpoint format
      else if (Array.isArray(response.contacts)) {
        data = response.contacts;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle services endpoint format
      else if (Array.isArray(response.services)) {
        data = response.services;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle pets endpoint format
      else if (Array.isArray(response.pets)) {
        data = response.pets;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle cases endpoint format
      else if (Array.isArray(response.cases)) {
        data = response.cases;
        total = response.total || 0;
        page = response.pages || response.page || 1;
        limit = response.limit || 10;
        totalPages = response.totalPages || Math.ceil(total / limit);
      }
      // Handle generic array response
      else if (Array.isArray(response)) {
        data = response;
        total = response.length;
        page = 1;
        limit = response.length;
        totalPages = 1;
      }
      // Fallback for unknown formats
      else {
        console.warn('Unknown API response format:', response);
        throw new Error(`Invalid response format: expected array data but got ${typeof response}`);
      }

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error: any) {
      return handleBusinessError(error, `fetch ${this.getEntityName()}`);
    }
  }

  async getById(id: string): Promise<T> {
    try {
      ValidationHelper.requireId(id, this.getEntityName());

      const response = await apiService.get<T>(`${this.baseUrl}/${id}`);
      this.validateObjectResponse(response, this.getEntityName());

      return response;
    } catch (error: any) {
      return handleBusinessError(error, `fetch ${this.getEntityName()}`);
    }
  }

  async create(data: TCreate): Promise<T> {
    try {
      ValidationHelper.requireData(data, this.getEntityName());

      const response = await apiService.post<T>(this.baseUrl, data);

      // Clear cache on create
      if (this.cacheType) {
        ApiCache.clear(this.cacheType);
      }

      this.validateObjectResponse(response, this.getEntityName());

      return response;
    } catch (error: any) {
      return handleBusinessError(error, `create ${this.getEntityName()}`);
    }
  }

  async update(id: string, data: TUpdate): Promise<T> {
    try {
      ValidationHelper.requireId(id, this.getEntityName());
      ValidationHelper.requireData(data, this.getEntityName());

      const response = await apiService.patch<T>(`${this.baseUrl}/${id}`, data);

      // Clear cache on update
      if (this.cacheType) {
        ApiCache.clear(this.cacheType);
      }

      this.validateObjectResponse(response, this.getEntityName());

      return response;
    } catch (error: any) {
      return handleBusinessError(error, `update ${this.getEntityName()}`);
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      ValidationHelper.requireId(id, this.getEntityName());

      const response = await apiService.delete<{ message: string }>(`${this.baseUrl}/${id}`);

      // Clear cache on delete
      if (this.cacheType) {
        ApiCache.clear(this.cacheType);
      }

      return response;
    } catch (error: any) {
      return handleBusinessError(error, `delete ${this.getEntityName()}`);
    }
  }

  // Bulk operations
  async bulkUpdate(ids: string[], updates: Partial<TUpdate>): Promise<BulkOperationResponse> {
    try {
      ValidationHelper.validateArray(ids, 'IDs');
      ValidationHelper.validateMinLength(ids, 1, 'IDs');

      const response = await apiService.patch<BulkOperationResponse>(
        `${this.baseUrl}/bulk-update`,
        {
          ids,
          updates,
        }
      );

      // Clear cache on bulk update
      if (this.cacheType) {
        ApiCache.clear(this.cacheType);
      }

      return response;
    } catch (error: any) {
      return handleBusinessError(error, `bulk update ${this.getEntityName()}`);
    }
  }

  async bulkDelete(ids: string[]): Promise<BulkOperationResponse> {
    try {
      ValidationHelper.validateArray(ids, 'IDs');
      ValidationHelper.validateMinLength(ids, 1, 'IDs');

      const response = await apiService.delete<BulkOperationResponse>(
        `${this.baseUrl}/bulk-delete`,
        {
          data: { ids },
        }
      );

      // Clear cache on bulk delete
      if (this.cacheType) {
        ApiCache.clear(this.cacheType);
      }

      return response;
    } catch (error: any) {
      return handleBusinessError(error, `bulk delete ${this.getEntityName()}`);
    }
  }

  // Export operations
  async exportToCSV(params: ExportParams = {}): Promise<Blob> {
    try {
      const url = createExportUrl(this.baseUrl, params, 'csv');
      return await fetchExportBlob(url);
    } catch (error: any) {
      return handleBusinessError(error, `export ${this.getEntityName()} to CSV`);
    }
  }

  async exportToExcel(params: ExportParams = {}): Promise<Blob> {
    try {
      const url = createExportUrl(this.baseUrl, params, 'excel');
      return await fetchExportBlob(url);
    } catch (error: any) {
      return handleBusinessError(error, `export ${this.getEntityName()} to Excel`);
    }
  }

  // Generic GET request helper
  protected async getRequest<TResponse = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<TResponse> {
    try {
      const queryParams = params ? buildQueryParams(params) : new URLSearchParams();
      const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;

      return await apiService.get<TResponse>(url);
    } catch (error: any) {
      return handleBusinessError(error, `fetch data from ${endpoint}`);
    }
  }

  // Generic POST request helper
  protected async postRequest<TResponse = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    try {
      return await apiService.post<TResponse>(endpoint, data, config);
    } catch (error: any) {
      return handleBusinessError(error, `post data to ${endpoint}`);
    }
  }

  // Generic PUT request helper
  protected async putRequest<TResponse = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    try {
      return await apiService.put<TResponse>(endpoint, data, config);
    } catch (error: any) {
      return handleBusinessError(error, `put data to ${endpoint}`);
    }
  }

  // Generic PATCH request helper
  protected async patchRequest<TResponse = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    try {
      return await apiService.patch<TResponse>(endpoint, data, config);
    } catch (error: any) {
      return handleBusinessError(error, `patch data to ${endpoint}`);
    }
  }

  // Generic DELETE request helper
  protected async deleteRequest<TResponse = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    try {
      return await apiService.delete<TResponse>(endpoint, config);
    } catch (error: any) {
      return handleBusinessError(error, `delete data from ${endpoint}`);
    }
  }

  // Validation helpers
  protected validateArrayResponse(array: any[], entityName: string): void {
    if (!Array.isArray(array)) {
      throw new Error(`Invalid response format: ${entityName} must be an array`);
    }
  }

  protected validateObjectResponse(object: any, entityName: string): void {
    if (!object || typeof object !== 'object') {
      throw new Error(`Invalid response format: ${entityName} must be an object`);
    }
  }

  // Abstract method to be implemented by subclasses
  protected abstract getEntityName(): string;

  // Utility method for cache invalidation
  protected invalidateCache(): void {
    if (this.cacheType) {
      ApiCache.clear(this.cacheType);
    }
  }

  // Health check utility
  static async healthCheck(): Promise<boolean> {
    return apiService.healthCheck();
  }
}

export default BaseService;
