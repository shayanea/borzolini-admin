import { BaseQueryParams, BaseService, PaginatedResponse } from './base.service';

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

export type CreateVeterinaryServiceData = Omit<VeterinaryService, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateVeterinaryServiceData = Partial<CreateVeterinaryServiceData>;

export interface ServicesQueryParams extends BaseQueryParams {
  category?: string;
  isActive?: boolean;
}

export class ServicesService extends BaseService<
  VeterinaryService,
  CreateVeterinaryServiceData,
  UpdateVeterinaryServiceData
> {
  private static instance: ServicesService;

  constructor() {
    super('/services', 'lookups');
  }

  static getInstance(): ServicesService {
    if (!ServicesService.instance) {
      ServicesService.instance = new ServicesService();
    }
    return ServicesService.instance;
  }

  protected getEntityName(): string {
    return 'service';
  }
  // Override getAll to handle ServicesQueryParams
  async getServices(
    params: ServicesQueryParams = {}
  ): Promise<PaginatedResponse<VeterinaryService>> {
    return super.getAll(params);
  }

  // Get services by category
  async getServicesByCategory(category: string): Promise<VeterinaryService[]> {
    return this.getRequest<VeterinaryService[]>(`${this.baseUrl}/category/${category}`);
  }

  // Get active services
  async getActiveServices(): Promise<VeterinaryService[]> {
    return this.getRequest<VeterinaryService[]>(`${this.baseUrl}/active`);
  }

  // Get service categories
  async getServiceCategories(): Promise<string[]> {
    return this.getRequest<string[]>(`${this.baseUrl}/categories`);
  }

  // Get services by clinic
  async getServicesByClinic(clinicId: string): Promise<VeterinaryService[]> {
    return this.getRequest<VeterinaryService[]>(`${this.baseUrl}/clinic/${clinicId}`);
  }

  // Get services by veterinarian
  async getServicesByVeterinarian(veterinarianId: string): Promise<VeterinaryService[]> {
    return this.getRequest<VeterinaryService[]>(`${this.baseUrl}/veterinarian/${veterinarianId}`);
  }

  // Static methods for backward compatibility
  static async getServices(params: ServicesQueryParams = {}) {
    return ServicesService.getInstance().getServices(params);
  }

  static async getServiceById(id: string) {
    return ServicesService.getInstance().getById(id);
  }

  static async createService(data: CreateVeterinaryServiceData) {
    return ServicesService.getInstance().create(data);
  }

  static async updateService(id: string, data: UpdateVeterinaryServiceData) {
    return ServicesService.getInstance().update(id, data);
  }

  static async deleteService(id: string) {
    return ServicesService.getInstance().delete(id);
  }

  static async getServicesByCategory(category: string) {
    return ServicesService.getInstance().getServicesByCategory(category);
  }

  static async getActiveServices() {
    return ServicesService.getInstance().getActiveServices();
  }

  static async getServiceCategories() {
    return ServicesService.getInstance().getServiceCategories();
  }

  static async getServicesByClinic(clinicId: string) {
    return ServicesService.getInstance().getServicesByClinic(clinicId);
  }

  static async getServicesByVeterinarian(veterinarianId: string) {
    return ServicesService.getInstance().getServicesByVeterinarian(veterinarianId);
  }
}

// Export default instance
export const servicesService = ServicesService.getInstance();
export default ServicesService;
