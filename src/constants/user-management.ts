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

export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: 'red',
  [USER_ROLES.VETERINARIAN]: 'blue',
  [USER_ROLES.STAFF]: 'green',
  [USER_ROLES.PATIENT]: 'default',
} as const;

export const IS_ACTIVE_COLORS = {
  true: 'green',
  false: 'red',
} as const;
