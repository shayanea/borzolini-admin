import type { UserRole } from '@/types';

export const USER_ROLES = {
  ADMIN: 'admin',
  VETERINARIAN: 'veterinarian',
  STAFF: 'staff',
  PATIENT: 'patient',
  CLINIC_ADMIN: 'clinic_admin',
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

export const USER_FORM_LABELS = {
  CREATE_TITLE: 'Create New User',
  EDIT_TITLE: 'Edit User',
  CREATE_DESCRIPTION: 'Create a new clinic user',
  EDIT_DESCRIPTION: 'Update user information and settings',
  BACK_BUTTON: 'Back to Users',
  CANCEL_BUTTON: 'Cancel',
  CREATE_BUTTON: 'Create User',
  UPDATE_BUTTON: 'Update User',
} as const;
