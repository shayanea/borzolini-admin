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
  [APPOINTMENT_STATUSES.PENDING]: '#FCA311', // Yellow
  [APPOINTMENT_STATUSES.CONFIRMED]: '#10B981', // Green
  [APPOINTMENT_STATUSES.IN_PROGRESS]: '#3B82F6', // Blue
  [APPOINTMENT_STATUSES.COMPLETED]: '#6B7280', // Gray
  [APPOINTMENT_STATUSES.CANCELLED]: '#EF4444', // Red
  [APPOINTMENT_STATUSES.NO_SHOW]: '#EF4444', // Red
  [APPOINTMENT_STATUSES.RESCHEDULED]: '#FCA311', // Yellow
  [APPOINTMENT_STATUSES.WAITING]: '#06B6D4', // Cyan
} as const;

export const APPOINTMENT_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
  EMERGENCY: 'emergency',
} as const;

export const APPOINTMENT_PRIORITY_COLORS = {
  [APPOINTMENT_PRIORITIES.LOW]: '#3B82F6', // Blue
  [APPOINTMENT_PRIORITIES.NORMAL]: '#10B981', // Green
  [APPOINTMENT_PRIORITIES.HIGH]: '#F97316', // Orange
  [APPOINTMENT_PRIORITIES.URGENT]: '#EF4444', // Red
  [APPOINTMENT_PRIORITIES.EMERGENCY]: '#EF4444', // Red
} as const;

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  VACCINATION: 'vaccination',
  SURGERY: 'surgery',
  FOLLOW_UP: 'follow_up',
  EMERGENCY: 'emergency',
  URGENT_CARE: 'urgent_care',
  WELLNESS_EXAM: 'wellness_exam',
  DENTAL_CLEANING: 'dental_cleaning',
  MICROCHIPPING: 'microchipping',
  LABORATORY_TEST: 'laboratory_test',
  DIAGNOSTICS: 'diagnostics',
  IMAGING: 'imaging',
  RADIOLOGY: 'radiology',
  ULTRASOUND: 'ultrasound',
  ALLERGY_TESTING: 'allergy_testing',
  ENDOSCOPY: 'endoscopy',
  THERAPY: 'therapy',
  GROOMING: 'grooming',
  BEHAVIORAL_TRAINING: 'behavioral_training',
  NUTRITION_CONSULTATION: 'nutrition_consultation',
  PHYSICAL_THERAPY: 'physical_therapy',
  SPECIALIST_CONSULTATION: 'specialist_consultation',
  DERMATOLOGY: 'dermatology',
  OPHTHALMOLOGY: 'ophthalmology',
  CARDIOLOGY: 'cardiology',
  SPAY_NEUTER: 'spay_neuter',
  PARASITE_PREVENTION: 'parasite_prevention',
  HEARTWORM_PREVENTION: 'heartworm_prevention',
  FLEA_TICK_CONTROL: 'flea_tick_control',
  LASER_THERAPY: 'laser_therapy',
  ACUPUNCTURE: 'acupuncture',
  PAIN_MANAGEMENT: 'pain_management',
  PHARMACY: 'pharmacy',
  BOARDING: 'boarding',
  DAYCARE: 'daycare',
  PET_TRANSPORTATION: 'pet_transportation',
  HOUSE_CALLS: 'house_calls',
  TELEMEDICINE: 'telemedicine',
  HOSPICE_CARE: 'hospice_care',
  EUTHANASIA: 'euthanasia',
  CREMATION: 'cremation',
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
  [APPOINTMENT_TYPES.URGENT_CARE]: 'Urgent Care',
  [APPOINTMENT_TYPES.WELLNESS_EXAM]: 'Wellness Exam',
  [APPOINTMENT_TYPES.DENTAL_CLEANING]: 'Dental Cleaning',
  [APPOINTMENT_TYPES.MICROCHIPPING]: 'Microchipping',
  [APPOINTMENT_TYPES.LABORATORY_TEST]: 'Laboratory Test',
  [APPOINTMENT_TYPES.DIAGNOSTICS]: 'Diagnostics',
  [APPOINTMENT_TYPES.IMAGING]: 'Imaging',
  [APPOINTMENT_TYPES.RADIOLOGY]: 'Radiology (X-Ray)',
  [APPOINTMENT_TYPES.ULTRASOUND]: 'Ultrasound',
  [APPOINTMENT_TYPES.ALLERGY_TESTING]: 'Allergy Testing',
  [APPOINTMENT_TYPES.ENDOSCOPY]: 'Endoscopy',
  [APPOINTMENT_TYPES.THERAPY]: 'Therapy',
  [APPOINTMENT_TYPES.GROOMING]: 'Grooming',
  [APPOINTMENT_TYPES.BEHAVIORAL_TRAINING]: 'Behavioral Training',
  [APPOINTMENT_TYPES.NUTRITION_CONSULTATION]: 'Nutrition Consultation',
  [APPOINTMENT_TYPES.PHYSICAL_THERAPY]: 'Physical Therapy',
  [APPOINTMENT_TYPES.SPECIALIST_CONSULTATION]: 'Specialist Consultation',
  [APPOINTMENT_TYPES.DERMATOLOGY]: 'Dermatology',
  [APPOINTMENT_TYPES.OPHTHALMOLOGY]: 'Ophthalmology',
  [APPOINTMENT_TYPES.CARDIOLOGY]: 'Cardiology',
  [APPOINTMENT_TYPES.SPAY_NEUTER]: 'Spay & Neuter',
  [APPOINTMENT_TYPES.PARASITE_PREVENTION]: 'Parasite Prevention',
  [APPOINTMENT_TYPES.HEARTWORM_PREVENTION]: 'Heartworm Prevention',
  [APPOINTMENT_TYPES.FLEA_TICK_CONTROL]: 'Flea & Tick Control',
  [APPOINTMENT_TYPES.LASER_THERAPY]: 'Laser Therapy',
  [APPOINTMENT_TYPES.ACUPUNCTURE]: 'Acupuncture',
  [APPOINTMENT_TYPES.PAIN_MANAGEMENT]: 'Pain Management',
  [APPOINTMENT_TYPES.PHARMACY]: 'Pharmacy',
  [APPOINTMENT_TYPES.BOARDING]: 'Boarding',
  [APPOINTMENT_TYPES.DAYCARE]: 'Daycare',
  [APPOINTMENT_TYPES.PET_TRANSPORTATION]: 'Pet Transportation',
  [APPOINTMENT_TYPES.HOUSE_CALLS]: 'House Calls',
  [APPOINTMENT_TYPES.TELEMEDICINE]: 'Telemedicine',
  [APPOINTMENT_TYPES.HOSPICE_CARE]: 'Hospice Care',
  [APPOINTMENT_TYPES.EUTHANASIA]: 'Euthanasia',
  [APPOINTMENT_TYPES.CREMATION]: 'Cremation',
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
