import { useMemo } from 'react';
import type { OperatingHours, ClinicOperatingHours } from '@/types';

// Days of the week mapping for API (0-6) to form keys
const DAYS_OF_WEEK = [
  { key: 'sunday', apiIndex: 0, label: 'Sunday' },
  { key: 'monday', apiIndex: 1, label: 'Monday' },
  { key: 'tuesday', apiIndex: 2, label: 'Tuesday' },
  { key: 'wednesday', apiIndex: 3, label: 'Wednesday' },
  { key: 'thursday', apiIndex: 4, label: 'Thursday' },
  { key: 'friday', apiIndex: 5, label: 'Friday' },
  { key: 'saturday', apiIndex: 6, label: 'Saturday' },
];

export interface OperatingHoursHookReturn {
  daysOfWeek: typeof DAYS_OF_WEEK;
  getDefaultOperatingHours: () => Record<string, OperatingHours>;
  convertApiToForm: (apiHours?: ClinicOperatingHours[]) => Record<string, OperatingHours>;
  convertFormToApi: (formHours: Record<string, OperatingHours>) => ClinicOperatingHours[];
  validateOperatingHours: (hours: Record<string, OperatingHours>) => boolean;
}

export const useOperatingHours = (): OperatingHoursHookReturn => {
  const daysOfWeek = DAYS_OF_WEEK;

  // Get default operating hours for new clinics
  const getDefaultOperatingHours = useMemo((): (() => Record<string, OperatingHours>) => {
    return () => {
      const defaults: Record<string, OperatingHours> = {};

      DAYS_OF_WEEK.forEach(day => {
        if (day.key === 'sunday') {
          defaults[day.key] = { open: '00:00', close: '00:00', closed: true };
        } else if (day.key === 'saturday') {
          defaults[day.key] = { open: '10:00', close: '15:00', closed: false };
        } else {
          defaults[day.key] = { open: '09:00', close: '17:00', closed: false };
        }
      });

      return defaults;
    };
  }, []);

  // Convert API format to form format
  const convertApiToForm = useMemo(() => (apiHours?: ClinicOperatingHours[]): Record<string, OperatingHours> => {
    const formHours: Record<string, OperatingHours> = { ...getDefaultOperatingHours() };

    if (!apiHours || apiHours.length === 0) {
      return formHours;
    }

    // Convert each API hour to form format
    apiHours.forEach(apiHour => {
      const dayInfo = DAYS_OF_WEEK.find(day => day.apiIndex === apiHour.dayOfWeek);
      if (dayInfo) {
        formHours[dayInfo.key] = {
          open: apiHour.openTime,
          close: apiHour.closeTime,
          closed: apiHour.isClosed,
        };
      }
    });

    return formHours;
  }, [getDefaultOperatingHours]);

  // Convert form format to API format
  const convertFormToApi = useMemo(() => (formHours: Record<string, OperatingHours>): ClinicOperatingHours[] => {
    return DAYS_OF_WEEK.map(day => {
      const formHour = formHours[day.key];
      if (!formHour) {
        // Return default for missing days
        return {
          id: '',
          dayOfWeek: day.apiIndex,
          openTime: '09:00',
          closeTime: '17:00',
          isClosed: false,
        };
      }

      return {
        id: '', // Will be set by API
        dayOfWeek: day.apiIndex,
        openTime: formHour.open,
        closeTime: formHour.close,
        isClosed: formHour.closed,
      };
    });
  }, []);

  // Validate operating hours
  const validateOperatingHours = useMemo(() => (hours: Record<string, OperatingHours>): boolean => {
    for (const [day, hour] of Object.entries(hours)) {
      // If not closed, validate times
      if (!hour.closed) {
        if (!hour.open || !hour.close) {
          console.warn(`Missing time for ${day}`);
          return false;
        }

        // Basic time format validation (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(hour.open) || !timeRegex.test(hour.close)) {
          console.warn(`Invalid time format for ${day}`);
          return false;
        }

        // Check if close time is after open time
        const openTime = hour.open.split(':').map(Number);
        const closeTime = hour.close.split(':').map(Number);
        const openMinutes = openTime[0] * 60 + openTime[1];
        const closeMinutes = closeTime[0] * 60 + closeTime[1];

        if (closeMinutes <= openMinutes) {
          console.warn(`Close time must be after open time for ${day}`);
          return false;
        }
      }
    }

    return true;
  }, []);

  return {
    daysOfWeek,
    getDefaultOperatingHours: getDefaultOperatingHours,
    convertApiToForm: convertApiToForm,
    convertFormToApi: convertFormToApi,
    validateOperatingHours: validateOperatingHours,
  };
};

export default useOperatingHours;
