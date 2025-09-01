import type { Pet, PetFormData, UsePetManagementReturn } from '@/types';
import { useCallback, useEffect, useState } from 'react';

import { PetsService } from '@/services/pets.service';
import { message } from 'antd';

export const usePetManagement = (): UsePetManagementReturn => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [petTypes, setPetTypes] = useState<string[]>([]);
  const [breeds] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    ownerName: '',
    isActive: undefined as boolean | undefined,
  });

  // Fetch pets with current filters and pagination
  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
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

      const response = await PetsService.getPets(params);
      setPets(response.data);
      setTotal(response.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pets';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  // Fetch pet types
  const fetchPetTypes = useCallback(async () => {
    try {
      const types = await PetsService.getPetTypes();
      setPetTypes(types);
    } catch (err) {
      console.error('Failed to fetch pet types:', err);
    }
  }, []);

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

  // CRUD operations
  const handleCreatePet = useCallback(
    async (data: PetFormData) => {
      setLoading(true);
      try {
        await PetsService.createPet(data);
        message.success('Pet created successfully');
        await fetchPets();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create pet';
        message.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPets]
  );

  const handleUpdatePet = useCallback(
    async (id: string, data: PetFormData) => {
      setLoading(true);
      try {
        await PetsService.updatePet(id, data);
        message.success('Pet updated successfully');
        await fetchPets();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update pet';
        message.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPets]
  );

  const handleDeletePet = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await PetsService.deletePet(id);
        message.success('Pet deleted successfully');
        await fetchPets();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete pet';
        message.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPets]
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

  // Initial data fetch
  useEffect(() => {
    fetchPets();
    fetchPetTypes();
  }, [fetchPets, fetchPetTypes]);

  // Refetch when filters change
  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return {
    pets,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    selectedRowKeys,
    filters,
    petTypes,
    breeds,
    fetchPets,
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
