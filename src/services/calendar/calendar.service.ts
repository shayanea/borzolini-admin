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

import type { CalendarClinic } from '@/types/calendar-modals';
import { apiService } from '../api/index';

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
  getClinics: () => Promise<CalendarClinic[]>;
}

class CalendarService implements CalendarServiceInterface {
  private readonly baseUrl = '/calendar';
  private readonly appointmentsUrl = '/appointments';
  private readonly clinicsUrl = '/clinics';

  // Cache for current user's clinic id to avoid extra round trips
  private myClinicIdCache?: string;

  private async getMyClinicId(): Promise<string | undefined> {
    if (this.myClinicIdCache) return this.myClinicIdCache;
    try {
      const myClinic = await apiService.get<{ id: string }>(`${this.clinicsUrl}/my-clinic`);
      this.myClinicIdCache = myClinic?.id;
      return this.myClinicIdCache;
    } catch (err) {
      console.warn('CalendarService: Failed to resolve my clinic id');
      return undefined;
    }
  }

  /**
   * Get comprehensive calendar data for a specific date using appointments calendar endpoint
   */
  async getCalendarData(date: string, filters?: CalendarFilters): Promise<CalendarResponse> {
    try {
      // Prepare date range for calendar view (from start to end of day)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Build query parameters for /appointments/calendar endpoint
      const params = new URLSearchParams({
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
      });

      // Add clinic_id if specified in filters
      if (filters?.clinicId) {
        params.append('clinic_id', filters.clinicId);
      }

      // Add staff_id if specified in filters
      if (filters?.veterinarianIds?.length === 1) {
        params.append('staff_id', filters.veterinarianIds[0]);
      }

      console.log('📅 CalendarService: Fetching calendar data with params:', params.toString());

      const response = await apiService.get(
        `${this.appointmentsUrl}/calendar?${params.toString()}`
      );

      // Transform backend response to frontend format
      return this.transformCalendarResponse(response, date, filters);
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
      const clinicId = await this.getMyClinicId();
      if (!clinicId) {
        return [];
      }
      const params = new URLSearchParams({ role: 'veterinarian', isActive: 'true', limit: '1000' });
      const response = await apiService.get<any>(
        `${this.clinicsUrl}/${clinicId}/staff?${params.toString()}`
      );
      const staff = Array.isArray(response?.data) ? response.data : response?.staff || [];
      return staff.map((s: any) => ({
        id: s.id || s.userId || s.user?.id || s.staff_id || '',
        name:
          `${s.firstName ?? s.user?.firstName ?? ''} ${s.lastName ?? s.user?.lastName ?? ''}`.trim() ||
          s.email ||
          'Unnamed',
        initials: this.getInitials(
          `${s.firstName ?? s.user?.firstName ?? ''} ${s.lastName ?? s.user?.lastName ?? ''}`.trim() ||
            s.email ||
            'U'
        ),
      }));
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
      // Use the appointments available-slots endpoint
      const params = new URLSearchParams({ date, duration: '30' });

      const response = await apiService.get<string[]>(
        `${this.appointmentsUrl}/available-slots/${veterinarianId}?${params.toString()}`
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch available time slots:', error);
      throw new Error('Failed to load available time slots. Please try again.');
    }
  }

  /**
   * Transform backend CalendarViewResponse to frontend CalendarResponse format
   */
  private transformCalendarResponse(
    backendResponse: any,
    date: string,
    filters?: CalendarFilters
  ): CalendarResponse {
    try {
      // Extract appointments from backend response structure
      const appointments: CalendarAppointment[] = [];

      if (backendResponse.days && Array.isArray(backendResponse.days)) {
        // Flatten appointments from day/staff groups
        for (const dayGroup of backendResponse.days) {
          if (dayGroup.staff && Array.isArray(dayGroup.staff)) {
            for (const staffGroup of dayGroup.staff) {
              if (staffGroup.appointments && Array.isArray(staffGroup.appointments)) {
                for (const apt of staffGroup.appointments) {
                  appointments.push(this.transformAppointment(apt, staffGroup.staff_name));
                }
              }
            }
          }
        }
      }

      // Get veterinarians from appointments or fetch separately if needed
      const veterinarians = this.extractVeterinariansFromAppointments(appointments);

      // Return transformed response
      return {
        date,
        appointments,
        veterinarians,
        workingHours: { start: '08:00', end: '18:00' }, // Default working hours
        isClinicOpen: true, // Default to open
        holidays: [],
        totalAppointments: appointments.length,
        availableSlots: [], // Could be populated from available-slots endpoint
        filters: filters || {},
        totalFiltered: appointments.length,
      };
    } catch (error) {
      console.error('Failed to transform calendar response:', error);
      // Return empty response on error
      return {
        date,
        appointments: [],
        veterinarians: [],
        workingHours: { start: '08:00', end: '18:00' },
        isClinicOpen: true,
        holidays: [],
        totalAppointments: 0,
        availableSlots: [],
        filters: filters || {},
        totalFiltered: 0,
      };
    }
  }

  /**
   * Transform individual appointment from backend format to frontend format
   */
  private transformAppointment(backendAppointment: any, staffName?: string): CalendarAppointment {
    const scheduledDate = new Date(backendAppointment.scheduled_date);
    const duration = backendAppointment.duration_minutes || 30;

    // Calculate end time
    const endTime = new Date(scheduledDate.getTime() + duration * 60000);

    // Extract client and pet information
    const pet = backendAppointment.pet;
    const owner = pet?.owner || backendAppointment.owner;

    return {
      id: backendAppointment.id,
      clientName: owner
        ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() ||
          owner.email ||
          'Unknown Client'
        : 'Unknown Client',
      petName: pet?.name || 'Unknown Pet',
      petType: pet?.species || 'Unknown',
      startTime: scheduledDate.toTimeString().substring(0, 5), // HH:MM format
      endTime: endTime.toTimeString().substring(0, 5),
      veterinarian:
        staffName ||
        backendAppointment.staff?.first_name + ' ' + backendAppointment.staff?.last_name ||
        'Unassigned',
      veterinarianInitials: this.getInitials(
        staffName ||
          backendAppointment.staff?.first_name + ' ' + backendAppointment.staff?.last_name ||
          'U'
      ),
      color: this.getAppointmentColor(backendAppointment.status, backendAppointment.priority),
    };
  }

  /**
   * Extract unique veterinarians from appointments
   */
  private extractVeterinariansFromAppointments(
    appointments: CalendarAppointment[]
  ): Veterinarian[] {
    const vetMap = new Map<string, Veterinarian>();

    for (const apt of appointments) {
      if (!vetMap.has(apt.veterinarian)) {
        vetMap.set(apt.veterinarian, {
          id: apt.veterinarian, // This might not be accurate, but we don't have staff IDs in the appointment
          name: apt.veterinarian,
          initials: apt.veterinarianInitials,
        });
      }
    }

    return Array.from(vetMap.values());
  }

  /**
   * Get initials from name
   */
  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  /**
   * Get color based on appointment status and priority
   */
  private getAppointmentColor(status?: string, priority?: string): string {
    // Priority-based colors
    if (priority === 'urgent' || priority === 'emergency') {
      return '#ef4444'; // red
    }
    if (priority === 'high') {
      return '#f59e0b'; // amber
    }

    // Status-based colors
    switch (status) {
      case 'completed':
        return '#10b981'; // green
      case 'confirmed':
        return '#3b82f6'; // blue
      case 'pending':
        return '#f59e0b'; // amber
      case 'cancelled':
      case 'no_show':
        return '#6b7280'; // gray
      case 'in_progress':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
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
   * Get all clinics for appointment forms
   */
  async getClinics(): Promise<CalendarClinic[]> {
    try {
      // Prefer the current user's clinic when present
      const myClinic = await apiService.get<any>(`${this.clinicsUrl}/my-clinic`);
      if (myClinic && myClinic.id) {
        return [myClinic];
      }
      // Fallback to listing clinics (backend will restrict by role)
      const response = await apiService.get<any>(`${this.clinicsUrl}?limit=100`);
      if (Array.isArray(response)) return response;
      return response?.clinics || response?.data || [];
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
      throw new Error('Failed to load clinics list. Please try again.');
    }
  }
}

// Export singleton instance
export const calendarService = new CalendarService();

// Export the class for testing purposes
export { CalendarService };

export default calendarService;
