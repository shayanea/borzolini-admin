import { BaseQueryParams, BaseService, PaginatedResponse } from './base.service';
import type {
  Contact,
  ContactFilters,
  ContactStats,
  CreateContactResponseData,
  UpdateContactData,
  UpdateContactResponseData,
} from '@/types';

export interface ContactQueryParams extends BaseQueryParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class ContactService extends BaseService<Contact, never, UpdateContactData> {
  private static instance: ContactService;

  constructor() {
    super('/contact', 'lookups');
  }

  static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  protected getEntityName(): string {
    return 'contact';
  }

  // Override getAll to handle ContactFilters
  async getAll(
    filters?: ContactFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Contact>> {
    const params: ContactQueryParams = {
      page,
      limit,
      search: filters?.search,
      status: filters?.status,
      dateFrom: filters?.dateFrom,
      dateTo: filters?.dateTo,
    };

    return super.getAll(params);
  }

  // Get contact statistics
  async getStats(): Promise<ContactStats> {
    return this.getRequest<ContactStats>(`${this.baseUrl}/stats`);
  }

  // Get contact responses
  async getResponses(contactId: string) {
    return this.getRequest(`${this.baseUrl}/${contactId}/responses`);
  }

  // Create contact response
  async createResponse(contactId: string, data: CreateContactResponseData) {
    return this.postRequest(`${this.baseUrl}/${contactId}/responses`, data);
  }

  // Update contact response
  async updateResponse(contactId: string, responseId: string, data: UpdateContactResponseData) {
    return this.patchRequest(`${this.baseUrl}/${contactId}/responses/${responseId}`, data);
  }

  // Delete contact response
  async deleteResponse(contactId: string, responseId: string) {
    return this.deleteRequest(`${this.baseUrl}/${contactId}/responses/${responseId}`);
  }

  // Export contacts to CSV
  async exportContacts(filters?: ContactFilters): Promise<Blob> {
    const params: ContactQueryParams = {
      search: filters?.search,
      status: filters?.status,
      dateFrom: filters?.dateFrom,
      dateTo: filters?.dateTo,
    };

    return this.exportToCSV(params);
  }

  // Static methods for backward compatibility
  static async getAll(filters?: ContactFilters, page = 1, limit = 10) {
    return ContactService.getInstance().getAll(filters, page, limit);
  }

  static async getById(id: string) {
    return ContactService.getInstance().getById(id);
  }

  static async update(id: string, data: UpdateContactData) {
    return ContactService.getInstance().update(id, data);
  }

  static async delete(id: string) {
    return ContactService.getInstance().delete(id);
  }

  static async getStats() {
    return ContactService.getInstance().getStats();
  }

  static async getResponses(contactId: string) {
    return ContactService.getInstance().getResponses(contactId);
  }

  static async createResponse(contactId: string, data: CreateContactResponseData) {
    return ContactService.getInstance().createResponse(contactId, data);
  }

  static async updateResponse(
    contactId: string,
    responseId: string,
    data: UpdateContactResponseData
  ) {
    return ContactService.getInstance().updateResponse(contactId, responseId, data);
  }

  static async deleteResponse(contactId: string, responseId: string) {
    return ContactService.getInstance().deleteResponse(contactId, responseId);
  }

  static async export(filters?: ContactFilters) {
    return ContactService.getInstance().exportContacts(filters);
  }
}

// Export default instance
export const contactService = ContactService.getInstance();
