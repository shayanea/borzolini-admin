import { CACHE_PRESETS } from '@/constants';
import PetsLookupsService from '@/services/pets';
import { useQuery } from '@tanstack/react-query';

const LOOKUP_KEYS = {
  pets: ['pets'] as const,
  allergies: () => [...LOOKUP_KEYS.pets, 'distinct', 'allergies'] as const,
  medications: () => [...LOOKUP_KEYS.pets, 'distinct', 'medications'] as const,
};

export const useDistinctAllergies = () => {
  return useQuery({
    queryKey: LOOKUP_KEYS.allergies(),
    queryFn: PetsLookupsService.getDistinctAllergies,
    staleTime: CACHE_PRESETS.STANDARD.staleTime,
    gcTime: CACHE_PRESETS.STANDARD.gcTime,
  });
};

export const useDistinctMedications = () => {
  return useQuery({
    queryKey: LOOKUP_KEYS.medications(),
    queryFn: PetsLookupsService.getDistinctMedications,
    staleTime: CACHE_PRESETS.STANDARD.staleTime,
    gcTime: CACHE_PRESETS.STANDARD.gcTime,
  });
};

export default {
  useDistinctAllergies,
  useDistinctMedications,
};
