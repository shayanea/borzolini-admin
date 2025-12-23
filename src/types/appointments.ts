import type { Appointment, AppointmentPriority, AppointmentStatus, AppointmentType } from './index';

export interface AppointmentsHeaderProps {
  onNewAppointment?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  stats?: {
    total: number;
    pending: number;
    confirmed: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  onQuickStatusFilter?: (status: string | null) => void;
}

export interface AppointmentsTableProps {
  appointments: Appointment[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onView: (appointment: Appointment) => void;
  onUpdate: (id: string, data: Partial<Appointment>) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onPagination: (page: number, pageSize: number) => void;
  rowSelection?: any;
}

export interface AppointmentsFiltersProps {
  searchText: string;
  onSearch: (value: string) => void;
  onFilters: (filters: Partial<AppointmentsFilters>) => void;
  onExport: () => void;
}

export interface AppointmentsFilters {
  [key: string]: any;
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
