// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  profileCompletionPercentage?: number;
  accountStatus?: AccountStatus;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields that might come from the API
  status?: string;
  verified?: boolean;
  profileCompletion?: number;
  // Allow for additional properties
  [key: string]: any;
}

export type UserRole = 'admin' | 'veterinarian' | 'staff' | 'patient';
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  address?: string;
  city?: string;
  country?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    profileCompletionPercentage: number;
    accountStatus: AccountStatus;
  };
  lastLoginAt?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// Navigation Types
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
  permission?: UserRole[];
}

// Calendar and Appointment Types
export interface Appointment {
  id: string;
  appointment_type: string;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  scheduled_date: string;
  duration_minutes: number;
  actual_start_time?: string;
  actual_end_time?: string;
  notes?: string;
  reason?: string;
  symptoms?: string;
  diagnosis?: string;
  treatment_plan?: string;
  prescriptions?: string[];
  follow_up_instructions?: string;
  cost?: number;
  payment_status?: string;
  is_telemedicine: boolean;
  telemedicine_link?: string;
  home_visit_address?: string;
  is_home_visit: boolean;
  reminder_settings?: object;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
  pet_id: string;
  clinic_id: string;
  staff_id?: string;
  service_id?: string;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled'
  | 'waiting';
export type AppointmentPriority = 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
export type AppointmentType =
  | 'consultation'
  | 'vaccination'
  | 'surgery'
  | 'follow_up'
  | 'emergency'
  | 'wellness_exam'
  | 'dental_cleaning'
  | 'laboratory_test'
  | 'imaging'
  | 'therapy'
  | 'grooming'
  | 'behavioral_training'
  | 'nutrition_consultation'
  | 'physical_therapy'
  | 'specialist_consultation';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  data: Appointment;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalAppointments: number;
  totalVeterinarians: number;
  totalPatients: number;
  appointmentsToday: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  revenueThisMonth: number;
  growthRate: number;
  // Additional properties needed by components
  newUsersThisWeek: number;
  totalClinics: number;
  newClinicsThisMonth: number;
  urgentAppointments: number;
  completedAppointments: number;
  averageAppointmentDuration: number;
  recentActivity: RecentActivityItem[];
  topPerformingClinics: TopPerformingClinic[];
}

export interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userName?: string;
  clinicName?: string;
}

export interface TopPerformingClinic {
  id: string;
  name: string;
  rating: number;
  revenue: number;
  totalAppointments: number;
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface TableFilters {
  search?: string;
  role?: UserRole;
  status?: AccountStatus;
  dateRange?: [string, string];
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// User Management Types
export * from './user-management';

// Dashboard Types
export * from './dashboard';

// Appointments Types
export * from './appointments';

// Calendar Types
export * from './calendar';
export * from './calendar-modals';

// Reports Types
export * from './reports';

// Settings Types
export * from './settings';

// API Health Types
export * from './api-health';
