import { useQuery } from '@tanstack/react-query';
import { calendarService } from '@/services/calendar.service';
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
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
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
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
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
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    pets,
    clinics,
    services,
    loading: petsLoading || clinicsLoading || servicesLoading,
    error: petsError || clinicsError || servicesError,
  };
};
