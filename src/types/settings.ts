export interface SettingsHeaderProps {
  onResetDefaults: () => void;
  onSaveChanges: () => void;
}

export interface GeneralSettings {
  clinicName: string;
  currency: string;
  timezone: string;
  businessHours: string;
}

export interface NotificationSettings {
  enableNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationEmail: string;
}

export interface AppointmentSettings {
  defaultAppointmentDuration: number;
  bookingLeadTime: number;
  cancellationPolicy: number;
  maxAppointmentsPerDay: number;
}

export interface SecuritySettings {
  sessionTimeout: number;
  passwordExpiry: number;
  twoFactorAuthentication: boolean;
}

export interface SettingsFormValues {
  name: string;
  description: string;
  generalSettings: GeneralSettings;
  notificationSettings: NotificationSettings;
  appointmentSettings: AppointmentSettings;
  securitySettings: SecuritySettings;
  isActive: boolean;
  isDefault: boolean;
}

export interface Settings extends SettingsFormValues {
  id: string;
  createdAt: string;
  updatedAt: string;
}
