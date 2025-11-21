import type { CalendarFilters, Veterinarian } from '@/types/calendar';
import { calendarService } from '@/services/calendar';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useClinicContext } from '@/hooks/clinics';

export const useCalendarData = (
  currentDate: dayjs.Dayjs,
  selectedVeterinarians: string[],
  filters: CalendarFilters
) => {
  const { clinicContext } = useClinicContext();
  // Query for veterinarians (via users endpoint filtered by role)
  const {
    data: veterinarians = [],
    isLoading: vetsLoading,
    error: vetsError,
  } = useQuery({
    queryKey: ['clinic-staff', 'veterinarians'],
    queryFn: async (): Promise<Veterinarian[]> => {
      return await calendarService.getVeterinarians();
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
    queryKey: ['calendar-data', currentDate.format('YYYY-MM-DD'), selectedVeterinarians, filters, clinicContext?.clinicId],
    queryFn: async () => {
      // Prepare filters with current veterinarian selection and clinic context
      const currentFilters: CalendarFilters = {
        ...filters,
        veterinarianIds: selectedVeterinarians.length > 0 ? selectedVeterinarians : undefined,
        clinicId: clinicContext?.clinicId, // Add clinic ID for clinic-specific filtering
      };

      console.log('📅 CalendarData: Fetching calendar data with filters:', currentFilters);

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
