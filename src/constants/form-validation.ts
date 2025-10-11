import { Rule } from 'antd/es/form';

// Common form validation rules
export const REQUIRED_RULE = (message: string): Rule => ({
  required: true,
  message,
});

export const MIN_LENGTH_RULE = (min: number, message: string): Rule => ({
  min,
  message,
});

export const MAX_LENGTH_RULE = (max: number, message: string): Rule => ({
  max,
  message,
});

export const EMAIL_RULE: Rule = {
  type: 'email',
  message: 'Please enter a valid email',
};

export const URL_RULE: Rule = {
  type: 'url',
  message: 'Please enter a valid URL',
};

export const PHONE_PATTERN_RULE: Rule = {
  pattern: /^[+]?[\d\s\-().]{7,20}$/,
  message: 'Please enter a valid phone number',
};

export const POSTAL_CODE_RULE: Rule = {
  pattern: /^[0-9A-Za-z\s-]{3,10}$/,
  message: 'Please enter a valid postal code',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  // Common
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_POSTAL_CODE: 'Please enter a valid postal code',
  
  // User form
  FIRST_NAME_REQUIRED: 'Please enter first name',
  LAST_NAME_REQUIRED: 'Please enter last name',
  EMAIL_REQUIRED: 'Please enter email',
  PASSWORD_REQUIRED: 'Please enter password',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  ROLE_REQUIRED: 'Please select role',
  
  // Pet form
  PET_NAME_REQUIRED: 'Please enter pet name',
  PET_NAME_MIN_LENGTH: 'Pet name must be at least 1 character',
  PET_NAME_MAX_LENGTH: 'Pet name must be less than 100 characters',
  SPECIES_REQUIRED: 'Please select species',
  GENDER_REQUIRED: 'Please select gender',
  SIZE_REQUIRED: 'Please select size',
  DOB_REQUIRED: 'Please select date of birth',
  BREED_MAX_LENGTH: 'Breed must be less than 100 characters',
  COLOR_MAX_LENGTH: 'Color must be less than 100 characters',
  MICROCHIP_MAX_LENGTH: 'Microchip number must be less than 50 characters',
  EMERGENCY_CONTACT_REQUIRED: 'Please enter emergency contact name',
  EMERGENCY_CONTACT_MAX_LENGTH: 'Emergency contact name must be less than 255 characters',
  EMERGENCY_PHONE_REQUIRED: 'Please enter emergency phone',
  EMERGENCY_PHONE_MAX_LENGTH: 'Emergency phone must be less than 20 characters',
  PHOTO_URL_MAX_LENGTH: 'Photo URL must be less than 500 characters',
  WEIGHT_INVALID: 'Weight must be a valid positive number',
  
  // Clinic form
  CLINIC_NAME_REQUIRED: 'Please enter clinic name',
  CLINIC_NAME_MIN_LENGTH: 'Clinic name must be at least 2 characters',
  ADDRESS_REQUIRED: 'Please enter address',
  ADDRESS_MIN_LENGTH: 'Address must be at least 5 characters',
  CITY_REQUIRED: 'Please enter city',
  CITY_MIN_LENGTH: 'City must be at least 2 characters',
  COUNTRY_REQUIRED: 'Please enter country',
  DESCRIPTION_MAX_LENGTH: 'Description must not exceed 500 characters',
};
