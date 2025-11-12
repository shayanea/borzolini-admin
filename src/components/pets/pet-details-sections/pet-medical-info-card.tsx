/**
 * Pet Medical Information Card
 */

import type { Pet } from '@/types';
import { Card, Descriptions, Tag } from 'antd';
import { FC } from 'react';

interface PetMedicalInfoCardProps {
  pet: Pet;
}

export const PetMedicalInfoCard: FC<PetMedicalInfoCardProps> = ({ pet }) => {
  return (
    <Card title='Medical Information' size='small'>
      <Descriptions column={2} size='small'>
        {pet.microchip_number && (
          <Descriptions.Item label='Microchip Number'>
            <code className='bg-gray-100 px-2 py-1 rounded'>{pet.microchip_number}</code>
          </Descriptions.Item>
        )}

        <Descriptions.Item label='Spayed/Neutered'>
          <Tag color={pet.is_spayed_neutered ? 'green' : 'orange'}>
            {pet.is_spayed_neutered ? 'Yes' : 'No'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label='Vaccinated'>
          <Tag color={pet.is_vaccinated ? 'green' : 'red'}>{pet.is_vaccinated ? 'Yes' : 'No'}</Tag>
        </Descriptions.Item>

        {pet.medical_history && (
          <Descriptions.Item label='Medical History' span={2}>
            {pet.medical_history}
          </Descriptions.Item>
        )}

        {pet.behavioral_notes && (
          <Descriptions.Item label='Behavioral Notes' span={2}>
            {pet.behavioral_notes}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};
