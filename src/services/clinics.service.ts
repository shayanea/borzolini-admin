import type {
  Clinic,
  ClinicPhoto,
  ClinicReview,
  ClinicService,
  ClinicsQueryParams,
  ClinicStaff,
  CreateClinicData,
  UpdateClinicData,
} from '@/types';
import { BaseService } from './base.service';

export class ClinicsService extends BaseService<Clinic, CreateClinicData, UpdateClinicData> {
  constructor() {
    super('/clinics');
  }

  protected getEntityName(): string {
    return 'clinic';
  }

  // Get all clinics with pagination and filters
  static async getClinics(params: ClinicsQueryParams = {}): Promise<{
    clinics: Clinic[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const service = new ClinicsService();
    const response = await service.getAll(params);
    return {
      clinics: response.data,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: Math.ceil(response.total / response.limit),
    };
  }

  // Get clinic by ID
  static async getClinicById(id: string): Promise<Clinic> {
    const service = new ClinicsService();
    return service.getById(id);
  }

  // Create new clinic
  static async createClinic(data: CreateClinicData): Promise<Clinic> {
    const service = new ClinicsService();
    return service.create(data);
  }

  // Update clinic
  static async updateClinic(id: string, data: UpdateClinicData): Promise<Clinic> {
    const service = new ClinicsService();
    return service.update(id, data);
  }

  // Delete clinic
  static async deleteClinic(id: string): Promise<{ message: string }> {
    const service = new ClinicsService();
    return service.delete(id);
  }

  // Search clinics
  static async searchClinics(query: string): Promise<Clinic[]> {
    const service = new ClinicsService();
    return service.getRequest<Clinic[]>(`/clinics/search`, { q: query });
  }

  // Get clinics by city
  static async getClinicsByCity(city: string): Promise<Clinic[]> {
    const service = new ClinicsService();
    return service.getRequest<Clinic[]>(`/clinics/city/${encodeURIComponent(city)}`);
  }

  // Get clinic staff
  static async getClinicStaff(clinicId: string): Promise<{
    staff: ClinicStaff[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const service = new ClinicsService();
    return service.getRequest(`/clinics/${clinicId}/staff`);
  }

  // Add staff member to clinic
  static async addClinicStaff(
    clinicId: string,
    data: {
      userId: string;
      role: ClinicStaff['role'];
      specialization?: string;
    }
  ): Promise<ClinicStaff> {
    const service = new ClinicsService();
    return service.postRequest<ClinicStaff>(`/clinics/${clinicId}/staff`, data);
  }

  // Remove staff member from clinic
  static async removeClinicStaff(clinicId: string, userId: string): Promise<{ message: string }> {
    const service = new ClinicsService();
    return service.deleteRequest<{ message: string }>(`/clinics/${clinicId}/staff/${userId}`);
  }

  // Get clinic services
  static async getClinicServices(clinicId: string): Promise<ClinicService[]> {
    const service = new ClinicsService();
    return service.getRequest<ClinicService[]>(`/clinics/${clinicId}/services`);
  }

  // Add service to clinic
  static async addClinicService(
    clinicId: string,
    data: {
      name: string;
      description: string;
      duration: number;
      price: number;
    }
  ): Promise<ClinicService> {
    const service = new ClinicsService();
    return service.postRequest<ClinicService>(`/clinics/${clinicId}/services`, data);
  }

  // Update clinic service
  static async updateClinicService(
    serviceId: string,
    data: Partial<ClinicService>
  ): Promise<ClinicService> {
    const service = new ClinicsService();
    return service.patchRequest<ClinicService>(`/clinics/services/${serviceId}`, data);
  }

  // Delete clinic service
  static async deleteClinicService(serviceId: string): Promise<{ message: string }> {
    const service = new ClinicsService();
    return service.deleteRequest<{ message: string }>(`/clinics/services/${serviceId}`);
  }

  // Get clinic reviews
  static async getClinicReviews(clinicId: string): Promise<ClinicReview[]> {
    const service = new ClinicsService();
    return service.getRequest<ClinicReview[]>(`/clinics/${clinicId}/reviews`);
  }

  // Get clinic photos
  static async getClinicPhotos(clinicId: string): Promise<ClinicPhoto[]> {
    const service = new ClinicsService();
    return service.getRequest<ClinicPhoto[]>(`/clinics/${clinicId}/photos`);
  }

  // Upload clinic photo
  static async uploadClinicPhoto(clinicId: string, formData: FormData): Promise<ClinicPhoto> {
    const service = new ClinicsService();
    return service.postRequest<ClinicPhoto>(`/clinics/${clinicId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Delete clinic photo
  static async deleteClinicPhoto(photoId: string): Promise<{ message: string }> {
    const service = new ClinicsService();
    return service.deleteRequest<{ message: string }>(`/clinics/photos/${photoId}`);
  }

  // Get clinic statistics
  static async getClinicStats(clinicId: string): Promise<{
    totalAppointments: number;
    totalPatients: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  }> {
    const service = new ClinicsService();
    return service.getRequest(`/clinics/${clinicId}/stats`);
  }

  // Bulk operations
  static async bulkUpdateClinics(
    clinicIds: string[],
    updates: Partial<UpdateClinicData>
  ): Promise<any> {
    const service = new ClinicsService();
    return service.bulkUpdate(clinicIds, updates);
  }

  static async bulkDeleteClinics(clinicIds: string[]): Promise<any> {
    const service = new ClinicsService();
    return service.bulkDelete(clinicIds);
  }

  // Export clinics to CSV
  static async exportClinicsToCSV(params: ClinicsQueryParams = {}): Promise<Blob> {
    const service = new ClinicsService();
    return service.exportToCSV(params);
  }

  // Export clinics to Excel
  static async exportClinicsToExcel(params: ClinicsQueryParams = {}): Promise<Blob> {
    const service = new ClinicsService();
    return service.exportToExcel(params);
  }
}

export default ClinicsService;
