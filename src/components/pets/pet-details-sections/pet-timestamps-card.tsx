/**
 * Pet Timestamps Card
 */

import type { Pet } from '@/types';
import { CalendarOutlined } from '@ant-design/icons';
import { Card, Descriptions } from 'antd';
import { FC } from 'react';

interface PetTimestampsCardProps {
  pet: Pet;
}

export const PetTimestampsCard: FC<PetTimestampsCardProps> = ({ pet }) => {
  return (
    <Card title='Timestamps' size='small'>
      <Descriptions column={2} size='small'>
        <Descriptions.Item label='Created'>
          <CalendarOutlined className='mr-1' />
          {new Date(pet.created_at).toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item label='Last Updated'>
          <CalendarOutlined className='mr-1' />
          {new Date(pet.updated_at).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
