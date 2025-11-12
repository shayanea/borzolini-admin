/**
 * Pet Basic Information Card
 */

import type { Pet } from '@/types';
import { getPetGenderColor, getPetSizeColor, getPetSpeciesColor } from '@/utils/color-helpers';
import { CalendarOutlined } from '@ant-design/icons';
import { Badge, Card, Descriptions, Tag } from 'antd';
import { FC } from 'react';

interface PetBasicInfoCardProps {
  pet: Pet;
}

export const PetBasicInfoCard: FC<PetBasicInfoCardProps> = ({ pet }) => {
  return (
    <Card title='Basic Information' size='small'>
      <Descriptions column={2} size='small'>
        <Descriptions.Item label='Name'>
          <span className='font-medium'>{pet.name}</span>
        </Descriptions.Item>

        <Descriptions.Item label='Species'>
          <Tag color={getPetSpeciesColor(pet.species)}>
            {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
          </Tag>
        </Descriptions.Item>

        {pet.breed && <Descriptions.Item label='Breed'>{pet.breed}</Descriptions.Item>}

        <Descriptions.Item label='Gender'>
          <Tag color={getPetGenderColor(pet.gender)}>
            {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label='Size'>
          <Tag color={getPetSizeColor(pet.size)}>
            {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label='Date of Birth'>
          <CalendarOutlined className='mr-1' />
          {new Date(pet.date_of_birth).toLocaleDateString()}
        </Descriptions.Item>

        {pet.weight && <Descriptions.Item label='Weight'>{pet.weight} kg</Descriptions.Item>}

        {pet.color && <Descriptions.Item label='Color'>{pet.color}</Descriptions.Item>}

        <Descriptions.Item label='Status'>
          <Badge
            status={pet.is_active ? 'success' : 'error'}
            text={pet.is_active ? 'Active' : 'Inactive'}
          />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
