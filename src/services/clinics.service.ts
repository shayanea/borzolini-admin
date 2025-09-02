import { apiService } from './api';

export interface Clinic {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  website?: string;
  operatingHours: ClinicOperatingHours[];
  services: ClinicService[];
  staff: ClinicStaff[];
  photos: ClinicPhoto[];
  reviews: ClinicReview[];
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicOperatingHours {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface ClinicService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
}

export interface ClinicStaff {
  id: string;
  userId: string;
  role: 'veterinarian' | 'nurse' | 'receptionist' | 'technician';
  specialization?: string;
  isActive: boolean;
  joinedAt: string;
}

export interface ClinicPhoto {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface ClinicReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateClinicData {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  website?: string;
}

export interface UpdateClinicData {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

export interface ClinicsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

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
    return apiService.get(url);
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
  static async getClinicStaff(
    clinicId: string
  ): Promise<{
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

  // Export clinics
  static async exportClinics(params: ClinicsQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.city) queryParams.append('city', params.city);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const url = `/clinics/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await apiService.get(url, {
      responseType: 'blob',
    });

    return response;
  }
}

export default ClinicsService;
