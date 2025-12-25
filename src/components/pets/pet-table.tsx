import type { Pet, PetTableProps } from '@/types';
import { getPetGenderColor, getPetSizeColor, getPetSpeciesColor } from '@/utils/color-helpers';
import {
	CheckCircleOutlined,
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	HeartOutlined,
} from '@ant-design/icons';
import { Avatar, Input, Table, Tag, Tooltip } from 'antd';

import { TABLE_PAGE_SIZES } from '@/constants';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PetTable = ({
	pets,
	loading = false,
	currentPage = 1,
	pageSize = 10,
	total = 0,
	selectedRowKeys = [],
	onViewPet,
	onEditPet,
	onDeletePet,
	onTableChange,
	onRowSelectionChange,
}: PetTableProps) => {
	const { t } = useTranslation('components');
	const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
	const [editValue, setEditValue] = useState<string>('');

	const startEdit = (petId: string, field: string, currentValue: string) => {
		setEditingCell({ id: petId, field });
		setEditValue(currentValue);
	};

	const cancelEdit = () => {
		setEditingCell(null);
		setEditValue('');
	};

	const saveEdit = () => {
		// TODO: Implement API call to save the edit
		// For now, just close the edit mode
		console.log('Saving edit:', editingCell, editValue);
		setEditingCell(null);
		setEditValue('');
	};

	const getPetTagStyle = (color: string): { bg: string; text: string; border: string } => {
		const colors = {
			blue: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
			green: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
			orange: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
			red: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
			pink: { bg: '#fce7f3', text: '#be185d', border: '#f9a8d4' },
			default: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
		};

		return colors[color as keyof typeof colors] || colors.default;
	};

	const columns = [
		{
			title: 'Pet',
			key: 'pet',
			width: 200,
			render: (pet: Pet) => {
				const isEditingName = editingCell?.id === pet.id && editingCell?.field === 'name';

				return (
					<div className='flex items-center gap-2'>
						<Avatar
							size={32}
							src={pet.photo_url}
							className='border border-gray-200'
							style={{ backgroundColor: '#ec4899' }}
						/>
						<div className='flex-1 min-w-0'>
							{isEditingName ? (
								<div className='flex items-center gap-1'>
									<Input
										size='small'
										value={editValue}
										onChange={(e) => setEditValue(e.target.value)}
										onPressEnter={saveEdit}
										autoFocus
										className='text-xs'
									/>
									<CheckOutlined
										className='text-green-600 cursor-pointer hover:text-green-700'
										onClick={saveEdit}
									/>
									<CloseOutlined
										className='text-gray-400 cursor-pointer hover:text-gray-600'
										onClick={cancelEdit}
									/>
								</div>
							) : (
								<div
									className='font-medium text-sm text-gray-900 truncate cursor-pointer hover:text-blue-600'
									onClick={() => startEdit(pet.id, 'name', pet.name)}
								>
									{pet.name}
								</div>
							)}
							<div className='text-xs text-gray-500 truncate'>
								{pet.breed || pet.species}
							</div>
						</div>
					</div>
				);
			},
		},
		{
			title: 'Species',
			key: 'species',
			width: 100,
			render: (pet: Pet) => (
				<Tag
					className='!border-0 !px-2 !py-0.5 !rounded-full text-xs font-medium'
					style={getPetTagStyle(getPetSpeciesColor(pet.species))}
				>
					{pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
				</Tag>
			),
		},
		{
			title: 'Gender',
			key: 'gender',
			width: 80,
			render: (pet: Pet) => (
				<Tag
					className='!border-0 !px-2 !py-0.5 !rounded-full text-xs'
					style={getPetTagStyle(getPetGenderColor(pet.gender))}
				>
					{pet.gender}
				</Tag>
			),
		},
		{
			title: 'Size',
			key: 'size',
			width: 80,
			render: (pet: Pet) => (
				<Tag
					className='!border-0 !px-2 !py-0.5 !rounded-full text-xs'
					style={getPetTagStyle(getPetSizeColor(pet.size))}
				>
					{pet.size}
				</Tag>
			),
		},
		{
			title: 'Weight',
			key: 'weight',
			width: 90,
			render: (pet: Pet) => {
				const isEditingWeight = editingCell?.id === pet.id && editingCell?.field === 'weight';

				return isEditingWeight ? (
					<div className='flex items-center gap-1'>
						<Input
							size='small'
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							onPressEnter={saveEdit}
							autoFocus
							className='text-xs w-16'
						/>
						<CheckOutlined
							className='text-green-600 cursor-pointer hover:text-green-700'
							onClick={saveEdit}
						/>
						<CloseOutlined
							className='text-gray-400 cursor-pointer hover:text-gray-600'
							onClick={cancelEdit}
						/>
					</div>
				) : (
					<span
						className='text-sm cursor-pointer hover:text-blue-600'
						onClick={() => startEdit(pet.id, 'weight', pet.weight)}
					>
						{pet.weight} kg
					</span>
				);
			},
		},
		{
			title: 'Owner',
			key: 'owner',
			width: 180,
			render: (pet: Pet) => (
				<div>
					<div className='font-medium text-sm text-gray-900 truncate'>
						{pet.owner.firstName} {pet.owner.lastName}
					</div>
					<div className='text-xs text-gray-500 truncate'>{pet.owner.email}</div>
				</div>
			),
		},
		{
			title: 'Status',
			key: 'status',
			width: 100,
			render: (pet: Pet) => (
				<div className='flex items-center gap-1'>
					<Tag
						className='!border-0 !px-2 !py-0.5 !rounded-full text-xs'
						style={
							pet.is_spayed_neutered
								? getPetTagStyle('green')
								: getPetTagStyle('orange')
						}
					>
						{pet.is_spayed_neutered ? 'Spayed' : 'Intact'}
					</Tag>
					<Tag
						className='!border-0 !px-2 !py-0.5 !rounded-full text-xs'
						style={
							pet.is_vaccinated
								? getPetTagStyle('green')
								: getPetTagStyle('red')
						}
					>
						{pet.is_vaccinated ? 'Vacc.' : 'Not Vacc.'}
					</Tag>
				</div>
			),
		},
		{
			title: 'Active',
			key: 'is_active',
			width: 80,
			align: 'center' as const,
			render: (pet: Pet) => (
				<div
					className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pet.is_active
						? 'bg-green-100 text-green-700'
						: 'bg-gray-100 text-gray-600'
						}`}
				>
					{pet.is_active ? (
						<>
							<CheckCircleOutlined className='mr-1' />
							Yes
						</>
					) : (
						'No'
					)}
				</div>
			),
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 100,
			align: 'center' as const,
			fixed: 'right' as const,
			render: (pet: Pet) => (
				<div className='flex items-center justify-center gap-1'>
					<Tooltip title='View'>
						<button
							type='button'
							onClick={() => onViewPet(pet)}
							className='p-1 hover:bg-blue-50 rounded transition-colors'
						>
							<EyeOutlined className='text-blue-600 text-sm' />
						</button>
					</Tooltip>
					<Tooltip title='Edit'>
						<button
							type='button'
							onClick={() => onEditPet(pet)}
							className='p-1 hover:bg-green-50 rounded transition-colors'
						>
							<EditOutlined className='text-green-600 text-sm' />
						</button>
					</Tooltip>
					<Tooltip title='Delete'>
						<button
							type='button'
							onClick={() => onDeletePet(pet.id)}
							className='p-1 hover:bg-red-50 rounded transition-colors'
						>
							<DeleteOutlined className='text-red-600 text-sm' />
						</button>
					</Tooltip>
				</div>
			),
		},
	];

	const handleShowTotal = (total: number, range: [number, number]) => {
		return t('petTable.showTotal', { start: range[0], end: range[1], total });
	};

	return (
		<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
			<Table
				columns={columns}
				dataSource={pets}
				rowKey='id'
				loading={loading}
				scroll={{ x: 'max-content' }}
				pagination={{
					current: currentPage,
					pageSize,
					total,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: handleShowTotal,
					pageSizeOptions: TABLE_PAGE_SIZES.map(String),
					position: ['bottomCenter'],
					size: 'small',
				}}
				onChange={onTableChange}
				rowSelection={{
					selectedRowKeys,
					onChange: onRowSelectionChange as any,
				}}
				className='compact-table'
				size='small'
				locale={{
					emptyText: loading ? null : (
						<div className='text-center py-12'>
							<HeartOutlined className='text-5xl text-gray-300 mb-4' />
							<div className='text-xl font-medium text-gray-500 mb-2'>No Pets Found</div>
							<div className='text-gray-400'>No pet data available at the moment</div>
						</div>
					),
				}}
			/>
		</div>
	);
};

export { PetTable };
export default PetTable;
