import { calendarService } from '@/services/calendar.service';
import type { CalendarFilters } from '@/types/calendar';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export const useCalendarData = (
  currentDate: dayjs.Dayjs,
  selectedVeterinarians: string[],
  filters: CalendarFilters
) => {
  // Query for veterinarians
  const {
    data: veterinarians = [],
    isLoading: vetsLoading,
    error: vetsError,
  } = useQuery({
    queryKey: ['veterinarians'],
    queryFn: async () => {
      const vets = await calendarService.getVeterinarians();
      return vets;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Query for calendar data
  const {
    data: calendarData,
    isLoading: calendarLoading,
    error: calendarError,
    refetch: refetchCalendarData,
  } = useQuery({
    queryKey: ['calendar-data', currentDate.format('YYYY-MM-DD'), selectedVeterinarians, filters],
    queryFn: async () => {
      // Prepare filters with current veterinarian selection
      const currentFilters: CalendarFilters = {
        ...filters,
        veterinarianIds: selectedVeterinarians.length > 0 ? selectedVeterinarians : undefined,
      };

      const data = await calendarService.getCalendarData(
        currentDate.format('YYYY-MM-DD'),
        currentFilters
      );

      return data;
    },
    enabled: selectedVeterinarians.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract working hours from calendar data
  const workingHours = calendarData?.workingHours || { start: '08:00', end: '18:00' };

  // Dynamic time slots based on working hours
  const timeSlots = (() => {
    if (workingHours.start && workingHours.end) {
      const startHour = parseInt(workingHours.start.split(':')[0]);
      const endHour = parseInt(workingHours.end.split(':')[0]);
      return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
    }
    return [];
  })();

  // Extract appointments from calendar data
  const appointments = calendarData?.appointments || [];

  const isLoading = calendarLoading || vetsLoading;
  const error = calendarError
    ? calendarError instanceof Error
      ? calendarError.message
      : 'Failed to load calendar data'
    : null;

  return {
    veterinarians,
    calendarData,
    workingHours,
    timeSlots,
    appointments,
    isLoading,
    error,
    vetsError,
    refetchCalendarData,
  };
};
