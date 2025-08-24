import { apiService } from './api';
import type { Appointment, AppointmentStatus, AppointmentType, AppointmentPriority } from '@/types';

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
}

export interface AppointmentsResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
}

export class AppointmentsService {
  /**
   * Get all appointments with optional filtering and pagination
   */
  static async getAll(filters: AppointmentsFilters = {}): Promise<AppointmentsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString ? `/appointments?${queryString}` : '/appointments';
    
    return apiService.get<AppointmentsResponse>(url);
  }

  /**
   * Get current user appointments
   */
  static async getMyAppointments(): Promise<Appointment[]> {
    return apiService.get<Appointment[]>('/appointments/my-appointments');
  }

  /**
   * Get appointments by pet
   */
  static async getByPet(petId: string): Promise<Appointment[]> {
    return apiService.get<Appointment[]>(`/appointments/pet/${petId}`);
  }

  /**
   * Get appointments by clinic
   */
  static async getByClinic(clinicId: string, date?: string): Promise<Appointment[]> {
    const params = date ? `?date=${date}` : '';
    return apiService.get<Appointment[]>(`/appointments/clinic/${clinicId}${params}`);
  }

  /**
   * Get appointments by staff member
   */
  static async getByStaff(staffId: string, date?: string): Promise<Appointment[]> {
    const params = date ? `?date=${date}` : '';
    return apiService.get<Appointment[]>(`/appointments/staff/${staffId}${params}`);
  }

  /**
   * Get appointment by ID
   */
  static async getById(id: string): Promise<Appointment> {
    return apiService.get<Appointment>(`/appointments/${id}`);
  }

  /**
   * Create new appointment
   */
  static async create(data: CreateAppointmentData): Promise<Appointment> {
    return apiService.post<Appointment>('/appointments', data);
  }

  /**
   * Update appointment
   */
  static async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    return apiService.patch<Appointment>(`/appointments/${id}`, data);
  }

  /**
   * Update appointment status
   */
  static async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return apiService.patch<Appointment>(`/appointments/${id}/status?status=${status}`);
  }

  /**
   * Reschedule appointment
   */
  static async reschedule(id: string, newDate: string): Promise<Appointment> {
    return apiService.patch<Appointment>(`/appointments/${id}/reschedule?new_date=${newDate}`);
  }

  /**
   * Cancel appointment
   */
  static async cancel(id: string): Promise<void> {
    return apiService.delete(`/appointments/${id}`);
  }

  /**
   * Get today's appointments
   */
  static async getToday(clinicId?: string): Promise<Appointment[]> {
    const params = clinicId ? `?clinic_id=${clinicId}` : '';
    return apiService.get<Appointment[]>(`/appointments/today${params}`);
  }

  /**
   * Get upcoming appointments
   */
  static async getUpcoming(days: number = 7): Promise<Appointment[]> {
    return apiService.get<Appointment[]>(`/appointments/upcoming?days=${days}`);
  }

  /**
   * Get available time slots for a clinic
   */
  static async getAvailableSlots(clinicId: string, date: string, duration: number = 30): Promise<string[]> {
    return apiService.get<string[]>(`/appointments/available-slots/${clinicId}?date=${date}&duration=${duration}`);
  }

  /**
   * Get appointment statistics
   */
  static async getStats(): Promise<any> {
    return apiService.get('/appointments/stats');
  }
}

export default AppointmentsService;
