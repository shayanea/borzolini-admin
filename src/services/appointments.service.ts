import type { Appointment, AppointmentPriority, AppointmentStatus, AppointmentType } from '@/types';

import { apiService } from './api';
import { appointmentsCache } from './cache.service';
import { environment } from '@/config/environment';

export interface CreateAppointmentData {
  appointment_type: AppointmentType;
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  scheduled_date: string;
  duration_minutes?: number;
  notes?: string;
  reason?: string;
  symptoms?: string;
  is_telemedicine?: boolean;
  telemedicine_link?: string;
  home_visit_address?: string;
  is_home_visit?: boolean;
  pet_id: string;
  clinic_id: string;
  staff_id?: string;
  service_id?: string;
}

export interface UpdateAppointmentData {
  appointment_type?: AppointmentType;
  status?: AppointmentStatus;
  priority?: AppointmentPriority;
  scheduled_date?: string;
  duration_minutes?: number;
  notes?: string;
  reason?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment_plan?: string;
  prescriptions?: string[];
  follow_up_instructions?: string;
  cost?: number;
  payment_status?: string;
  is_telemedicine?: boolean;
  telemedicine_link?: string;
  home_visit_address?: string;
  is_home_visit?: boolean;
  pet_id?: string;
  clinic_id?: string;
  staff_id?: string;
  service_id?: string;
}

