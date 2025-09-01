import type {
  CalendarAppointment,
  CalendarFilters,
  CalendarResponse,
  CreateAppointmentRequest,
  DeleteAppointmentRequest,
  TimeSlotAvailability,
  UpdateAppointmentRequest,
  Veterinarian,
} from '@/types/calendar';

import { apiService } from './api';
import type { CalendarClinic } from '@/types/calendar-modals';

export interface CalendarServiceInterface {
  // Core calendar data
  getCalendarData: (date: string, filters?: CalendarFilters) => Promise<CalendarResponse>;
  getVeterinarians: () => Promise<Veterinarian[]>;
  getAppointments: (date: string, veterinarianId?: string) => Promise<CalendarAppointment[]>;

  // Appointment management
  createAppointment: (appointment: CreateAppointmentRequest) => Promise<CalendarAppointment>;
  updateAppointment: (
    appointmentId: string,
    updates: UpdateAppointmentRequest
  ) => Promise<CalendarAppointment>;
  deleteAppointment: (appointmentId: string, reason?: string) => Promise<void>;

  // Availability and scheduling
  getTimeSlotAvailability: (
    date: string,
    veterinarianId: string,
    timeSlot: string
  ) => Promise<TimeSlotAvailability>;
  getAvailableTimeSlots: (date: string, veterinarianId: string) => Promise<string[]>;

  // Calendar utilities
  getWorkingHours: () => Promise<{ start: string; end: string }>;
  getHolidays: (year: number) => Promise<string[]>;
  getClinicSchedule: (
    date: string
  ) => Promise<{ isOpen: boolean; hours?: { start: string; end: string } }>;

  // Additional data for forms
  getPets: () => Promise<any[]>;
  getClinics: () => Promise<CalendarClinic[]>;
  getServices: () => Promise<any[]>;
}

class CalendarService implements CalendarServiceInterface {
  private readonly baseUrl = '/calendar';
  private readonly appointmentsUrl = '/appointments';
  private readonly veterinariansUrl = '/veterinarians';
  private readonly petsUrl = '/pets';
  private readonly clinicsUrl = '/clinics';
  private readonly servicesUrl = '/services';

  /**
   * Get comprehensive calendar data for a specific date
   */
  async getCalendarData(date: string, filters?: CalendarFilters): Promise<CalendarResponse> {
    try {
      // Start with the date parameter
      const baseParams = { date };
      
      // Merge with filters if provided
      const allParams = filters ? { ...baseParams, ...filters } : baseParams;
      
      // Use the utility function for consistent query parameter handling
      const params = apiService.buildQueryParams(allParams);

      const response = await apiService.get<CalendarResponse>(
        `${this.baseUrl}/data?${params.toString()}`
      );
      
      return response;
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      throw new Error('Failed to load calendar data. Please try again.');
    }
  }

  /**
   * Get all available veterinarians
   */
  async getVeterinarians(): Promise<Veterinarian[]> {
    try {
      const response = await apiService.get<Veterinarian[]>(this.veterinariansUrl);
      return response;
    } catch (error) {
      console.error('Failed to fetch veterinarians:', error);
      throw new Error('Failed to load veterinarian list. Please try again.');
    }
  }

  /**
   * Get appointments for a specific date and optionally filtered by veterinarian
   */
  async getAppointments(date: string, veterinarianId?: string): Promise<CalendarAppointment[]> {
    try {
      const params = apiService.buildQueryParams({ date, veterinarianId });
      const response = await apiService.get<CalendarAppointment[]>(
        `${this.appointmentsUrl}?${params.toString()}`
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      throw new Error('Failed to load appointments. Please try again.');
    }
  }

  /**
   * Create a new appointment
   */
  async createAppointment(appointment: CreateAppointmentRequest): Promise<CalendarAppointment> {
    try {
      const response = await apiService.post<CalendarAppointment>(
        this.appointmentsUrl,
        appointment
      );

      // Clear calendar cache to reflect new appointment
      apiService.clearCache('appointments');

      return response;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      throw new Error('Failed to create appointment. Please check the details and try again.');
    }
  }

  /**
   * Update an existing appointment
   */
  async updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentRequest
  ): Promise<CalendarAppointment> {
    try {
      const response = await apiService.put<CalendarAppointment>(
        `${this.appointmentsUrl}/${appointmentId}`,
        updates
      );

      // Clear calendar cache to reflect changes
      apiService.clearCache('appointments');

      return response;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      throw new Error('Failed to update appointment. Please try again.');
    }
  }

