/**
 * Pet Owner Information Card
 */

import type { Pet } from '@/types';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Card, Descriptions } from 'antd';
import { FC } from 'react';

interface PetOwnerInfoCardProps {
  pet: Pet;
}

export const PetOwnerInfoCard: FC<PetOwnerInfoCardProps> = ({ pet }) => {
  return (
    <Card title='Owner Information' size='small'>
      <Descriptions column={2} size='small'>
        <Descriptions.Item label='Name'>
          <span className='font-medium'>
            {pet.owner.firstName} {pet.owner.lastName}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label='Email'>
          <MailOutlined className='mr-1' />
          <a href={`mailto:${pet.owner.email}`} className='text-blue-600'>
            {pet.owner.email}
          </a>
        </Descriptions.Item>

        <Descriptions.Item label='Phone'>
          <PhoneOutlined className='mr-1' />
          <a href={`tel:${pet.owner.phone}`} className='text-blue-600'>
            {pet.owner.phone}
          </a>
        </Descriptions.Item>

        <Descriptions.Item label='Date of Birth'>
          {pet.owner.dateOfBirth ? new Date(pet.owner.dateOfBirth).toLocaleDateString() : 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label='Address' span={2}>
          {pet.owner.address}, {pet.owner.city}, {pet.owner.postalCode}, {pet.owner.country}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
