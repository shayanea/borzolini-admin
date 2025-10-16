/**
 * Pet Emergency Contact Card
 */

import type { Pet } from '@/types';
import { PhoneOutlined } from '@ant-design/icons';
import { Card, Descriptions } from 'antd';
import { FC } from 'react';

interface PetEmergencyContactCardProps {
  pet: Pet;
}

export const PetEmergencyContactCard: FC<PetEmergencyContactCardProps> = ({ pet }) => {
  return (
    <Card title='Emergency Contact' size='small'>
      <Descriptions column={2} size='small'>
        <Descriptions.Item label='Contact Name'>{pet.emergency_contact}</Descriptions.Item>

        <Descriptions.Item label='Contact Phone'>
          <PhoneOutlined className='mr-1' />
          <a href={`tel:${pet.emergency_phone}`} className='text-blue-600'>
            {pet.emergency_phone}
          </a>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
