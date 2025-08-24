import type { Appointment, AppointmentPriority, AppointmentStatus, AppointmentType } from './index';

export interface AppointmentsHeaderProps {
  onNewAppointment: () => void;
}

export interface AppointmentsTableProps {
  appointments: Appointment[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (id: string, data: any) => void;
  onCancel: (id: string) => void;
  onPagination?: (page: number, pageSize: number) => void;
}

export interface AppointmentsFiltersProps {
  searchText: string;
  onSearch: (value: string) => void;
  onFilters: (filters: Partial<AppointmentsFilters>) => void;
  onExport: () => void;
}

export interface AppointmentsFilters {
  search?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  priority?: AppointmentPriority;
  dateRange?: [string, string];
  clinic_id?: string;
  staff_id?: string;
  pet_id?: string;
  owner_id?: string;
  is_telemedicine?: boolean;
  is_home_visit?: boolean;
}
