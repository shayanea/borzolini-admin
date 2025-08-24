export const APPOINTMENT_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
  WAITING: 'waiting',
} as const;

export const APPOINTMENT_STATUS_COLORS = {
  [APPOINTMENT_STATUSES.PENDING]: 'blue',
  [APPOINTMENT_STATUSES.CONFIRMED]: 'green',
  [APPOINTMENT_STATUSES.IN_PROGRESS]: 'orange',
  [APPOINTMENT_STATUSES.COMPLETED]: 'purple',
  [APPOINTMENT_STATUSES.CANCELLED]: 'red',
  [APPOINTMENT_STATUSES.NO_SHOW]: 'red',
  [APPOINTMENT_STATUSES.RESCHEDULED]: 'yellow',
  [APPOINTMENT_STATUSES.WAITING]: 'cyan',
} as const;

export const APPOINTMENT_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
  EMERGENCY: 'emergency',
} as const;

export const APPOINTMENT_PRIORITY_COLORS = {
  [APPOINTMENT_PRIORITIES.LOW]: 'blue',
  [APPOINTMENT_PRIORITIES.NORMAL]: 'green',
  [APPOINTMENT_PRIORITIES.HIGH]: 'orange',
  [APPOINTMENT_PRIORITIES.URGENT]: 'red',
  [APPOINTMENT_PRIORITIES.EMERGENCY]: 'red',
} as const;

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  VACCINATION: 'vaccination',
  SURGERY: 'surgery',
  FOLLOW_UP: 'follow_up',
  EMERGENCY: 'emergency',
  WELLNESS_EXAM: 'wellness_exam',
  DENTAL_CLEANING: 'dental_cleaning',
  LABORATORY_TEST: 'laboratory_test',
  IMAGING: 'imaging',
  THERAPY: 'therapy',
  GROOMING: 'grooming',
  BEHAVIORAL_TRAINING: 'behavioral_training',
  NUTRITION_CONSULTATION: 'nutrition_consultation',
  PHYSICAL_THERAPY: 'physical_therapy',
  SPECIALIST_CONSULTATION: 'specialist_consultation',
} as const;

export const APPOINTMENT_TABLE_COLUMNS = {
  CLIENT: 'client',
  DATETIME: 'datetime',
  VETERINARIAN: 'veterinarian',
  STATUS: 'status',
  PRIORITY: 'priority',
  TYPE: 'type',
  NOTES: 'notes',
  ACTIONS: 'actions',
} as const;
