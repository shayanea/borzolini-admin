export const ACTIVITY_TYPES = {
  USER_REGISTRATION: 'user_registration',
  CLINIC_REGISTRATION: 'clinic_registration',
  APPOINTMENT_CREATED: 'appointment_created',
  APPOINTMENT_COMPLETED: 'appointment_completed',
} as const;

export const ACTIVITY_COLORS = {
  [ACTIVITY_TYPES.USER_REGISTRATION]: '#1890ff',
  [ACTIVITY_TYPES.CLINIC_REGISTRATION]: '#52c41a',
  [ACTIVITY_TYPES.APPOINTMENT_CREATED]: '#faad14',
  [ACTIVITY_TYPES.APPOINTMENT_COMPLETED]: '#10b981',
} as const;

export const QUICK_ACTIONS = [
  {
    key: 'new_appointment',
    title: 'New Appointment',
    description: 'Schedule a new visit',
    bgColor: 'bg-primary-navy',
  },
  {
    key: 'add_patient',
    title: 'Add Patient',
    description: 'Register new patient',
    bgColor: 'bg-primary-orange',
  },
  {
    key: 'add_clinic',
    title: 'Add Clinic',
    description: 'Register new clinic',
    bgColor: 'bg-health-excellent',
  },
  {
    key: 'manage_staff',
    title: 'Manage Staff',
    description: 'Update team members',
    bgColor: 'bg-purple-500',
  },
] as const;
