import type { CreateFAQDto, FAQ, FAQQueryParams, FAQResponse, UpdateFAQDto } from '@/types';
import { BaseService } from '../core/base.service';

export class FAQService extends BaseService<FAQ, CreateFAQDto, UpdateFAQDto> {
  constructor() {
    super('/faq');
  }

  protected getEntityName(): string {
    return 'FAQ';
  }

  // Get all FAQs with pagination and filters
  static async getFAQs(params: FAQQueryParams = {}): Promise<FAQResponse> {
    const service = new FAQService();
    return service.getRequest<FAQResponse>('/faq', params);
  }

  // Get FAQ by ID
  static async getFAQById(id: string): Promise<FAQ> {
    const service = new FAQService();
    return service.getById(id);
  }

  // Create new FAQ (admin only)
  static async createFAQ(data: CreateFAQDto): Promise<FAQ> {
    const service = new FAQService();
    return service.create(data);
  }

  // Update FAQ (admin only)
  static async updateFAQ(id: string, data: UpdateFAQDto): Promise<FAQ> {
    const service = new FAQService();
    return service.update(id, data);
  }

  // Delete FAQ (admin only)
  static async deleteFAQ(id: string): Promise<{ message: string }> {
    const service = new FAQService();
    return service.delete(id);
  }

  // Bulk delete FAQs
  static async bulkDeleteFAQs(faqIds: string[]): Promise<any> {
    const service = new FAQService();
    return service.bulkDelete(faqIds);
  }

  // Search FAQs
  static async searchFAQs(query: string): Promise<FAQ[]> {
    const service = new FAQService();
    return service.getRequest<FAQ[]>(`/faq/search`, { q: query });
  }

  // Get FAQs by category
  static async getFAQsByCategory(category: string): Promise<FAQ[]> {
    const service = new FAQService();
    return service.getRequest<FAQ[]>(`/faq/category/${encodeURIComponent(category)}`);
  }

  // Get all categories
  static async getCategories(): Promise<string[]> {
    const service = new FAQService();
    return service.getRequest<string[]>(`/faq/categories`);
  }
}

export default FAQService;
