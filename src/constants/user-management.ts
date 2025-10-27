import type { UserRole } from '@/types';

export const USER_ROLES = {
  ADMIN: 'admin',
  VETERINARIAN: 'veterinarian',
  STAFF: 'staff',
  PATIENT: 'patient',
} as const;

export const TABLE_PAGE_SIZES = [10, 20, 50, 100] as const;

export const DEFAULT_SORT_FIELD = 'createdAt';
export const DEFAULT_SORT_ORDER = 'DESC' as const;

export const USER_TABLE_COLUMNS = {
  USER: 'user',
  ROLE: 'role',
  STATUS: 'status',
  VERIFICATION: 'verification',
  LOCATION: 'location',
  ACTIONS: 'actions',
} as const;

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'red',
  clinic_admin: 'purple',
  veterinarian: 'blue',
  staff: 'green',
  patient: 'default',
};

export const IS_ACTIVE_COLORS = {
  true: 'green',
  false: 'red',
} as const;
