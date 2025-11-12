export const SERVICE_OPTIONS = [
  'Vaccinations',
  'Surgery',
  'Dental Care',
  'Emergency Care',
  'Wellness Exams',
  'Grooming',
  'Boarding',
  'Microchipping',
  'Laboratory Services',
  'Radiology',
  'Pharmacy',
  'Behavioral Consultation',
];

export const SPECIALIZATION_OPTIONS = [
  'Feline Medicine',
  'Canine Medicine',
  'Exotic Animals',
  'Emergency Medicine',
  'Surgery',
  'Dermatology',
  'Cardiology',
  'Oncology',
  'Orthopedics',
  'Neurology',
  'Ophthalmology',
  'Dentistry',
];

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
