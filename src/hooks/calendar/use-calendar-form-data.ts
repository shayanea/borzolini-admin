import { CACHE_PRESETS } from '@/constants';
import { calendarService } from '@/services/calendar.service';
import { useQuery } from '@tanstack/react-query';
// Types are inferred from the service responses

export const useCalendarFormData = () => {
  // Query for clinics
  const {
    data: clinics = [],
    isLoading: clinicsLoading,
    error: clinicsError,
  } = useQuery({
    queryKey: ['calendar-clinics'],
    queryFn: async () => {
      return await calendarService.getClinics();
    },
    staleTime: CACHE_PRESETS.STABLE.staleTime,
    gcTime: CACHE_PRESETS.STABLE.gcTime,
  });

  return {
    clinics,
    loading: clinicsLoading,
    error: clinicsError,
  };
};
