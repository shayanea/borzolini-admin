import { CACHE_PRESETS } from '@/constants';
import { calendarService } from '@/services/calendar.service';
import { useQuery } from '@tanstack/react-query';
// Types are inferred from the service responses

export const useCalendarFormData = () => {
  // Query for pets
  const {
    data: pets = [],
    isLoading: petsLoading,
    error: petsError,
  } = useQuery({
    queryKey: ['calendar-pets'],
    queryFn: async () => {
      return await calendarService.getPets();
    },
    staleTime: CACHE_PRESETS.STABLE.staleTime,
    gcTime: CACHE_PRESETS.STABLE.gcTime,
  });

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

  // Query for services
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ['calendar-services'],
    queryFn: async () => {
      return await calendarService.getServices();
    },
    staleTime: CACHE_PRESETS.STABLE.staleTime,
    gcTime: CACHE_PRESETS.STABLE.gcTime,
  });

  return {
    pets,
    clinics,
    services,
    loading: petsLoading || clinicsLoading || servicesLoading,
    error: petsError || clinicsError || servicesError,
  };
};
