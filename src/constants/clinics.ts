/**
 * Constants related to clinic functionality
 */

/**
 * Available service options for clinics
 */
export const CLINIC_SERVICE_OPTIONS = [
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

/**
 * Available specialization options for clinics
 */
export const CLINIC_SPECIALIZATION_OPTIONS = [
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

/**
 * Default country for new clinics
 */
export const DEFAULT_CLINIC_COUNTRY = 'United States';

/**
 * Form validation messages
 */
export const CLINIC_VALIDATION_MESSAGES = {
  OPERATING_HOURS_ERROR: 'Please check operating hours - ensure all times are valid and close time is after open time',
  CREATE_SUCCESS: 'Clinic created successfully',
  UPDATE_SUCCESS: 'Clinic updated successfully',
  CREATE_ERROR: 'Failed to create clinic',
  UPDATE_ERROR: 'Failed to update clinic',
};

/**
 * Form labels
 */
export const CLINIC_FORM_LABELS = {
  CREATE_TITLE: 'Create New Clinic',
  EDIT_TITLE: 'Edit Clinic',
  CREATE_DESCRIPTION: 'Add a new clinic to the system',
  EDIT_DESCRIPTION: 'Update clinic information and settings',
  BACK_BUTTON: 'Back to Clinics',
  CANCEL_BUTTON: 'Cancel',
  CREATE_BUTTON: 'Create Clinic',
  UPDATE_BUTTON: 'Update Clinic',
};
