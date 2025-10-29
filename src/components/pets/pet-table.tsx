import { Avatar, Badge, Button, Space, Table, Tag, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import type { Pet, PetTableProps } from '@/types';
import { getPetGenderColor, getPetSizeColor, getPetSpeciesColor } from '@/utils/color-helpers';

import { TABLE_PAGE_SIZES } from '@/constants';
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

  const createActionHandlers = (pet: Pet) => {
    const handleViewPet = () => onViewPet(pet);
    const handleEditPet = () => onEditPet(pet);
    const handleDeletePet = () => onDeletePet(pet.id);

    return { handleViewPet, handleEditPet, handleDeletePet };
  };

  const getPetTagStyle = (color: string): { bg: string; text: string; border: string } => {
    const colors = {
      blue: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
      green: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
      orange: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
      red: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
      default: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
    };

    return colors[color as keyof typeof colors] || colors.default;
  };

  const columns = [
    {
      title: t('petTable.pet'),
      key: 'pet',
      width: 280,
      render: (pet: Pet) => (
        <div className='flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow'>
          <Avatar
            size={44}
            src={pet.photo_url}
            icon={<UserOutlined />}
            className='border-2 border-slate-200 shadow-sm'
            style={{ backgroundColor: '#ec4899' }}
          />
          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-sm text-slate-800 truncate'>
              {pet.name}
            </div>
            <div className='text-xs text-slate-600 flex items-center gap-1'>
              {pet.breed ? (
                <>
                  <span className='truncate'>{pet.breed}</span>
                  <span>• {pet.species}</span>
                </>
              ) : (
                <span>{pet.species}</span>
              )}
            </div>
            <div className='text-xs text-slate-500'>
              {pet.date_of_birth &&
                `${t('petTable.born')}: ${new Date(pet.date_of_birth).toLocaleDateString()}`}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('petTable.speciesDetails'),
      key: 'species_details',
      width: 220,
      render: (pet: Pet) => (
        <div className='space-y-2'>
          <Tag 
            className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
            style={{
              backgroundColor: getPetSpeciesColor(pet.species) === 'blue' ? '#dbeafe' :
                             getPetSpeciesColor(pet.species) === 'green' ? '#d1fae5' :
                             getPetSpeciesColor(pet.species) === 'orange' ? '#fef3c7' :
                             '#f1f5f9',
              color: getPetSpeciesColor(pet.species) === 'blue' ? '#1e40af' :
                     getPetSpeciesColor(pet.species) === 'green' ? '#047857' :
                     getPetSpeciesColor(pet.species) === 'orange' ? '#d97706' :
                     '#475569',
              border: getPetSpeciesColor(pet.species) === 'blue' ? '1px solid #93c5fd' :
                      getPetSpeciesColor(pet.species) === 'green' ? '1px solid #a7f3d0' :
                      getPetSpeciesColor(pet.species) === 'orange' ? '1px solid #fcd34d' :
                      '1px solid #cbd5e1',
            }}
          >
            {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
          </Tag>
          {pet.breed && (
            <div className='text-sm text-slate-600 font-medium'>
              {pet.breed}
            </div>
          )}
          <div className='flex gap-1'>
            <Tag 
              className='!border-0 !px-2.5 !py-1 !rounded-full shadow-sm'
              style={getPetTagStyle(getPetGenderColor(pet.gender))}
            >
              {pet.gender}
            </Tag>
            <Tag 
              className='!border-0 !px-2.5 !py-1 !rounded-full shadow-sm'
              style={getPetTagStyle(getPetSizeColor(pet.size))}
            >
              {pet.size}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: t('petTable.owner'),
      key: 'owner',
      width: 260,
      render: (pet: Pet) => (
        <div className='space-y-1 text-sm'>
          <div className='font-medium text-slate-800'>
            {pet.owner.firstName} {pet.owner.lastName}
          </div>
          <div className='text-xs text-slate-600'>
            {pet.owner.email}
          </div>
          <div className='text-xs text-slate-500 flex items-center gap-1'>
            <PhoneOutlined className='text-slate-400' />
            {pet.owner.phone}
          </div>
        </div>
      ),
    },
    {
      title: t('petTable.details'),
      key: 'details',
      width: 220,
      render: (pet: Pet) => (
        <div className='space-y-2 text-sm'>
          <div className='flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200'>
            <span className='text-slate-600 font-medium min-w-[60px]'>{t('petTable.weight')}:</span>
            <span className='text-slate-800 font-semibold'>{pet.weight} kg</span>
          </div>
          {pet.color && (
            <div className='flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200'>
              <span className='text-slate-600 font-medium min-w-[60px]'>{t('petTable.color')}:</span>
              <span className='text-slate-800'>{pet.color}</span>
            </div>
          )}
          {pet.microchip_number && (
            <div className='flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200'>
              <span className='text-slate-600 font-medium min-w-[60px]'>{t('petTable.microchip')}:</span>
              <span className='text-slate-800 font-semibold'>{pet.microchip_number}</span>
            </div>
          )}
          <div className='flex gap-1'>
            <Tag 
              className='!border-0 !px-2.5 !py-1 !rounded-full font-medium shadow-sm'
              style={{
                backgroundColor: pet.is_spayed_neutered ? '#d1fae5' : '#fef3c7',
                color: pet.is_spayed_neutered ? '#047857' : '#d97706',
                border: pet.is_spayed_neutered ? '1px solid #a7f3d0' : '1px solid #fcd34d',
              }}
            >
              {pet.is_spayed_neutered
                ? t('petTable.spayedNeutered')
                : t('petTable.notSpayedNeutered')}
            </Tag>
            <Tag 
              className='!border-0 !px-2.5 !py-1 !rounded-full font-medium shadow-sm'
              style={{
                backgroundColor: pet.is_vaccinated ? '#d1fae5' : '#fee2e2',
                color: pet.is_vaccinated ? '#047857' : '#dc2626',
                border: pet.is_vaccinated ? '1px solid #a7f3d0' : '1px solid #fca5a5',
              }}
            >
              {pet.is_vaccinated ? t('petTable.vaccinated') : t('petTable.notVaccinated')}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: t('petTable.status'),
      key: 'status',
      width: 140,
      align: 'center',
      render: (pet: Pet) => (
        <div className={`px-3 py-1.5 rounded-full font-medium text-sm shadow-sm flex items-center justify-center ${
          pet.is_active 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {pet.is_active ? (
            <>
              <CheckCircleOutlined className='text-green-600 mr-1 text-xs' />
              Active
            </>
          ) : (
            <>
              <ClockCircleOutlined className='text-slate-500 mr-1 text-xs' />
              Inactive
            </>
          )}
        </div>
      ),
    },
    {
      title: t('petTable.actions'),
      key: 'actions',
      width: 140,
      align: 'center',
      render: (pet: Pet) => {
        const { handleViewPet, handleEditPet, handleDeletePet } = createActionHandlers(pet);

        return (
          <Space size='middle' className='p-1'>
            <Tooltip title={t('petTable.viewDetails')}>
              <Button
                type='text'
                icon={<EyeOutlined className='text-blue-500' />}
                size='small'
                className='hover:bg-blue-50 rounded-full p-2 transition-colors'
                onClick={handleViewPet}
              />
            </Tooltip>
            <Tooltip title={t('petTable.editPet')}>
              <Button
                type='text'
                icon={<EditOutlined className='text-green-500' />}
                size='small'
                className='hover:bg-green-50 rounded-full p-2 transition-colors'
                onClick={handleEditPet}
              />
            </Tooltip>
            <Tooltip title={t('petTable.deletePet')}>
              <Button
                type='text'
                icon={<DeleteOutlined className='text-red-500' />}
                size='small'
                danger
                className='hover:bg-red-50 rounded-full p-2 transition-colors'
                onClick={handleDeletePet}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleShowTotal = (total: number, range: [number, number]) => {
    return t('petTable.showTotal', { start: range[0], end: range[1], total });
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      <Table
        columns={columns}
        dataSource={pets}
        rowKey='id'
        loading={loading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: handleShowTotal,
          pageSizeOptions: TABLE_PAGE_SIZES.map(String),
          position: ['bottomCenter'],
        }}
        onChange={onTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: onRowSelectionChange,
        }}
        className='custom-scrollbar'
        rowClassName='hover:bg-slate-50 transition-colors duration-200'
        locale={{
          emptyText: (
            <div className='text-center py-12'>
              <HeartOutlined className='text-5xl text-slate-300 mb-4' />
              <div className='text-xl font-medium text-slate-500 mb-2'>No Pets Found</div>
              <div className='text-slate-400'>No pet data available at the moment</div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default PetTable;
