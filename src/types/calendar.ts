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
}