export interface AppointmentsFilters {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  type?: AppointmentType;
  priority?: AppointmentPriority;
  clinic_id?: string;
  staff_id?: string;
  pet_id?: string;
  owner_id?: string;
  date_from?: string;
  date_to?: string;
  is_telemedicine?: boolean;
  is_home_visit?: boolean;
  search?: string;
  dateRange?: [string, string]; // For UI compatibility
  cost_min?: number;
  cost_max?: number;
  duration_min?: number;
  duration_max?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AppointmentsResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  no_show: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export class AppointmentsService {
  /**
   * Get all appointments with optional filtering and pagination
   */
  static async getAll(filters: AppointmentsFilters = {}): Promise<AppointmentsResponse> {
    try {
      // Use the utility function for consistent query parameter handling
      const params = apiService.buildQueryParams(filters);
      const queryString = params.toString();
      const url = queryString ? `/appointments?${queryString}` : '/appointments';

      const response = await apiService.get<AppointmentsResponse>(url);

      // Validate response data
      if (!response.appointments || !Array.isArray(response.appointments)) {
        throw new Error('Invalid response format: appointments array is missing');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get current user appointments
   */
  static async getMyAppointments(): Promise<Appointment[]> {
    try {
      const response = await apiService.get<Appointment[]>('/appointments/my-appointments');

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of appointments');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch my appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get appointments by pet
   */
  static async getByPet(petId: string): Promise<Appointment[]> {
    try {
      if (!petId) {
        throw new Error('Pet ID is required');
      }

      const response = await apiService.get<Appointment[]>(`/appointments/pet/${petId}`);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of appointments');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch pet appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get appointments by clinic
   */
  static async getByClinic(clinicId: string, date?: string): Promise<Appointment[]> {
    try {
      if (!clinicId) {
        throw new Error('Clinic ID is required');
      }

      const params = date ? `&date=${date}` : '';
      const response = await apiService.get<Appointment[]>(
        `/appointments/clinic/${clinicId}?limit=5${params}`
      );

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of appointments');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch clinic appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get appointments by staff member
   */
  static async getByStaff(staffId: string, date?: string): Promise<Appointment[]> {
    try {
      if (!staffId) {
        throw new Error('Staff ID is required');
      }

      const params = date ? `?date=${date}` : '';
      const response = await apiService.get<Appointment[]>(
        `/appointments/staff/${staffId}${params}`
      );

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of appointments');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch staff appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get appointment by ID
   */
  static async getById(id: string): Promise<Appointment> {
    try {
      if (!id) {
        throw new Error('Appointment ID is required');
      }

      const response = await apiService.get<Appointment>(`/appointments/${id}`);

      if (!response.id) {
        throw new Error('Invalid response format: appointment ID is missing');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch appointment:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Create new appointment
   */
  static async create(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const isValid = data.pet_id && data.clinic_id && data.scheduled_date;
      if (!isValid) {
        throw new Error('Pet ID, Clinic ID, and scheduled date are required');
      } else {
        // Validate date format
        if (isNaN(Date.parse(data.scheduled_date))) {
          throw new Error('Invalid date format');
        }

        const response = await apiService.post<Appointment>('/appointments', data);

        // Clear cache to ensure fresh data
        appointmentsCache.clear();

        return response;
      }
    } catch (error: any) {
      console.error('Failed to create appointment:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Update an existing appointment
   */
  static async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    try {
      if (!id) {
        throw new Error('Appointment ID is required');
      }

      const response = await apiService.patch<Appointment>(`/appointments/${id}`, data);

      if (!response.id) {
        throw new Error('Invalid response format: appointment ID is missing');
      }

      // Clear cache to reflect changes
      apiService.clearCache('appointments');

      return response;
    } catch (error: any) {
      console.error('Failed to update appointment:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Update appointment status
   */
  static async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    try {
      if (!id) {
        throw new Error('Appointment ID is required');
      }

      if (!status) {
        throw new Error('Status is required');
      }

      const response = await apiService.patch<Appointment>(
        `/appointments/${id}/status?status=${status}`
      );

      // Clear cache to ensure fresh data
      appointmentsCache.clear();

      return response;
    } catch (error: any) {
      console.error('Failed to update appointment status:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Reschedule appointment
   */
  static async reschedule(id: string, newDate: string): Promise<Appointment> {
    try {
      if (!id) {
        throw new Error('Appointment ID is required');
      }

      if (!newDate || isNaN(Date.parse(newDate))) {
        throw new Error('Valid new date is required');
      }

      const response = await apiService.patch<Appointment>(
        `/appointments/${id}/reschedule?new_date=${newDate}`
      );

      // Clear cache to ensure fresh data
      appointmentsCache.clear();

      return response;
    } catch (error: any) {
      console.error('Failed to reschedule appointment:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  static async cancel(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Appointment ID is required');
      }

      await apiService.delete(`/appointments/${id}`);

      // Clear cache to ensure fresh data
      appointmentsCache.clear();
    } catch (error: any) {
      console.error('Failed to cancel appointment:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get today's appointments
   */
  static async getToday(clinicId?: string): Promise<Appointment[]> {
    try {
      const params = clinicId ? `?clinic_id=${clinicId}` : '';
      const response = await apiService.get<Appointment[]>(`/appointments/today${params}`);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of appointments');
      }

      return response;
    } catch (error: any) {
      console.error("Failed to fetch today's appointments:", error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get upcoming appointments
   */
  static async getUpcoming(days: number = 7): Promise<Appointment[]> {
    try {
      if (days < 1 || days > 365) {
        throw new Error('Days must be between 1 and 365');
      }

      const response = await apiService.get<Appointment[]>(`/appointments/upcoming?days=${days}`);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of appointments');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch upcoming appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get available time slots for a clinic
   */
  static async getAvailableSlots(
    clinicId: string,
    date: string,
    duration: number = 30
  ): Promise<string[]> {
    try {
      if (!clinicId) {
        throw new Error('Clinic ID is required');
      }

      if (!date || isNaN(Date.parse(date))) {
        throw new Error('Valid date is required');
      }

      if (duration < 15 || duration > 480) {
        throw new Error('Duration must be between 15 and 480 minutes');
      }

      const response = await apiService.get<string[]>(
        `/appointments/available-slots/${clinicId}?date=${date}&duration=${duration}`
      );

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of time slots');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch available slots:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Get appointment statistics
   */
  static async getStats(): Promise<AppointmentStats> {
    try {
      const response = await apiService.get<AppointmentStats>('/appointments/stats');

      // Validate response structure
      if (typeof response.total !== 'number') {
        throw new Error('Invalid response format: stats data is missing');
      }

      return response;
    } catch (error: any) {
      console.error('Failed to fetch appointment stats:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Bulk update appointments
   */
  static async bulkUpdate(
    appointmentIds: string[],
    updates: Partial<UpdateAppointmentData>
  ): Promise<Appointment[]> {
    try {
      if (!appointmentIds.length) {
        throw new Error('At least one appointment ID is required');
      }

      const response = await apiService.patch<Appointment[]>('/appointments/bulk-update', {
        appointment_ids: appointmentIds,
        updates,
      });

      // Clear cache to ensure fresh data
      appointmentsCache.clear();

      return response;
    } catch (error: any) {
      console.error('Failed to bulk update appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }

  /**
   * Export appointments
   */
  static async export(
    filters: AppointmentsFilters = {},
    format: 'csv' | 'excel' = 'csv'
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      params.append('format', format);

      const response = await window.fetch(
        `${environment.api.baseUrl}/appointments/export?${params.toString()}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error: any) {
      console.error('Failed to export appointments:', error);
      // Let axios interceptor handle HTTP errors, only re-throw business logic errors
      throw error;
    }
  }
}

export default AppointmentsService;
