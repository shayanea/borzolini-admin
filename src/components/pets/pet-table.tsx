import { Avatar, Badge, Button, Space, Table, Tag, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
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

  const columns = [
    {
      title: t('petTable.pet'),
      key: 'pet',
      render: (pet: Pet) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={32}
            src={pet.photo_url}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <div className='font-medium'>{pet.name}</div>
            <div className='text-sm text-text-light'>
              {pet.breed ? `${pet.breed} ${pet.species}` : pet.species}
            </div>
            <div className='text-xs text-text-light'>
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
      render: (pet: Pet) => (
        <div className='space-y-1'>
          <Tag bordered={false} color={getPetSpeciesColor(pet.species)}>
            {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
          </Tag>
          {pet.breed && <div className='text-sm text-text-light'>{pet.breed}</div>}
          <div className='flex gap-1'>
            <Tag bordered={false} color={getPetGenderColor(pet.gender)}>{pet.gender}</Tag>
            <Tag bordered={false} color={getPetSizeColor(pet.size)}>{pet.size}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: t('petTable.owner'),
      key: 'owner',
      render: (pet: Pet) => (
        <div className='space-y-1'>
          <div className='font-medium'>
            {pet.owner.firstName} {pet.owner.lastName}
          </div>
          <div className='text-sm text-text-light'>{pet.owner.email}</div>
          <div className='text-xs text-text-light flex items-center'>
            <PhoneOutlined className='mr-1' />
            {pet.owner.phone}
          </div>
        </div>
      ),
    },
    {
      title: t('petTable.details'),
      key: 'details',
      render: (pet: Pet) => (
        <div className='space-y-1'>
          <div className='text-sm'>
            <span className='text-text-light'>{t('petTable.weight')}: </span>
            {pet.weight} kg
          </div>
          {pet.color && (
            <div className='text-sm'>
              <span className='text-text-light'>{t('petTable.color')}: </span>
              {pet.color}
            </div>
          )}
          {pet.microchip_number && (
            <div className='text-sm'>
              <span className='text-text-light'>{t('petTable.microchip')}: </span>
              {pet.microchip_number}
            </div>
          )}
          <div className='text-xs'>
            <Tag bordered={false} color={pet.is_spayed_neutered ? 'green' : 'orange'}>
              {pet.is_spayed_neutered
                ? t('petTable.spayedNeutered')
                : t('petTable.notSpayedNeutered')}
            </Tag>
          </div>
          <div className='text-xs'>
            <Tag bordered={false} color={pet.is_vaccinated ? 'green' : 'red'}>
              {pet.is_vaccinated ? t('petTable.vaccinated') : t('petTable.notVaccinated')}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: t('petTable.status'),
      key: 'status',
      render: (pet: Pet) => (
        <Badge
          status={pet.is_active ? 'success' : 'error'}
          text={pet.is_active ? t('petTable.active') : t('petTable.inactive')}
        />
      ),
    },
    {
      title: t('petTable.actions'),
      key: 'actions',
      render: (pet: Pet) => {
        const { handleViewPet, handleEditPet, handleDeletePet } = createActionHandlers(pet);

        return (
          <Space>
            <Tooltip title={t('petTable.viewDetails')}>
              <Button size='small' icon={<EyeOutlined />} onClick={handleViewPet} />
            </Tooltip>
            <Tooltip title={t('petTable.editPet')}>
              <Button size='small' icon={<EditOutlined />} onClick={handleEditPet} />
            </Tooltip>
            <Tooltip title={t('petTable.deletePet')}>
              <Button size='small' danger icon={<DeleteOutlined />} onClick={handleDeletePet} />
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
    <div className='admin-card'>
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
      />
    </div>
  );
};

export default PetTable;
