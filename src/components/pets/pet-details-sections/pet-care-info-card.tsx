/**
 * Pet Care Information Card
 */

import type { Pet } from '@/types';
import { Card, Descriptions, Tag } from 'antd';
import { FC } from 'react';

interface PetCareInfoCardProps {
  pet: Pet;
}

export const PetCareInfoCard: FC<PetCareInfoCardProps> = ({ pet }) => {
  return (
    <Card title='Care Information' size='small'>
      <Descriptions column={2} size='small'>
        {pet.dietary_requirements && (
          <Descriptions.Item label='Dietary Requirements' span={2}>
            {pet.dietary_requirements}
          </Descriptions.Item>
        )}

        {pet.allergies && pet.allergies.length > 0 && (
          <Descriptions.Item label='Allergies'>
            <div className='flex flex-wrap gap-1'>
              {pet.allergies.map((allergy, index) => (
                <Tag key={index} color='red'>
                  {allergy}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
        )}

        {pet.medications && pet.medications.length > 0 && (
          <Descriptions.Item label='Medications'>
            <div className='flex flex-wrap gap-1'>
              {pet.medications.map((medication, index) => (
                <Tag key={index} color='blue'>
                  {medication}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};
