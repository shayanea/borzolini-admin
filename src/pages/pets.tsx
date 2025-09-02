import type { Pet, PetFormData } from '@/types';
import {
  PetBulkActions,
  PetDetailsModal,
  PetFilters,
  PetFormModal,
  PetPageHeader,
  PetTable,
} from '@/components/pets';
import React, { useCallback, useState } from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { usePetManagement } from '@/hooks';

const PetsPage: React.FC = () => {
  const {
    pets,
    loading,
    currentPage,
    pageSize,
    total,
    filters,
    fetchPets,
    handleTableChange,
    handleRowSelectionChange,
    handleSearch,
    handleSpeciesFilter,
    handleBreedFilter,
    handleGenderFilter,
    handleSizeFilter,
    handleActiveFilter,
    handleClearFilters,
    handleCreatePet,
    handleUpdatePet,
    handleDeletePet,
  } = usePetManagement();

  // Local state for selected rows
  const [localSelectedRowKeys, setLocalSelectedRowKeys] = useState<React.Key[]>([]);

  // Modal states
  const [isFormModalVisible, setIsFormModalVisible] = useState<boolean>(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // Form modal handlers
  const handleAddPet = useCallback(() => {
    setEditingPet(null);
    setIsFormModalVisible(true);
  }, []);

  const handleEditPet = useCallback((pet: Pet) => {
    setEditingPet(pet);
    setIsFormModalVisible(true);
  }, []);

  const handleViewPet = useCallback((pet: Pet) => {
    setViewingPet(pet);
    setIsDetailsModalVisible(true);
  }, []);

  const handleFormCancel = useCallback(() => {
    setIsFormModalVisible(false);
    setEditingPet(null);
  }, []);

  const handleFormSubmit = useCallback(
    async (values: PetFormData) => {
      setFormLoading(true);
      try {
        if (editingPet) {
          await handleUpdatePet(editingPet.id, values);
        } else {
          await handleCreatePet(values);
        }
        setIsFormModalVisible(false);
        setEditingPet(null);
      } catch (error) {
        // Error is already handled in the hook
      } finally {
        setFormLoading(false);
      }
    },
    [editingPet, handleCreatePet, handleUpdatePet]
  );

  // Delete confirmation
  const handleDeletePetConfirm = useCallback(
    (petId: string) => {
      Modal.confirm({
        title: 'Are you sure you want to delete this pet?',
        icon: <ExclamationCircleOutlined />,
        content: 'This action cannot be undone.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            await handleDeletePet(petId);
          } catch (error) {
            // Error is already handled in the hook
          }
        },
      });
    },
    [handleDeletePet]
  );

  // Bulk actions
  const selectedPets = pets?.filter(pet => localSelectedRowKeys.includes(pet.id));

  const handleBulkDelete = useCallback(() => {
    Modal.confirm({
      title: `Are you sure you want to delete ${localSelectedRowKeys.length} pets?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await Promise.all(localSelectedRowKeys.map(id => handleDeletePet(id as string)));
          setLocalSelectedRowKeys([]);
        } catch (error) {
          // Error is already handled in the hook
        }
      },
    });
  }, [localSelectedRowKeys, handleDeletePet]);

  const handleBulkActivate = useCallback(async () => {
    try {
      await Promise.all(
        selectedPets.map(pet => handleUpdatePet(pet.id, { ...pet, is_active: true }))
      );
      setLocalSelectedRowKeys([]);
    } catch (error) {
      // Error is already handled in the hook
    }
  }, [selectedPets, handleUpdatePet]);

  const handleBulkDeactivate = useCallback(async () => {
    try {
      await Promise.all(
        selectedPets.map(pet => handleUpdatePet(pet.id, { ...pet, is_active: false }))
      );
      setLocalSelectedRowKeys([]);
    } catch (error) {
      // Error is already handled in the hook
    }
  }, [selectedPets, handleUpdatePet]);

  return (
    <div className='space-y-6'>
      <PetPageHeader
        totalPets={total}
        onAddPet={handleAddPet}
        onRefresh={fetchPets}
        loading={loading}
      />

      <PetFilters
        searchText={filters.search}
        selectedSpecies={filters.species}
        selectedBreed={filters.breed}
        selectedGender={filters.gender}
        selectedSize={filters.size}
        isActiveFilter={filters.isActive}
        onSearch={handleSearch}
        onSpeciesFilter={handleSpeciesFilter}
        onBreedFilter={handleBreedFilter}
        onGenderFilter={handleGenderFilter}
        onSizeFilter={handleSizeFilter}
        onActiveFilter={handleActiveFilter}
        onClearFilters={handleClearFilters}
      />

      <PetBulkActions
        selectedRowKeys={localSelectedRowKeys}
        selectedPets={selectedPets}
        onBulkDelete={handleBulkDelete}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        loading={loading}
      />

      <PetTable
        pets={pets}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={total}
        selectedRowKeys={localSelectedRowKeys}
        onViewPet={handleViewPet}
        onEditPet={handleEditPet}
        onDeletePet={handleDeletePetConfirm}
        onTableChange={handleTableChange}
        onRowSelectionChange={(keys, rows) => {
          setLocalSelectedRowKeys(keys);
          handleRowSelectionChange(keys, rows);
        }}
      />

      <PetFormModal
        isVisible={isFormModalVisible}
        editingPet={editingPet}
        loading={formLoading}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
      />

      <PetDetailsModal
        pet={viewingPet}
        isVisible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
      />
    </div>
  );
};

export default PetsPage;
