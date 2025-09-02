import { Avatar, Badge, Button, Space, Table, Tag, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { Pet, PetTableProps } from '@/types';

import { TABLE_PAGE_SIZES } from '@/constants';

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
  const createActionHandlers = (pet: Pet) => {
    const handleViewPet = () => onViewPet(pet);
    const handleEditPet = () => onEditPet(pet);
    const handleDeletePet = () => onDeletePet(pet.id);

    return { handleViewPet, handleEditPet, handleDeletePet };
  };

  const getPetSpeciesColor = (species: string): string => {
    const speciesColors: Record<string, string> = {
      dog: 'blue',
      cat: 'orange',
      bird: 'green',
      fish: 'cyan',
      rabbit: 'purple',
      hamster: 'magenta',
      guinea_pig: 'lime',
      reptile: 'volcano',
      other: 'default',
    };
    return speciesColors[species.toLowerCase()] || 'default';
  };

  const getGenderColor = (gender: string): string => {
    const genderColors: Record<string, string> = {
      male: 'blue',
      female: 'pink',
    };
    return genderColors[gender.toLowerCase()] || 'default';
  };

  const getSizeColor = (size: string): string => {
    const sizeColors: Record<string, string> = {
      small: 'green',
      medium: 'orange',
      large: 'red',
    };
    return sizeColors[size.toLowerCase()] || 'default';
  };

  const columns = [
    {
      title: 'Pet',
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
              {pet.date_of_birth && `Born: ${new Date(pet.date_of_birth).toLocaleDateString()}`}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Species & Details',
      key: 'species_details',
      render: (pet: Pet) => (
        <div className='space-y-1'>
          <Tag color={getPetSpeciesColor(pet.species)}>
            {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
          </Tag>
          {pet.breed && <div className='text-sm text-text-light'>{pet.breed}</div>}
          <div className='flex gap-1'>
            <Tag color={getGenderColor(pet.gender)}>{pet.gender}</Tag>
            <Tag color={getSizeColor(pet.size)}>{pet.size}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Owner',
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
      title: 'Details',
      key: 'details',
      render: (pet: Pet) => (
        <div className='space-y-1'>
          <div className='text-sm'>
            <span className='text-text-light'>Weight: </span>
            {pet.weight} kg
          </div>
          {pet.color && (
            <div className='text-sm'>
              <span className='text-text-light'>Color: </span>
              {pet.color}
            </div>
          )}
          {pet.microchip_number && (
            <div className='text-sm'>
              <span className='text-text-light'>Microchip: </span>
              {pet.microchip_number}
            </div>
          )}
          <div className='text-xs'>
            <Tag color={pet.is_spayed_neutered ? 'green' : 'orange'}>
              {pet.is_spayed_neutered ? 'Spayed/Neutered' : 'Not Spayed/Neutered'}
            </Tag>
          </div>
          <div className='text-xs'>
            <Tag color={pet.is_vaccinated ? 'green' : 'red'}>
              {pet.is_vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (pet: Pet) => (
        <Badge
          status={pet.is_active ? 'success' : 'error'}
          text={pet.is_active ? 'Active' : 'Inactive'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (pet: Pet) => {
        const { handleViewPet, handleEditPet, handleDeletePet } = createActionHandlers(pet);

        return (
          <Space>
            <Tooltip title='View Details'>
              <Button size='small' icon={<EyeOutlined />} onClick={handleViewPet} />
            </Tooltip>
            <Tooltip title='Edit Pet'>
              <Button size='small' icon={<EditOutlined />} onClick={handleEditPet} />
            </Tooltip>
            <Tooltip title='Delete Pet'>
              <Button size='small' danger icon={<DeleteOutlined />} onClick={handleDeletePet} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleShowTotal = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} of ${total} pets`;
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
