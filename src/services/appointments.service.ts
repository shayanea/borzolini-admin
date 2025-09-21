import type { Appointment, AppointmentPriority, AppointmentStatus, AppointmentType } from '@/types';

import { BaseQueryParams, BaseService } from './base.service';

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

export interface AppointmentsFilters extends BaseQueryParams {
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
  byStatus: {
    pending: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    no_show: number;
  };
  byType: {
    consultation: number;
    vaccination: number;
    surgery: number;
    follow_up: number;
    emergency: number;
    wellness_exam: number;
    dental_cleaning: number;
    laboratory_test: number;
    imaging: number;
    therapy: number;
    grooming: number;
    behavioral_training: number;
    nutrition_consultation: number;
    physical_therapy: number;
    specialist_consultation: number;
  };
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

export class AppointmentsService extends BaseService<
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData
> {
  constructor() {
    super('/appointments', 'appointments');
  }

  protected getEntityName(): string {
    return 'appointment';
  }

  /**
   * Get all appointments with optional filtering and pagination
   */
  static async getAll(filters: AppointmentsFilters = {}): Promise<AppointmentsResponse> {
    const service = new AppointmentsService();
    const response = await service.getAll(filters);
    return {
      appointments: response.data,
      total: response.total,
      page: response.page,
      limit: response.limit,
    };
  }

  /**
   * Get current user appointments
   */
  static async getMyAppointments(): Promise<Appointment[]> {
    const service = new AppointmentsService();
    return service.getRequest<Appointment[]>('/appointments/my-appointments');
  }

  /**
   * Get appointments by pet
   */
  static async getByPet(petId: string): Promise<Appointment[]> {
    const service = new AppointmentsService();
    service.validateArrayResponse([petId], 'petId'); // Simple validation
    return service.getRequest<Appointment[]>(`/appointments/pet/${petId}`);
  }

  /**
   * Get appointments by clinic
   */
  static async getByClinic(clinicId: string, date?: string): Promise<Appointment[]> {
    const service = new AppointmentsService();
    const params = date ? { date, limit: 5 } : { limit: 5 };
    return service.getRequest<Appointment[]>(`/appointments/clinic/${clinicId}`, params);
  }

  /**
   * Get appointments by staff member
   */
  static async getByStaff(staffId: string, date?: string): Promise<Appointment[]> {
    const service = new AppointmentsService();
    const params = date ? { date } : undefined;
    return service.getRequest<Appointment[]>(`/appointments/staff/${staffId}`, params);
  }

  /**
   * Get appointment by ID
   */
  static async getById(id: string): Promise<Appointment> {
    const service = new AppointmentsService();
    return service.getById(id);
  }

  /**
   * Create new appointment
   */
  static async create(data: CreateAppointmentData): Promise<Appointment> {
    // Custom validation for appointment creation
    if (!data.pet_id || !data.clinic_id || !data.scheduled_date) {
      throw new Error('Pet ID, Clinic ID, and scheduled date are required');
    }
    if (isNaN(Date.parse(data.scheduled_date))) {
      throw new Error('Invalid date format');
    }

    const service = new AppointmentsService();
    return service.create(data);
  }

  /**
   * Update an existing appointment
   */
  static async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    const service = new AppointmentsService();
    return service.update(id, data);
  }

  /**
   * Update appointment status
   */
  static async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    if (!status) {
      throw new Error('Status is required');
    }

    const service = new AppointmentsService();
    return service.patchRequest<Appointment>(`/appointments/${id}/status`, undefined, {
      params: { status },
    });
  }

  /**
   * Reschedule appointment
   */
  static async reschedule(id: string, newDate: string): Promise<Appointment> {
    if (!newDate || isNaN(Date.parse(newDate))) {
      throw new Error('Valid new date is required');
    }

    const service = new AppointmentsService();
    return service.patchRequest<Appointment>(`/appointments/${id}/reschedule`, undefined, {
      params: { new_date: newDate },
    });
  }

  /**
   * Cancel appointment
   */
  static async cancel(id: string): Promise<void> {
    const service = new AppointmentsService();
    await service.deleteRequest(`/appointments/${id}`);
  }

  /**
   * Get today's appointments
   */
  static async getToday(clinicId?: string): Promise<Appointment[]> {
    const service = new AppointmentsService();
    const params = clinicId ? { clinic_id: clinicId } : undefined;
    return service.getRequest<Appointment[]>('/appointments/today', params);
  }

  /**
   * Get upcoming appointments
   */
  static async getUpcoming(days: number = 7): Promise<Appointment[]> {
    if (days < 1 || days > 365) {
      throw new Error('Days must be between 1 and 365');
    }

    const service = new AppointmentsService();
    return service.getRequest<Appointment[]>(`/appointments/upcoming`, { days });
  }

  /**
   * Get available time slots for a clinic
   */
  static async getAvailableSlots(
    clinicId: string,
    date: string,
    duration: number = 30
  ): Promise<string[]> {
    if (!date || isNaN(Date.parse(date))) {
      throw new Error('Valid date is required');
    }
    if (duration < 15 || duration > 480) {
      throw new Error('Duration must be between 15 and 480 minutes');
    }

    const service = new AppointmentsService();
    return service.getRequest<string[]>(`/appointments/available-slots/${clinicId}`, {
      date,
      duration,
    });
  }

  /**
   * Get appointment statistics
   */
  static async getStats(): Promise<AppointmentStats> {
    const service = new AppointmentsService();
    const response = await service.getRequest<AppointmentStats>('/appointments/stats');
    if (typeof response.total !== 'number') {
      throw new Error('Invalid response format: stats data is missing');
    }
    return response;
  }

  /**
   * Bulk update appointments
   */
  static async bulkUpdate(
    appointmentIds: string[],
    updates: Partial<UpdateAppointmentData>
  ): Promise<any> {
    const service = new AppointmentsService();
    return service.bulkUpdate(appointmentIds, updates);
  }

  /**
   * Export appointments to CSV
   */
  static async exportToCSV(filters: AppointmentsFilters = {}): Promise<Blob> {
    const service = new AppointmentsService();
    return service.exportToCSV(filters);
  }

  /**
   * Export appointments to Excel
   */
  static async exportToExcel(filters: AppointmentsFilters = {}): Promise<Blob> {
    const service = new AppointmentsService();
    return service.exportToExcel(filters);
  }
}

export default AppointmentsService;
