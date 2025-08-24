export const USER_ROLES = {
  ADMIN: 'admin',
  VETERINARIAN: 'veterinarian',
  STAFF: 'staff',
  PATIENT: 'patient',
} as const;

export const ACCOUNT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;

export const TABLE_PAGE_SIZES = [10, 20, 50, 100] as const;

export const DEFAULT_SORT_FIELD = 'createdAt';
export const DEFAULT_SORT_ORDER = 'desc' as const;

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

export const STATUS_COLORS = {
  [ACCOUNT_STATUSES.ACTIVE]: 'green',
  [ACCOUNT_STATUSES.INACTIVE]: 'red',
  [ACCOUNT_STATUSES.SUSPENDED]: 'orange',
  [ACCOUNT_STATUSES.PENDING]: 'default',
} as const;
