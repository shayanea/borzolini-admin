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

// Validation rules that use i18n messages
export const createEmailRule = (message: string): Rule => ({
  type: 'email',
  message,
});

export const createUrlRule = (message: string): Rule => ({
  type: 'url',
  message,
});

export const createPhonePatternRule = (message: string): Rule => ({
  pattern: /^[+]?[\d\s\-().]{7,20}$/,
  message,
});

export const createPostalCodeRule = (message: string): Rule => ({
  pattern: /^[0-9A-Za-z\s-]{3,10}$/,
  message,
});

// Numeric validation rules
export const createPositiveNumberRule = (message: string): Rule => ({
  validator: (_: any, value: any) => {
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  },
});

// Date validation rules
export const createFutureDateRule = (message: string): Rule => ({
  validator: (_: any, value: any) => {
    if (value && value.isBefore(new Date(), 'day')) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  },
});

// Legacy validation rules (deprecated - use create*Rule functions instead)
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

export const POSITIVE_NUMBER_RULE: Rule = {
  validator: (_: any, value: any) => {
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
      return Promise.reject('Please enter a valid positive number');
    }
    return Promise.resolve();
  },
};

export const FUTURE_DATE_RULE: Rule = {
  validator: (_: any, value: any) => {
    if (value && value.isBefore(new Date(), 'day')) {
      return Promise.reject('Date must be in the future');
    }
    return Promise.resolve();
  },
};

// Common validation messages
export const VALIDATION_MESSAGES = {
  // General
  REQUIRED: 'This field is required',

  // User validation messages
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  ROLE_REQUIRED: 'Role is required',

  // Pet validation messages
  EMERGENCY_CONTACT_REQUIRED: 'Emergency contact is required',
  EMERGENCY_CONTACT_MAX_LENGTH: 'Emergency contact must be less than 255 characters',
  EMERGENCY_PHONE_REQUIRED: 'Emergency phone is required',
  EMERGENCY_PHONE_MAX_LENGTH: 'Emergency phone must be less than 20 characters',
} as const;
