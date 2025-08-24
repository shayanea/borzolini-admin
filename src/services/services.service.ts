import { apiService } from './api';

export interface VeterinaryService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  isActive: boolean;
  requiresConsultation: boolean;
  preparationInstructions?: string;
  aftercareInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ServicesService {
  // Get all services with pagination and filters
  static async getServices(params: ServicesQueryParams = {}): Promise<{
    data: VeterinaryService[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get(url);
  }

  // Get service by ID
  static async getServiceById(id: string): Promise<VeterinaryService> {
    return apiService.get<VeterinaryService>(`/services/${id}`);
  }

  // Get services by category
  static async getServicesByCategory(category: string): Promise<VeterinaryService[]> {
    return apiService.get<VeterinaryService[]>(`/services/category/${category}`);
  }

  // Get active services
  static async getActiveServices(): Promise<VeterinaryService[]> {
    return apiService.get<VeterinaryService[]>('/services/active');
  }

  // Create new service
  static async createService(data: Omit<VeterinaryService, 'id' | 'createdAt' | 'updatedAt'>): Promise<VeterinaryService> {
    return apiService.post<VeterinaryService>('/services', data);
  }

  // Update service
  static async updateService(id: string, data: Partial<Omit<VeterinaryService, 'id' | 'createdAt' | 'updatedAt'>>): Promise<VeterinaryService> {
    return apiService.put<VeterinaryService>(`/services/${id}`, data);
  }

  // Delete service
  static async deleteService(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/services/${id}`);
  }

  // Get service categories
  static async getServiceCategories(): Promise<string[]> {
    return apiService.get<string[]>('/services/categories');
  }

  // Get services by clinic
  static async getServicesByClinic(clinicId: string): Promise<VeterinaryService[]> {
    return apiService.get<VeterinaryService[]>(`/services/clinic/${clinicId}`);
  }

  // Get services by veterinarian
  static async getServicesByVeterinarian(veterinarianId: string): Promise<VeterinaryService[]> {
    return apiService.get<VeterinaryService[]>(`/services/veterinarian/${veterinarianId}`);
  }
}

export default ServicesService;
