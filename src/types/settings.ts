export interface SettingsHeaderProps {
  onResetDefaults: () => void;
  onSaveChanges: () => void;
}

export interface SettingsFormValues {
  clinicName: string;
  timezone: string;
  currency: string;
  businessHours?: string;
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationEmail?: string;
  defaultDuration?: number;
  bookingLeadTime?: number;
  cancellationPolicy?: number;
  maxAppointments?: number;
  sessionTimeout?: number;
  passwordExpiry?: number;
  twoFactorAuth: boolean;
}

export interface Settings extends SettingsFormValues {
  id: string;
  createdAt: string;
  updatedAt: string;
}
