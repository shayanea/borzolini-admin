export {
  APPOINTMENT_PRIORITIES,
  APPOINTMENT_PRIORITY_COLORS,
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_TYPES,
} from './appointments';
export { CACHE_PRESETS, GC_TIMES, STALE_TIMES } from './cache-times';
export { ACTIVITY_COLORS, ACTIVITY_TYPES, QUICK_ACTIONS } from './dashboard';
export { DEFAULT_METRICS, METRIC_COLORS } from './reports';
export { ROUTES } from './routes';
export { APPOINTMENT_DURATIONS, CURRENCIES, DEFAULT_SETTINGS, TIMEZONES } from './settings';
export { theme } from './theme';
export {
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_ORDER,
  IS_ACTIVE_COLORS,
  ROLE_COLORS,
  TABLE_PAGE_SIZES,
  USER_ROLES,
  USER_TABLE_COLUMNS,
} from './user-management';

// Common query parameter names for consistency across services
export const QUERY_PARAMS = {
  // Pagination
  PAGE: 'page',
  LIMIT: 'limit',

  // Search and filtering
  SEARCH: 'search',
  STATUS: 'status',
  TYPE: 'type',
  PRIORITY: 'priority',
  ROLE: 'role',

  // Date filters
  DATE_FROM: 'date_from',
  DATE_TO: 'date_to',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  TIME_FROM: 'timeFrom',
  TIME_TO: 'timeTo',

  // Location filters
  CITY: 'city',
  COUNTRY: 'country',
  CLINIC_ID: 'clinic_id',
  STAFF_ID: 'staff_id',
  PET_ID: 'pet_id',
  OWNER_ID: 'owner_id',
  VETERINARIAN_ID: 'veterinarianId',

  // Boolean filters
  IS_TELEMEDICINE: 'is_telemedicine',
  IS_HOME_VISIT: 'is_home_visit',
  IS_VERIFIED: 'isVerified',
  INCLUDE_CANCELLED: 'includeCancelled',

  // Cost and duration filters
  COST_MIN: 'cost_min',
  COST_MAX: 'cost_max',
  DURATION_MIN: 'duration_min',
  DURATION_MAX: 'duration_max',

  // Sorting
  SORT_BY: 'sort_by',
  SORT_ORDER: 'sort_order',

  // Array filters (comma-separated)
  VETERINARIAN_IDS: 'veterinarianIds',
  PET_TYPES: 'petTypes',

  // Additional filters
  APPOINTMENT_TYPE: 'appointmentType',
  LAST_LOGIN_FROM: 'lastLoginFrom',
  LAST_LOGIN_TO: 'lastLoginTo',
} as const;

// Common sort orders
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Common sort fields
export const SORT_FIELDS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  NAME: 'name',
  EMAIL: 'email',
  DATE: 'date',
  START_TIME: 'startTime',
  CLIENT_NAME: 'clientName',
  PET_NAME: 'petName',
  PRIORITY: 'priority',
  STATUS: 'status',
  COST: 'cost',
  DURATION: 'duration',
} as const;
