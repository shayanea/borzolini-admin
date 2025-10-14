import { CACHE_PRESETS } from '@/constants';
import type { User } from '@/types';
import UsersService from '@/services/users.service';
import { useQuery } from '@tanstack/react-query';

export interface PetOwnerOption {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * Hook to fetch all pet owners (users with role='patient')
 * Used in pet form for owner selection
 */
export const usePetOwners = () => {
  return useQuery<PetOwnerOption[]>({
    queryKey: ['pet-owners'],
    queryFn: async () => {
      const response = await UsersService.getUsers({
        role: 'patient',
        isActive: true,
        limit: 1000, // Get all active pet owners (patients)
      });

      // Transform users to owner options
      return response.data.map((user: User) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
      }));
    },
    staleTime: CACHE_PRESETS.STANDARD.staleTime,
    gcTime: CACHE_PRESETS.STANDARD.gcTime,
  });
};
