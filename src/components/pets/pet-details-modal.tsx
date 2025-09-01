import { Avatar, Badge, Descriptions, Modal, Tag } from 'antd';

import type { PetDetailsModalProps } from '@/types';
import { UserOutlined } from '@ant-design/icons';

const PetDetailsModal = ({ pet, isVisible, onClose }: PetDetailsModalProps) => {
  if (!pet) return null;

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

  return (
    <Modal
      title={
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <div className='text-lg font-semibold'>{pet.name}</div>
            <div className='text-sm text-text-light'>
              {pet.breed ? `${pet.breed} ${pet.type}` : pet.type}
            </div>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions column={1} bordered size='small'>
        <Descriptions.Item label='Pet Name'>
          <span className='font-medium'>{pet.name}</span>
        </Descriptions.Item>

        <Descriptions.Item label='Type'>
          <Tag color={getPetTypeColor(pet.type)}>
            {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
          </Tag>
        </Descriptions.Item>

        {pet.breed && <Descriptions.Item label='Breed'>{pet.breed}</Descriptions.Item>}

        {pet.age && <Descriptions.Item label='Age'>{pet.age} years</Descriptions.Item>}

        {pet.weight && <Descriptions.Item label='Weight'>{pet.weight} kg</Descriptions.Item>}

        {pet.microchipId && (
          <Descriptions.Item label='Microchip ID'>
            <code className='bg-gray-100 px-2 py-1 rounded'>{pet.microchipId}</code>
          </Descriptions.Item>
        )}

        <Descriptions.Item label='Status'>
          <Badge
            status={pet.isActive ? 'success' : 'error'}
            text={pet.isActive ? 'Active' : 'Inactive'}
          />
        </Descriptions.Item>

        <Descriptions.Item label='Owner Name'>
          <span className='font-medium'>{pet.ownerName}</span>
        </Descriptions.Item>

        {pet.ownerEmail && (
          <Descriptions.Item label='Owner Email'>
            <a href={`mailto:${pet.ownerEmail}`} className='text-blue-600'>
              {pet.ownerEmail}
            </a>
          </Descriptions.Item>
        )}

        {pet.ownerPhone && (
          <Descriptions.Item label='Owner Phone'>
            <a href={`tel:${pet.ownerPhone}`} className='text-blue-600'>
              {pet.ownerPhone}
            </a>
          </Descriptions.Item>
        )}

        <Descriptions.Item label='Created'>
          {new Date(pet.createdAt).toLocaleDateString()}
        </Descriptions.Item>

        <Descriptions.Item label='Last Updated'>
          {new Date(pet.updatedAt).toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PetDetailsModal;
