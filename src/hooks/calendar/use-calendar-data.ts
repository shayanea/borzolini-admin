import type { CalendarFilters, Veterinarian } from '@/types/calendar';

import type { User } from '@/types';
import UsersService from '@/services/users.service';
import { calendarService } from '@/services/calendar.service';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

export const useCalendarData = (
  currentDate: dayjs.Dayjs,
  selectedVeterinarians: string[],
  filters: CalendarFilters
) => {
  // Query for veterinarians (via users endpoint filtered by role)
  const {
    data: veterinarians = [],
    isLoading: vetsLoading,
    error: vetsError,
  } = useQuery({
    queryKey: ['users', 'veterinarian'],
    queryFn: async (): Promise<Veterinarian[]> => {
      const res = await UsersService.getUsers({
        role: 'veterinarian',
        isActive: true,
        limit: 1000,
      });
      const toInitials = (first?: string, last?: string, email?: string) => {
        const f = (first || '').trim();
        const l = (last || '').trim();
        if (f || l)
          return (
            `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() ||
            (f.charAt(0) || l.charAt(0)).toUpperCase()
          );
        return (email || '?').charAt(0).toUpperCase();
      };
      return (res.data as User[]).map(user => ({
        id: user.id,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || user.id,
        initials: toInitials(user.firstName, user.lastName, user.email),
      }));
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
