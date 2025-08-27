import { useCallback } from 'react';
import { DEFAULT_SETTINGS } from '@/constants/settings';
import type { SettingsFormValues } from '@/types/settings';

export const useSettings = () => {
  const handleResetDefaults = useCallback(() => {
    console.log('Reset to defaults clicked');
  }, []);

  const handleSaveChanges = useCallback(() => {
    console.log('Save changes clicked');
  }, []);

  const onFinish = useCallback((values: SettingsFormValues) => {
    console.log('Settings updated:', values);
  }, []);

  const initialValues: SettingsFormValues = {
    ...DEFAULT_SETTINGS,
    businessHours: '',
    notificationEmail: '',
    defaultDuration: 30,
    bookingLeadTime: 24,
    cancellationPolicy: 24,
    maxAppointments: 50,
    sessionTimeout: 30,
    passwordExpiry: 90,
  };

  return {
    initialValues,
    handleResetDefaults,
    handleSaveChanges,
    onFinish,
  };
};
