import type { Settings, SettingsFormValues } from '@/types/settings';

import { apiService } from './api';

export interface SettingsQueryParams {
  includeDefaults?: boolean;
}

export class SettingsService {
  // Get current settings
  static async getSettings(params: SettingsQueryParams = {}): Promise<Settings> {
    const queryParams = apiService.buildQueryParams(params);
    const url = `/settings${queryParams ? `?${queryParams}` : ''}`;
    return apiService.get<Settings>(url);
  }

  // Update settings
  static async updateSettings(settings: Partial<SettingsFormValues>): Promise<Settings> {
    return apiService.put<Settings>('/settings', settings);
  }

  // Reset settings to defaults
  static async resetToDefaults(): Promise<Settings> {
    return apiService.post<Settings>('/settings/reset', {});
  }

  // Get default settings
  static async getDefaultSettings(): Promise<Settings> {
    return apiService.get<Settings>('/settings/defaults');
  }

  // Update default settings
  static async updateDefaultSettings(settings: Partial<SettingsFormValues>): Promise<Settings> {
    return apiService.patch<Settings>('/settings/default', settings);
  }

  // Update specific setting category
  static async updateGeneralSettings(
    settings: Partial<SettingsFormValues['generalSettings']>
  ): Promise<Settings> {
    return apiService.patch<Settings>('/settings/general', settings);
  }

  static async updateNotificationSettings(
    settings: Partial<SettingsFormValues['notificationSettings']>
  ): Promise<Settings> {
    return apiService.patch<Settings>('/settings/notifications', settings);
  }

  static async updateAppointmentSettings(
    settings: Partial<SettingsFormValues['appointmentSettings']>
  ): Promise<Settings> {
    return apiService.patch<Settings>('/settings/appointments', settings);
  }

  static async updateSecuritySettings(
    settings: Partial<SettingsFormValues['securitySettings']>
  ): Promise<Settings> {
    return apiService.patch<Settings>('/settings/security', settings);
  }

  // Validate settings before saving
  static async validateSettings(
    settings: Partial<SettingsFormValues>
  ): Promise<{ isValid: boolean; errors: string[] }> {
    return apiService.post<{ isValid: boolean; errors: string[] }>('/settings/validate', settings);
  }

  // Export settings
  static async exportSettings(): Promise<Blob> {
    const response = await apiService.get('/settings/export', {
      responseType: 'blob',
    });
    return response;
  }

  // Import settings
  static async importSettings(file: globalThis.File): Promise<Settings> {
    const formData = new FormData();
    formData.append('settings', file);

    return apiService.post<Settings>('/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default SettingsService;
