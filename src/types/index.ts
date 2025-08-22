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
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileCompletionPercentage: number;
  accountStatus: AccountStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
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
  clientName: string;
  petName: string;
  petType: string;
  startTime: string;
  endTime: string;
  veterinarianId: string;
  veterinarianName: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

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
  revenueThisMonth: number;
  growthRate: number;
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
