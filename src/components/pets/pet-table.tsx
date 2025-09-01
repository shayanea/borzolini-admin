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

  const getPetTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
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
    return typeColors[type.toLowerCase()] || 'default';
  };

  const columns = [
    {
      title: 'Pet',
      key: 'pet',
      render: (pet: Pet) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={32}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <div className='font-medium'>{pet.name}</div>
            <div className='text-sm text-text-light'>{pet.breed ? `${pet.breed}` : pet.type}</div>
            {pet.age && <div className='text-xs text-text-light'>Age: {pet.age} years</div>}
          </div>
        </div>
      ),
    },
    {
      title: 'Type & Breed',
      key: 'type_breed',
      render: (pet: Pet) => (
        <div className='space-y-1'>
          <Tag color={getPetTypeColor(pet.type)}>
            {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
          </Tag>
          {pet.breed && <div className='text-sm text-text-light'>{pet.breed}</div>}
        </div>
      ),
    },
    {
      title: 'Owner',
      key: 'owner',
      render: (pet: Pet) => (
        <div className='space-y-1'>
          <div className='font-medium'>{pet.ownerName}</div>
          {pet.ownerEmail && <div className='text-sm text-text-light'>{pet.ownerEmail}</div>}
          {pet.ownerPhone && (
            <div className='text-xs text-text-light flex items-center'>
              <PhoneOutlined className='mr-1' />
              {pet.ownerPhone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      render: (pet: Pet) => (
        <div className='space-y-1'>
          {pet.weight && (
            <div className='text-sm'>
              <span className='text-text-light'>Weight: </span>
              {pet.weight} kg
            </div>
          )}
          {pet.microchipId && (
            <div className='text-sm'>
              <span className='text-text-light'>Microchip: </span>
              {pet.microchipId}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (pet: Pet) => (
        <Badge
          status={pet.isActive ? 'success' : 'error'}
          text={pet.isActive ? 'Active' : 'Inactive'}
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
    <Table
      columns={columns}
      dataSource={pets}
      rowKey='id'
      loading={loading}
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
    />
  );
};

export default PetTable;
