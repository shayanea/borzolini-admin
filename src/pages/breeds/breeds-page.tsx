import { Button, Card, Typography, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BreedFormModal,
  BreedViewModal,
  BreedsFilters,
  BreedsPageHeader,
  BreedsTable,
} from '@/components/breeds';

import { ReloadOutlined } from '@ant-design/icons';
import type { Breed } from '@/types/breeds';
import { useBreedForm } from '@/hooks/breeds';
import { useBreeds } from '@/hooks/breeds';

const { Text } = Typography;

function BreedsPage() {
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [selectedIsActive, setSelectedIsActive] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const {
    createBreed,
    getBreeds,
    getBreed,
    updateBreed,
    deleteBreed,
    bulkDeleteBreeds,
    loading: apiLoading,
    error,
  } = useBreeds();

  const createForm = useBreedForm();
  const editForm = useBreedForm(selectedBreed || undefined);

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBreeds = async () => {
    setLoading(true);
    const result = await getBreeds();
    if (result) {
      // Flatten breeds from all species
      const allBreeds: Breed[] = result.breeds_by_species.flatMap(group => group.breeds);
      setBreeds(allBreeds);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBreeds();
  }, []);

  const filteredBreeds = useMemo(() => {
    let filtered = breeds;

    if (searchTerm) {
      filtered = filtered.filter(
        breed =>
          breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          breed.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecies) {
      filtered = filtered.filter(breed => breed.species === selectedSpecies);
    }

    if (selectedIsActive !== undefined) {
      filtered = filtered.filter(breed => breed.is_active === selectedIsActive);
    }

    return filtered;
  }, [breeds, searchTerm, selectedSpecies, selectedIsActive]);

  const paginatedBreeds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredBreeds.slice(start, end);
  }, [filteredBreeds, currentPage, pageSize]);

  const handleCreate = async (): Promise<boolean> => {
    const success = await createForm.handleSubmit(async data => {
      const result = await createBreed(data as Parameters<typeof createBreed>[0]);
      if (result) {
        setShowCreateModal(false);
        createForm.resetForm();
        await loadBreeds();
        message.success('Breed created successfully');
      }
    });
    return success ?? false;
  };

  const handleEdit = async (): Promise<boolean> => {
    if (!selectedBreed) return false;
    const success = await editForm.handleSubmit(async data => {
      const result = await updateBreed(selectedBreed.id, data);
      if (result) {
        setShowEditModal(false);
        setSelectedBreed(null);
        editForm.resetForm();
        await loadBreeds();
        message.success('Breed updated successfully');
      }
    });
    return success ?? false;
  };

  const handleDelete = async (id: string) => {
    const success = await deleteBreed(id);
    if (success) {
      await loadBreeds();
      setSelectedIds(prev => prev.filter(idToRemove => idToRemove !== id));
      message.success('Breed deleted successfully');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const success = await bulkDeleteBreeds(selectedIds);
    if (success) {
      await loadBreeds();
      setSelectedIds([]);
      message.success(`${selectedIds.length} breeds deleted successfully`);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSpeciesChange = (value: string) => {
    setSelectedSpecies(value);
    setCurrentPage(1);
  };

  const handleIsActiveChange = (value: boolean | undefined) => {
    setSelectedIsActive(value);
    setCurrentPage(1);
  };

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSpecies('');
    setSelectedIsActive(undefined);
    setCurrentPage(1);
  }, []);

  const getSpeciesColor = useCallback((species: string) => {
    const colorMap: Record<string, 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'default'> = {
      dog: 'blue',
      cat: 'green',
      bird: 'orange',
      rabbit: 'purple',
      hamster: 'pink',
      fish: 'cyan',
      reptile: 'lime',
      horse: 'gold',
      other: 'default',
    };
    return colorMap[species.toLowerCase()] || 'default';
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(paginatedBreeds.map(b => b.id));
      } else {
        setSelectedIds([]);
      }
    },
    [paginatedBreeds]
  );

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  }, []);

  const handleViewBreed = useCallback(
    async (breed: Breed) => {
      const breedData = await getBreed(breed.id);
      setSelectedBreed(breedData || null);
      setShowViewModal(true);
    },
    [getBreed]
  );

  const handleEditBreed = useCallback(
    async (breed: Breed) => {
      const breedData = await getBreed(breed.id);
      setSelectedBreed(breedData || null);
      if (breedData) {
        editForm.resetForm(breedData);
      }
      setShowEditModal(true);
    },
    [getBreed, editForm]
  );

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card>
          <div className='text-center'>
            <Text type='danger' className='block mb-4'>
              Error: {error.message}
            </Text>
            <Button onClick={loadBreeds} icon={<ReloadOutlined />}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <BreedsPageHeader
        onCreate={() => setShowCreateModal(true)}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
        loading={apiLoading}
      />

      <BreedsFilters
        searchTerm={searchTerm}
        selectedSpecies={selectedSpecies}
        selectedIsActive={selectedIsActive}
        onSearch={handleSearch}
        onSpeciesChange={handleSpeciesChange}
        onIsActiveChange={handleIsActiveChange}
        onClearFilters={handleClearFilters}
      />

      <BreedsTable
        breeds={paginatedBreeds}
        loading={loading}
        totalCount={filteredBreeds.length}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedIds={selectedIds}
        onPageChange={setCurrentPage}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onView={handleViewBreed}
        onEdit={handleEditBreed}
        onDelete={handleDelete}
        getSpeciesColor={getSpeciesColor}
      />

      <BreedFormModal
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          createForm.resetForm();
        }}
        onSubmit={handleCreate}
        form={createForm}
        isLoading={apiLoading || createForm.isSubmitting}
        isEdit={false}
      />

      <BreedFormModal
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedBreed(null);
          editForm.resetForm();
        }}
        onSubmit={handleEdit}
        form={editForm}
        isLoading={apiLoading || editForm.isSubmitting}
        isEdit={true}
        breed={selectedBreed}
      />

      <BreedViewModal
        breed={selectedBreed}
        open={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBreed(null);
        }}
        getSpeciesColor={getSpeciesColor}
      />
    </div>
  );
}

export { BreedsPage };
export default BreedsPage;