  /**
   * Delete an appointment
   */
  async deleteAppointment(appointmentId: string, reason?: string): Promise<void> {
    try {
      const deleteRequest: DeleteAppointmentRequest = { reason };

      await apiService.delete(`${this.appointmentsUrl}/${appointmentId}`, {
        data: deleteRequest,
      });

      // Clear calendar cache to reflect deletion
      apiService.clearCache('appointments');
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      throw new Error('Failed to delete appointment. Please try again.');
    }
  }

  /**
   * Check availability for a specific time slot and veterinarian
   */
  async getTimeSlotAvailability(
    date: string,
    veterinarianId: string,
    timeSlot: string
  ): Promise<TimeSlotAvailability> {
    try {
      const params = new URLSearchParams({
        date,
        veterinarianId,
        timeSlot,
      });

      const response = await apiService.get<TimeSlotAvailability>(
        `${this.baseUrl}/availability?${params.toString()}`
      );

      return response;
    } catch (error) {
      console.error('Failed to check time slot availability:', error);
      throw new Error('Failed to check availability. Please try again.');
    }
  }

  /**
   * Get available time slots for a specific date and veterinarian
   */
  async getAvailableTimeSlots(date: string, veterinarianId: string): Promise<string[]> {
    try {
      const params = new URLSearchParams({ date, veterinarianId });

      const response = await apiService.get<string[]>(
        `${this.baseUrl}/available-slots?${params.toString()}`
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch available time slots:', error);
      throw new Error('Failed to load available time slots. Please try again.');
    }
  }

  /**
   * Get clinic working hours
   */
  async getWorkingHours(): Promise<{ start: string; end: string }> {
    try {
      const response = await apiService.get<{ start: string; end: string }>(
        `${this.baseUrl}/working-hours`
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch working hours:', error);
      // Return default working hours as fallback
      return { start: '08:00', end: '18:00' };
    }
  }

  /**
   * Get holidays for a specific year
   */
  async getHolidays(year: number): Promise<string[]> {
    try {
      const response = await apiService.get<string[]>(`${this.baseUrl}/holidays?year=${year}`);

      return response;
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
      return [];
    }
  }

  /**
   * Get clinic schedule for a specific date
   */
  async getClinicSchedule(
    date: string
  ): Promise<{ isOpen: boolean; hours?: { start: string; end: string } }> {
    try {
      const response = await apiService.get<{
        isOpen: boolean;
        hours?: { start: string; end: string };
      }>(`${this.baseUrl}/schedule?date=${date}`);

      return response;
    } catch (error) {
      console.error('Failed to fetch clinic schedule:', error);
      // Return default schedule as fallback
      return { isOpen: true, hours: { start: '08:00', end: '18:00' } };
    }
  }

  /**
   * Get all pets for appointment forms
   */
  async getPets(): Promise<any[]> {
    try {
      const response = await apiService.get<any>(`${this.petsUrl}?limit=100&isActive=true`);
      // Handle both array responses and paginated responses
      if (Array.isArray(response)) {
        return response;
      }
      return response?.data || [];
    } catch (error) {
      console.error('Failed to fetch pets:', error);
      throw new Error('Failed to load pets list. Please try again.');
    }
  }

  /**
   * Get all clinics for appointment forms
   */
  async getClinics(): Promise<CalendarClinic[]> {
    try {
      const response = await apiService.get<any>(`${this.clinicsUrl}?limit=100&isActive=true`);
      // Handle both array responses and paginated responses
      if (Array.isArray(response)) {
        return response;
      }
      return response?.data || [];
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
      throw new Error('Failed to load clinics list. Please try again.');
    }
  }

  /**
   * Get all services for appointment forms
   */
  async getServices(): Promise<any[]> {
    try {
      const response = await apiService.get<any>(`${this.servicesUrl}?limit=100&isActive=true`);
      // Handle both array responses and paginated responses
      if (Array.isArray(response)) {
        return response;
      }
      return response?.data || [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw new Error('Failed to load services list. Please try again.');
    }
  }
}

// Export singleton instance
export const calendarService = new CalendarService();

// Export the class for testing purposes
export { CalendarService };

export default calendarService;
