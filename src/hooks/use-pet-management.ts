import type { Pet, PetFormData, UsePetManagementReturn } from '@/types';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CACHE_PRESETS } from '@/constants';
import { PetsService } from '@/services/pets.service';
import { message } from 'antd';
import { useAuth } from '@/hooks/use-auth';

// Query keys for React Query
const PETS_KEYS = {
  all: ['pets'] as const,
  lists: () => [...PETS_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>, pagination: Record<string, any>) =>
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

  // Pet types are now static - no need to fetch from API
  const petTypes: string[] = [
    'dog',
    'cat',
    'bird',
    'fish',
    'rabbit',
    'hamster',
    'guinea_pig',
    'reptile',
    'other',
  ];
  const breeds: string[] = [];

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    ownerName: '',
    isActive: undefined as boolean | undefined,
  });

  // React Query for fetching pets
  const {
    data: petsData,
    isLoading: loading,
    error: queryError,
    refetch: fetchPets,
  } = useQuery({
    queryKey: PETS_KEYS.list(filters, { currentPage, pageSize }),
    queryFn: async () => {
      if (!isAuthenticated) return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };

      const params = {
        page: currentPage,
        limit: pageSize,
        search: filters.search || undefined,
        type: filters.type || undefined,
        ownerName: filters.ownerName || undefined,
        isActive: filters.isActive,
        sortBy: 'createdAt',
        sortOrder: 'DESC' as const,
      };

      return await PetsService.getPets(params);
    },
    enabled: isAuthenticated,
    staleTime: CACHE_PRESETS.STANDARD.staleTime,
    gcTime: CACHE_PRESETS.STANDARD.gcTime,
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Extract data from query result
  const pets = petsData?.data || [];
  const total = petsData?.total || 0;
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : 'Failed to fetch pets'
    : null;

  // Pet types are now static - no need to fetch from API

  // Table change handler
  const handleTableChange = useCallback((pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  }, []);

  // Row selection change handler
  const handleRowSelectionChange = useCallback((selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  // Filter handlers
  const handleSearch = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const handleTypeFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
    setCurrentPage(1);
  }, []);

  const handleOwnerFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, ownerName: value }));
    setCurrentPage(1);
  }, []);

  const handleActiveFilter = useCallback((value: boolean | undefined) => {
    setFilters(prev => ({ ...prev, isActive: value }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      type: '',
      ownerName: '',
      isActive: undefined,
    });
    setCurrentPage(1);
  }, []);

  // Mutations for CRUD operations
  const createPetMutation = useMutation({
    mutationFn: PetsService.createPet,
    onSuccess: () => {
      // Invalidate and refetch pets list
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.lists() });
      message.success('Pet created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create pet';
      message.error(errorMessage);
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PetFormData }) =>
      PetsService.updatePet(id, data),
    onSuccess: (_: any, { id }: { id: string; data: PetFormData }) => {
      // Invalidate and refetch pets list and specific pet detail
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.detail(id) });
      message.success('Pet updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update pet';
      message.error(errorMessage);
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: PetsService.deletePet,
    onSuccess: (_: any, id: string) => {
      // Invalidate and refetch pets list and remove specific pet detail from cache
      queryClient.invalidateQueries({ queryKey: PETS_KEYS.lists() });
      queryClient.removeQueries({ queryKey: PETS_KEYS.detail(id) });
      message.success('Pet deleted successfully');
    },
    onError: (error: any) => {
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
    filters,
    petTypes,
    breeds,
    fetchPets: () => fetchPets().then(() => {}),
    handleTableChange,
    handleRowSelectionChange,
    handleSearch,
    handleTypeFilter,
    handleOwnerFilter,
    handleActiveFilter,
    handleClearFilters,
    handleCreatePet,
    handleUpdatePet,
    handleDeletePet,
    handleViewPet,
    handleEditPet,
  };
};
