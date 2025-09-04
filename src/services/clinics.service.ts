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
import { apiService } from './api';

export class ClinicsService {
  // Get all clinics with pagination and filters
  static async getClinics(params: ClinicsQueryParams = {}): Promise<{
    clinics: Clinic[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.city) queryParams.append('city', params.city);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/clinics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<{
      clinics: Clinic[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(url);
  }

  // Get clinic by ID
  static async getClinicById(id: string): Promise<Clinic> {
    return apiService.get<Clinic>(`/clinics/${id}`);
  }

  // Create new clinic
  static async createClinic(data: CreateClinicData): Promise<Clinic> {
    return apiService.post<Clinic>('/clinics', data);
  }

  // Update clinic
  static async updateClinic(id: string, data: UpdateClinicData): Promise<Clinic> {
    return apiService.patch<Clinic>(`/clinics/${id}`, data);
  }

  // Delete clinic
  static async deleteClinic(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/clinics/${id}`);
  }

  // Search clinics
  static async searchClinics(query: string): Promise<Clinic[]> {
    return apiService.get<Clinic[]>(`/clinics/search?q=${encodeURIComponent(query)}`);
  }

  // Get clinics by city
  static async getClinicsByCity(city: string): Promise<Clinic[]> {
    return apiService.get<Clinic[]>(`/clinics/city/${encodeURIComponent(city)}`);
  }

  // Get clinic staff
  static async getClinicStaff(clinicId: string): Promise<{
    staff: ClinicStaff[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return apiService.get<{
      staff: ClinicStaff[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/clinics/${clinicId}/staff`);
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
    return apiService.post<ClinicStaff>(`/clinics/${clinicId}/staff`, data);
  }

  // Remove staff member from clinic
  static async removeClinicStaff(clinicId: string, userId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/clinics/${clinicId}/staff/${userId}`);
  }

  // Get clinic services
  static async getClinicServices(clinicId: string): Promise<ClinicService[]> {
    return apiService.get<ClinicService[]>(`/clinics/${clinicId}/services`);
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
    return apiService.post<ClinicService>(`/clinics/${clinicId}/services`, data);
  }

  // Update clinic service
  static async updateClinicService(
    serviceId: string,
    data: Partial<ClinicService>
  ): Promise<ClinicService> {
    return apiService.patch<ClinicService>(`/clinics/services/${serviceId}`, data);
  }

  // Delete clinic service
  static async deleteClinicService(serviceId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/clinics/services/${serviceId}`);
  }

  // Get clinic reviews
  static async getClinicReviews(clinicId: string): Promise<ClinicReview[]> {
    return apiService.get<ClinicReview[]>(`/clinics/${clinicId}/reviews`);
  }

  // Get clinic photos
  static async getClinicPhotos(clinicId: string): Promise<ClinicPhoto[]> {
    return apiService.get<ClinicPhoto[]>(`/clinics/${clinicId}/photos`);
  }

  // Upload clinic photo
  static async uploadClinicPhoto(clinicId: string, formData: FormData): Promise<ClinicPhoto> {
    return apiService.upload<ClinicPhoto>(`/clinics/${clinicId}/photos`, formData);
  }

  // Delete clinic photo
  static async deleteClinicPhoto(photoId: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/clinics/photos/${photoId}`);
  }

  // Get clinic statistics
  static async getClinicStats(clinicId: string): Promise<{
    totalAppointments: number;
    totalPatients: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  }> {
    return apiService.get(`/clinics/${clinicId}/stats`);
  }

  // Bulk operations
  static async bulkUpdateClinics(
    clinicIds: string[],
    updates: Partial<UpdateClinicData>
  ): Promise<{ message: string }> {
    return apiService.patch<{ message: string }>('/clinics/bulk-update', {
      clinicIds,
      updates,
    });
  }

  static async bulkDeleteClinics(clinicIds: string[]): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>('/clinics/bulk-delete', {
      data: { clinicIds },
    });
  }

  // Export clinics to CSV
  static async exportClinicsToCSV(params: ClinicsQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.name) queryParams.append('name', params.name);
    if (params.city) queryParams.append('city', params.city);
    if (params.state) queryParams.append('state', params.state);
    if (params.is_verified !== undefined)
      queryParams.append('is_verified', params.is_verified.toString());
    if (params.isActive !== undefined)
      queryParams.append('is_active', params.isActive.toString());
    if (params.services) queryParams.append('services', params.services);
    if (params.specializations) queryParams.append('specializations', params.specializations);
    if (params.rating_min !== undefined)
      queryParams.append('rating_min', params.rating_min.toString());
    if (params.rating_max !== undefined)
      queryParams.append('rating_max', params.rating_max.toString());

    const url = `/clinics/export/csv${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  // Export clinics to Excel
  static async exportClinicsToExcel(params: ClinicsQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.name) queryParams.append('name', params.name);
    if (params.city) queryParams.append('city', params.city);
    if (params.state) queryParams.append('state', params.state);
    if (params.is_verified !== undefined)
      queryParams.append('is_verified', params.is_verified.toString());
    if (params.isActive !== undefined)
      queryParams.append('is_active', params.isActive.toString());
    if (params.services) queryParams.append('services', params.services);
    if (params.specializations) queryParams.append('specializations', params.specializations);
    if (params.rating_min !== undefined)
      queryParams.append('rating_min', params.rating_min.toString());
    if (params.rating_max !== undefined)
      queryParams.append('rating_max', params.rating_max.toString());

    const url = `/clinics/export/excel${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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

export default ClinicsService;
