/**
 * Available service options for clinics
 */
export const CLINIC_SERVICE_OPTIONS = [
  // Core Medical Services
  'Wellness Exams',
  'Vaccinations',
  'Spay & Neuter',
  'Surgery',
  'Emergency Care',
  'Urgent Care',
  'Dental Care',
  'Microchipping',

  // Diagnostics
  'Laboratory Services',
  'Radiology (X-Ray)',
  'Ultrasound',
  'Allergy Testing',
  'Endoscopy',

  // Specialty Services
  'Behavioral Consultation',
  'Nutrition Counseling',
  'Dermatology Services',
  'Ophthalmology Services',
  'Cardiology Services',

  // Preventive Care
  'Parasite Prevention',
  'Heartworm Prevention',
  'Flea & Tick Control',

  // Therapeutic Services
  'Rehabilitation & Physical Therapy',
  'Laser Therapy',
  'Acupuncture',
  'Pain Management',

  // Convenience Services
  'Pharmacy',
  'Grooming',
  'Boarding',
  'Daycare',
  'Pet Transportation',
  'House Calls',
  'Telemedicine',

  // End-of-Life Services
  'Hospice Care',
  'Euthanasia Services',
  'Cremation Services',
];

/**
 * Available specialization options for clinics
 */
export const CLINIC_SPECIALIZATION_OPTIONS = [
  // Species-Specific
  'Canine Medicine',
  'Feline Medicine',
  'Avian Medicine',
  'Exotic Animals',
  'Reptile & Amphibian Medicine',
  'Small Mammals (Pocket Pets)',
  'Aquatic Medicine',
  'Equine Medicine',
  'Large Animal Medicine',

  // Medical Specialties
  'Internal Medicine',
  'Emergency & Critical Care',
  'Surgery',
  'Orthopedics',
  'Neurology',
  'Cardiology',
  'Oncology',
  'Dermatology',
  'Ophthalmology',
  'Dentistry & Oral Surgery',
  'Radiology & Imaging',
  'Anesthesiology',

  // Other Specialties
  'Nutrition',
  'Reproduction (Theriogenology)',
  'Behavioral Medicine',
  'Sports Medicine & Rehabilitation',
  'Geriatric Care',
  'Preventive Medicine',
  'Zoological Medicine',
  'Holistic & Integrative Medicine',
];

/**
 * Available insurance provider options for clinics - North America
 */
export const CLINIC_INSURANCE_PROVIDERS_NORTH_AMERICA = [
  // United States
  'Trupanion',
  'Nationwide',
  'ASPCA Pet Health Insurance',
  'Healthy Paws',
  'Embrace',
  'Figo',
  'Lemonade',
  'Pets Best',
  'Spot',
  'Pumpkin',
  'MetLife Pet Insurance',
  'AKC Pet Insurance',
  'Fetch by The Dodo',
  'Pawp',
  'Many Pets',
  'Prudent Pet',
  '24PetWatch',

  // Canada
  'Petline Insurance (Canada)',
  'Desjardins Pet Insurance (Canada)',
  'PC Pet Insurance (Canada)',
  'Costco Pet Insurance (Canada)',
];

/**
 * Available insurance provider options for clinics - Europe
 */
export const CLINIC_INSURANCE_PROVIDERS_EUROPE = [
  // United Kingdom
  'PetPlan UK',
  'Direct Line Pet Insurance',
  'Animal Friends',
  'Bought By Many (ManyPets)',
  "Sainsbury's Pet Insurance",
  'John Lewis Pet Insurance',
  'More Than Pet Insurance',
  'Waggel',
  'Napo Pet Insurance',

  // Germany
  'Agila Tierversicherung',
  'Allianz Tierversicherung',
  'HanseMerkur Tierversicherung',
  'Petplan Deutschland',
  'Uelzener Versicherung',

  // France
  'SantéVet',
  'Carrefour Assurance Animaux',
  'Bulle Bleue',
  'AG2R La Mondiale',

  // Netherlands
  'Petplan Nederland',
  'Reaal Dierenverzekering',
  'Univé Dierenverzekering',

  // Other European
  'Agria (Sweden/Nordic)',
  'Folksam (Sweden)',
  'IF Djurförsäkring (Nordic)',
  'Figo Europe',
];

/**
 * Combined insurance provider options by region
 */
export const CLINIC_INSURANCE_PROVIDER_OPTIONS = {
  northAmerica: CLINIC_INSURANCE_PROVIDERS_NORTH_AMERICA,
  europe: CLINIC_INSURANCE_PROVIDERS_EUROPE,
  all: [...CLINIC_INSURANCE_PROVIDERS_NORTH_AMERICA, ...CLINIC_INSURANCE_PROVIDERS_EUROPE],
};

/**
 * Available payment method options for clinics
 */
export const CLINIC_PAYMENT_METHOD_OPTIONS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Insurance',
  'CareCredit',
  'Scratchpay',
  'Apple Pay',
  'Google Pay',
  'Check',
];

/**
 * Default country for new clinics
 */
export const DEFAULT_CLINIC_COUNTRY = 'United States';

/**
 * Form validation messages
 */
export const CLINIC_VALIDATION_MESSAGES = {
  OPERATING_HOURS_ERROR:
    'Please check operating hours - ensure all times are valid and close time is after open time',
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
