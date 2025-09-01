export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
] as const;

export const APPOINTMENT_DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
] as const;

export const DEFAULT_SETTINGS = {
  name: 'default',
  description: 'Default clinic settings',
  generalSettings: {
    clinicName: 'Borzolini Veterinary Clinic',
    currency: 'USD',
    timezone: 'America/New_York',
    businessHours: '8:00 AM - 6:00 PM',
  },
  notificationSettings: {
    email: {
      appointments: true,
      reminders: true,
      healthAlerts: true,
      marketing: true,
      newsletter: true,
    },
    sms: {
      appointments: true,
      reminders: true,
      healthAlerts: true,
    },
    push: {
      appointments: true,
      reminders: true,
      healthAlerts: true,
    },
  },
  appointmentSettings: {
    defaultAppointmentDuration: 30,
    bookingLeadTime: 24,
    cancellationPolicy: 24,
    maxAppointmentsPerDay: 50,
  },
  securitySettings: {
    sessionTimeout: 30,
    passwordExpiry: 90,
    twoFactorAuthentication: false,
  },
  isActive: true,
  isDefault: false,
} as const;
