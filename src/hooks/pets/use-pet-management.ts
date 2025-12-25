import type { Pet, PetFormData, UsePetManagementReturn } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import { CACHE_PRESETS } from '@/constants';
import { COMMON_BREEDS, PET_GENDERS, PET_SIZES, PET_SPECIES } from '@/constants/pets';
import { useAuth } from '@/hooks/auth';
import { useFilterManagement } from '@/hooks/common/use-filter-management';
import { PetsService, type UpdatePetData } from '@/services/pets';
import { message } from 'antd';
import dayjs from 'dayjs';

// Types for query parameters
interface PetsFilters {
  [key: string]: any;
  search?: string;
  species?: string | null;
  breed?: string | null;
  gender?: string | null;
  size?: string | null;
  ownerName?: string;
  isActive?: boolean;
}

interface PetsPagination {
  currentPage: number;
  pageSize: number;
}

// Query keys for React Query
const PETS_KEYS = {
  all: ['pets'] as const,
  lists: () => [...PETS_KEYS.all, 'list'] as const,
  list: (filters: PetsFilters, pagination: PetsPagination) =>
    [...PETS_KEYS.lists(), { filters, pagination }] as const,
  details: () => [...PETS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PETS_KEYS.details(), id] as const,
};

export const usePetManagement = (): UsePetManagementReturn => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Local state for UI
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Use the shared filter management hook
  const {
    filters,
    setFilter,
    resetFilters,
    searchText,
    handleSearch: onSearch,
  } = useFilterManagement<PetsFilters & { search: string }>({
    initialFilters: {
      search: '',
      species: null,
      breed: null,
      gender: null,
      size: null,
      ownerName: '',
      isActive: undefined,
    },
    resetToPage1: () => setCurrentPage(1),
  });

  // Pet species, breeds, genders, and sizes from constants
  const petSpecies = Object.values(PET_SPECIES) as string[];

  // Flatten all breeds for the general list, or specific ones if needed
  const breeds = Object.values(COMMON_BREEDS).flat() as string[];

  const genders = Object.values(PET_GENDERS) as string[];
  const sizes = Object.values(PET_SIZES) as string[];

  // React Query for fetching pets
  const {
    data: petsData,
    isLoading: loading,
    error: queryError,
    refetch: fetchPets,
  } = useQuery({
    queryKey: PETS_KEYS.list({ ...filters, search: searchText }, { currentPage, pageSize }),
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        species: filters.species || undefined,
        breed: filters.breed || undefined,
        gender: filters.gender || undefined,
        size: filters.size || undefined,
        ownerName: filters.ownerName || undefined,
        isActive: filters.isActive,
        sortBy: 'created_at',
        sortOrder: 'DESC' as const,
      };

      return await PetsService.getPets(params);
    },
    enabled: isAuthenticated,
    staleTime: CACHE_PRESETS.STANDARD.staleTime,
    gcTime: CACHE_PRESETS.STANDARD.gcTime,
    retry: (failureCount, error: unknown) => {
      // Don't retry on authentication errors
      const hadError = error && typeof error === 'object' && 'response' in error;
      if (hadError) {
        const response = (error as { response: { status: number } }).response;
        if (response?.status === 401) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });

  // Extract data from query result
  const pets = React.useMemo(() => petsData?.pets || [], [petsData?.pets]);
  const total = petsData?.total || 0;
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : 'Failed to fetch pets'
    : null;

  // Extract unique owners from pets data
  const owners = React.useMemo(() => {
    const ownerMap = new Map();
    pets.forEach(pet => {
      if (pet.owner && !ownerMap.has(pet.owner.id)) {
        ownerMap.set(pet.owner.id, pet.owner);
      }
    });
    return Array.from(ownerMap.values());
  }, [pets]);

  // Table change handler
  const handleTableChange = useCallback((pagination: { current?: number; pageSize?: number }) => {
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  }, []);

  // Row selection change handler
  const handleRowSelectionChange = useCallback((selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  // Map generic filter handlers to specific ones for backward compatibility
  const handleSearch = useCallback(
    (value: string) => {
      onSearch(value);
    },
    [onSearch]
  );

  const handleClearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Mutations for CRUD operations
  const createPetMutation = useMutation({
    mutationFn: (data: PetFormData) => {
      // Transform PetFormData to CreatePetData format
      const apiData = {
        ...data,
        date_of_birth:
          data.date_of_birth && dayjs.isDayjs(data.date_of_birth)
            ? data.date_of_birth.format('YYYY-MM-DD')
            : data.date_of_birth,
      };
      return PetsService.createPet(apiData);
    },
    onSuccess: () => {
      // Invalidate and refetch pets list
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.lists() });
      message.success('Pet created successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create pet';
      message.error(errorMessage);
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PetFormData }) => {
      // Transform PetFormData to UpdatePetData format
      const apiData: UpdatePetData = {
        ...data,
        date_of_birth:
          data.date_of_birth && dayjs.isDayjs(data.date_of_birth)
            ? data.date_of_birth.format('YYYY-MM-DD')
            : data.date_of_birth,
      };
      return PetsService.updatePet(id, apiData);
    },
    onSuccess: (_: unknown, { id }: { id: string; data: PetFormData }) => {
      // Invalidate and refetch pets list and specific pet detail
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.detail(id) });
      message.success('Pet updated successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pet';
      message.error(errorMessage);
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: PetsService.deletePet,
    onSuccess: (_: unknown, id: string) => {
      // Invalidate and refetch pets list and remove specific pet detail from cache
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.lists() });
      queryClient.removeQueries({ queryKey: PETS_KEYS.detail(id) });
      message.success('Pet deleted successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete pet';
      message.error(errorMessage);
    },
  });

  // CRUD operation handlers
  const handleCreatePet = useCallback(
    async (data: PetFormData) => {
      await createPetMutation.mutateAsync(data);
    },
    [createPetMutation]
  );

  const handleUpdatePet = useCallback(
    async (id: string, data: PetFormData) => {
      await updatePetMutation.mutateAsync({ id, data });
    },
    [updatePetMutation]
  );

  const handleDeletePet = useCallback(
    async (id: string) => {
      await deletePetMutation.mutateAsync(id);
    },
    [deletePetMutation]
  );

  // View and edit handlers
  const handleViewPet = useCallback((pet: Pet) => {
    // This will be handled by the parent component
    console.log('View pet:', pet);
  }, []);

  const handleEditPet = useCallback((pet: Pet) => {
    // This will be handled by the parent component
    console.log('Edit pet:', pet);
  }, []);

  return {
    pets,
    loading:
      loading ||
      createPetMutation.isPending ||
      updatePetMutation.isPending ||
      deletePetMutation.isPending,
    error,
    currentPage,
    pageSize,
    total,
    selectedRowKeys,
    filters: { ...filters, search: searchText }, // Merge search into filters for backward compatibility
    petSpecies,
    breeds,
    genders,
    sizes,
    owners,
    fetchPets: () => fetchPets().then(() => {}),
    handleTableChange,
    handleRowSelectionChange,
    handleSearch,
    setFilter,
    handleClearFilters,
    handleCreatePet,
    handleUpdatePet,
    handleDeletePet,
    handleViewPet,
    handleEditPet,
  };
};
