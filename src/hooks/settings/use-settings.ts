import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DEFAULT_SETTINGS } from '@/constants/settings';
import type { SettingsFormValues } from '@/types/settings';
import { SettingsService } from '@/services/settings';
import { useCallback } from 'react';
import { useMessage } from '../common/use-message';

export const useSettings = () => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useMessage();

  // Query for settings
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: () => SettingsService.getSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Mutation for updating settings
  const updateSettingsMutation = useMutation({
    mutationFn: SettingsService.updateDefaultSettings,
    onSuccess: updatedSettings => {
      // Update the cache with new settings
      queryClient.setQueryData(['settings'], updatedSettings);
      success('Settings updated successfully');
    },
    onError: error => {
      console.error('Failed to update settings:', error);
      showError('Failed to update settings. Please try again.');
    },
  });

  // Mutation for resetting to defaults
  const resetDefaultsMutation = useMutation({
    mutationFn: SettingsService.resetToDefaults,
    onSuccess: defaultSettings => {
      // Update the cache with default settings
      queryClient.setQueryData(['settings'], defaultSettings);
      success('Settings reset to defaults successfully');
    },
    onError: error => {
      console.error('Failed to reset settings:', error);
      showError('Failed to reset settings. Please try again.');
    },
  });

  const handleResetDefaults = useCallback(async () => {
    await resetDefaultsMutation.mutateAsync();
  }, [resetDefaultsMutation]);

  const handleSaveChanges = useCallback(
    async (values: SettingsFormValues) => {
      await updateSettingsMutation.mutateAsync(values);
    },
    [updateSettingsMutation]
  );

  const onFinish = useCallback(
    async (values: SettingsFormValues) => {
      try {
        await handleSaveChanges(values);
      } catch (error) {
        console.error('Failed to save settings:', error);
        // Error handling is already done in the mutation
      }
    },
    [handleSaveChanges]
  );

  // Use settings data or fallback to defaults
  const initialValues: SettingsFormValues = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  return {
    // Data
    settings,
    initialValues,

    // Loading states
    settingsLoading,
    updateLoading: updateSettingsMutation.isPending,
    resetLoading: resetDefaultsMutation.isPending,

    // Error states
    settingsError,

    // Actions
    handleResetDefaults,
    handleSaveChanges,
    onFinish,

    // Utilities
    refetchSettings,
  };
};
