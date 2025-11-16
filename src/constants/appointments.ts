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

// Labels for UI display
export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUSES.PENDING]: 'Pending',
  [APPOINTMENT_STATUSES.CONFIRMED]: 'Confirmed',
  [APPOINTMENT_STATUSES.IN_PROGRESS]: 'In Progress',
  [APPOINTMENT_STATUSES.COMPLETED]: 'Completed',
  [APPOINTMENT_STATUSES.CANCELLED]: 'Cancelled',
  [APPOINTMENT_STATUSES.NO_SHOW]: 'No Show',
  [APPOINTMENT_STATUSES.RESCHEDULED]: 'Rescheduled',
  [APPOINTMENT_STATUSES.WAITING]: 'Waiting',
} as const;

export const APPOINTMENT_PRIORITY_LABELS = {
  [APPOINTMENT_PRIORITIES.LOW]: 'Low',
  [APPOINTMENT_PRIORITIES.NORMAL]: 'Normal',
  [APPOINTMENT_PRIORITIES.HIGH]: 'High',
  [APPOINTMENT_PRIORITIES.URGENT]: 'Urgent',
  [APPOINTMENT_PRIORITIES.EMERGENCY]: 'Emergency',
} as const;

export const APPOINTMENT_TYPE_LABELS = {
  [APPOINTMENT_TYPES.CONSULTATION]: 'General Consultation',
  [APPOINTMENT_TYPES.VACCINATION]: 'Vaccination',
  [APPOINTMENT_TYPES.SURGERY]: 'Surgery',
  [APPOINTMENT_TYPES.FOLLOW_UP]: 'Follow-up',
  [APPOINTMENT_TYPES.EMERGENCY]: 'Emergency',
  [APPOINTMENT_TYPES.WELLNESS_EXAM]: 'Wellness Exam',
  [APPOINTMENT_TYPES.DENTAL_CLEANING]: 'Dental Cleaning',
  [APPOINTMENT_TYPES.LABORATORY_TEST]: 'Laboratory Test',
  [APPOINTMENT_TYPES.IMAGING]: 'Imaging',
  [APPOINTMENT_TYPES.THERAPY]: 'Therapy',
  [APPOINTMENT_TYPES.GROOMING]: 'Grooming',
  [APPOINTMENT_TYPES.BEHAVIORAL_TRAINING]: 'Behavioral Training',
  [APPOINTMENT_TYPES.NUTRITION_CONSULTATION]: 'Nutrition Consultation',
  [APPOINTMENT_TYPES.PHYSICAL_THERAPY]: 'Physical Therapy',
  [APPOINTMENT_TYPES.SPECIALIST_CONSULTATION]: 'Specialist Consultation',
} as const;

// Helper functions to convert constants to options for dropdowns
export const getAppointmentTypeOptions = () => {
  return Object.entries(APPOINTMENT_TYPES).map(([, value]) => ({
    value,
    label: APPOINTMENT_TYPE_LABELS[value],
  }));
};

export const getAppointmentStatusOptions = () => {
  return Object.entries(APPOINTMENT_STATUSES).map(([, value]) => ({
    value,
    label: APPOINTMENT_STATUS_LABELS[value],
  }));
};

export const getAppointmentPriorityOptions = () => {
  return Object.entries(APPOINTMENT_PRIORITIES).map(([, value]) => ({
    value,
    label: APPOINTMENT_PRIORITY_LABELS[value],
  }));
};
