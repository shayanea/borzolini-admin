import type {
  ContactFilters,
  CreateContactResponseData,
  UpdateContactData,
  UpdateContactResponseData,
} from '@/types';

import { apiService } from './api/index';

export class ContactService {
  private static readonly BASE_URL = '/api/v1/contact';

  // Get all contacts with filters and pagination
  static async getAll(filters?: ContactFilters, page = 1, limit = 10) {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get(`${this.BASE_URL}?${params.toString()}`);
  }

  // Get contact by ID
  static async getById(id: string) {
    return apiService.get(`${this.BASE_URL}/${id}`);
  }

  // Update contact
  static async update(id: string, data: UpdateContactData) {
    return apiService.patch(`${this.BASE_URL}/${id}`, data);
  }

  // Delete contact
  static async delete(id: string) {
    return apiService.delete(`${this.BASE_URL}/${id}`);
  }

  // Get contact statistics
  static async getStats() {
    return apiService.get(`${this.BASE_URL}/stats`);
  }

  // Get contact responses
  static async getResponses(contactId: string) {
    return apiService.get(`${this.BASE_URL}/${contactId}/responses`);
  }

  // Create contact response
  static async createResponse(contactId: string, data: CreateContactResponseData) {
    return apiService.post(`${this.BASE_URL}/${contactId}/responses`, data);
  }

  // Update contact response
  static async updateResponse(
    contactId: string,
    responseId: string,
    data: UpdateContactResponseData
  ) {
    return apiService.patch(`${this.BASE_URL}/${contactId}/responses/${responseId}`, data);
  }

  // Delete contact response
  static async deleteResponse(contactId: string, responseId: string) {
    return apiService.delete(`${this.BASE_URL}/${contactId}/responses/${responseId}`);
  }

  // Export contacts
  static async export(filters?: ContactFilters) {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    return apiService.get(`${this.BASE_URL}/export?${params.toString()}`);
  }
}
