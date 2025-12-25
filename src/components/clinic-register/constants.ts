// Re-export service and specialization options from main constants
export {
  CLINIC_SERVICE_OPTIONS as SERVICE_OPTIONS,
  CLINIC_SPECIALIZATION_OPTIONS as SPECIALIZATION_OPTIONS,
} from '@/constants/clinics';

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

export const REGISTRATION_STEPS = [
  {
    title: 'Basic Information',
    description: 'Essential clinic details',
  },
  {
    title: 'Location',
    description: 'Address & contact info',
  },
  {
    title: 'Services',
    description: 'Services & specializations',
  },
  {
    title: 'Social Media',
    description: 'Online presence',
  },
  {
    title: 'Operating Hours',
    description: 'Business hours',
  },
  {
    title: 'Review',
    description: 'Confirm & submit',
  },
];
