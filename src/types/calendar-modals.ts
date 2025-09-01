// Shared interfaces for calendar modals
// Used by appointment-form-modal.tsx and appointment-details-modal.tsx

import type { Appointment } from '@/types';
import type { CreateAppointmentData, UpdateAppointmentData } from '@/services/appointments.service';
import type { Dayjs } from 'dayjs';
import type { Veterinarian } from '@/types/calendar';

// Shared data interfaces
export interface Pet {
  id: string;
  name: string;
  type: string;
  ownerName: string;
}

export interface CalendarClinic {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

// Appointment Form Modal Props
export interface AppointmentFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateAppointmentData) => Promise<void>;
  loading?: boolean;
  veterinarians: Veterinarian[];
  currentDate?: Dayjs;
}

// Appointment Details Modal Props
export interface AppointmentDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (appointmentId: string, updates: UpdateAppointmentData) => Promise<void>;
  onDelete: (appointmentId: string) => Promise<void>;
  veterinarians: Veterinarian[];
  appointment: Appointment;
}

// Shared option types for form selects
export interface AppointmentTypeOption {
  value: string;
  label: string;
}

export interface PriorityOption {
  value: string;
  label: string;
}

export interface StatusOption {
  value: string;
  label: string;
}
