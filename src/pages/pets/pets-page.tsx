import {
	PetBulkActions,
	PetDetailsModal,
	PetFilters,
	PetPageHeader,
	PetTable,
} from '@/components/pets';
import type { Pet } from '@/types';
import React, { useCallback, useState } from 'react';

import { ROUTES } from '@/constants';
import { usePetManagement } from '@/hooks';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function PetsPage() {
	const { t } = useTranslation('pages');
	const navigate = useNavigate();
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
		setFilter,
		handleClearFilters,
		handleDeletePet,
	} = usePetManagement();

	// Local state for selected rows
	const [localSelectedRowKeys, setLocalSelectedRowKeys] = useState<React.Key[]>([]);

	// Modal states
	const [isDetailsModalVisible, setIsDetailsModalVisible] = useState<boolean>(false);
	const [viewingPet, setViewingPet] = useState<Pet | null>(null);

	const handleViewPet = useCallback((pet: Pet) => {
		setViewingPet(pet);
		setIsDetailsModalVisible(true);
	}, []);

	const handleAddPet = useCallback(() => {
		navigate(ROUTES.PETS_CREATE);
	}, [navigate]);

	const handleEditPet = useCallback(
		(pet: Pet) => {
			navigate(`${ROUTES.PETS_EDIT}/${pet.id}`);
		},
		[navigate]
	);

	const handleOwnerClick = useCallback(
		(ownerId: string) => {
			navigate(`${ROUTES.USERS}/edit/${ownerId}`);
		},
		[navigate]
	);

	// Delete confirmation
	const handleDeletePetConfirm = useCallback(
		(petId: string) => {
			Modal.confirm({
				title: t('pets.deleteConfirm'),
				icon: <ExclamationCircleOutlined />,
				content: t('pets.deleteWarning'),
				okText: t('pets.yesDelete'),
				okType: 'danger',
				cancelText: t('pets.cancel'),
				onOk: async () => {
					try {
						await handleDeletePet(petId);
					} catch (error) {
						// Error is already handled in the hook
					}
				},
			});
		},
		[handleDeletePet, t]
	);

	// Bulk actions
	const selectedPets = pets?.filter(pet => localSelectedRowKeys.includes(pet.id));

	const handleBulkDelete = useCallback(() => {
		Modal.confirm({
			title: t('pets.deleteConfirmBulk', { count: localSelectedRowKeys.length }),
			icon: <ExclamationCircleOutlined />,
			content: t('pets.deleteWarning'),
			okText: t('pets.yesDeleteAll'),
			okType: 'danger',
			cancelText: t('pets.cancel'),
			onOk: async () => {
				try {
					await Promise.all(localSelectedRowKeys.map(id => handleDeletePet(id as string)));
					setLocalSelectedRowKeys([]);
				} catch (error) {
					// Error is already handled in the hook
				}
			},
		});
	}, [localSelectedRowKeys, handleDeletePet, t]);

	// Calculate gender stats
	const genderStats = React.useMemo(() => {
		if (!pets || pets.length === 0) return undefined;

		const maleCount = pets.filter(pet => pet.gender?.toLowerCase() === 'male').length;
		const femaleCount = pets.filter(pet => pet.gender?.toLowerCase() === 'female').length;

		return {
			total: pets.length,
			maleCount,
			femaleCount,
		};
	}, [pets]);

	const handleQuickGenderFilter = useCallback((gender: string | null) => {
		setFilter('gender', gender);
	}, [setFilter]);

	return (
		<div className='space-y-6'>
			<PetPageHeader
				totalPets={total}
				onAddPet={handleAddPet}
				onRefresh={fetchPets}
				loading={loading}
				stats={genderStats}
				onQuickGenderFilter={handleQuickGenderFilter}
			/>

			<PetFilters
				searchText={filters.search}
				selectedSpecies={filters.species}
				selectedBreed={filters.breed}
				selectedSize={filters.size}
				isActiveFilter={filters.isActive}
				onSearch={handleSearch}
				onSpeciesFilter={(val: string | null) => setFilter('species', val)}
				onBreedFilter={(val: string | null) => setFilter('breed', val)}
				onSizeFilter={(val: string | null) => setFilter('size', val)}
				onActiveFilter={(val: boolean | undefined) => setFilter('isActive', val)}
				onClearFilters={handleClearFilters}
			/>

			<PetBulkActions
				selectedRowKeys={localSelectedRowKeys}
				selectedPets={selectedPets}
				onBulkDelete={handleBulkDelete}
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
				onOwnerClick={handleOwnerClick}
				onTableChange={handleTableChange}
				onRowSelectionChange={(keys, rows) => {
					setLocalSelectedRowKeys(keys);
					handleRowSelectionChange(keys, rows);
				}}
			/>

			<PetDetailsModal
				pet={viewingPet}
				isVisible={isDetailsModalVisible}
				onClose={() => setIsDetailsModalVisible(false)}
			/>
		</div>
	);
}

export { PetsPage };
export default PetsPage;
