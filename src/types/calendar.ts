import type { Dayjs } from 'dayjs';

export interface Veterinarian {
  id: string;
  name: string;
  initials: string;
}

export interface CalendarAppointment {
  id: string;
  clientName: string;
  petName: string;
  petType: string;
  startTime: string;
  endTime: string;
  veterinarian: string;
  veterinarianInitials: string;
  color: string;
}

// Enhanced calendar filters with advanced filtering options
export interface CalendarFilters {
  // Basic filters
  veterinarianIds?: string[];
  petTypes?: string[];
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  includeCancelled?: boolean;
  
  // Enhanced filters
  priority?: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
  appointmentType?: 'consultation' | 'vaccination' | 'surgery' | 'follow_up' | 'emergency' | 'wellness_exam' | 'dental_cleaning' | 'laboratory_test' | 'imaging' | 'therapy';
  search?: string; // Search across client name, pet name, notes, etc.
  
  // Time-based filters
  timeFrom?: string; // HH:mm format
  timeTo?: string;   // HH:mm format
  
  // Visit type filters
  isTelemedicine?: boolean;
  isHomeVisit?: boolean;
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Sorting
  sortBy?: 'startTime' | 'clientName' | 'petName' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface CalendarResponse {
  date: string;
  appointments: CalendarAppointment[];
  veterinarians: Veterinarian[];
  workingHours: {
    start: string;
    end: string;
  };
  isClinicOpen: boolean;
  holidays: string[];
  totalAppointments: number;
  availableSlots: string[];
  // Enhanced response with filtering metadata
  filters: CalendarFilters;
  totalFiltered: number;
}

export interface CreateAppointmentRequest {
  clientName: string;
  petName: string;
  petType: string;
  date: string;
  startTime: string;
  endTime: string;
  veterinarianId: string;
  notes?: string;
  clientPhone?: string;
  clientEmail?: string;
}

export interface UpdateAppointmentRequest {
  clientName?: string;
  petName?: string;
  petType?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  veterinarianId?: string;
  notes?: string;
  clientPhone?: string;
  clientEmail?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
}

export interface DeleteAppointmentRequest {
  reason?: string;
}

export interface TimeSlotAvailability {
  isAvailable: boolean;
  conflictingAppointments?: CalendarAppointment[];
  suggestedAlternatives?: string[];
  reason?: string;
}

// Existing component prop interfaces
export interface CalendarHeaderProps {
  onFilters: () => void;
  onNewAppointment: () => void;
}

export interface CalendarNavigationProps {
  currentDate: Dayjs;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export interface VeterinarianSelectionProps {
  veterinarians: Veterinarian[];
  selectedVeterinarians: string[];
  onToggleVeterinarian: (vetId: string) => void;
  onToggleAll: () => void;
  onAddNew: () => void;
}

export interface CalendarGridProps {
  veterinarians: Veterinarian[];
  timeSlots: number[];
  getAppointmentsForTimeAndVet: (time: number, vetId: string) => CalendarAppointment[];
  onAppointmentClick: (appointment: CalendarAppointment) => void;
}

// New enhanced calendar filters component props
export interface CalendarFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: Partial<CalendarFilters>) => void;
  onClearFilters: () => void;
  onSearch: (search: string) => void;
  searchText: string;
  loading?: boolean;
}
