/**
 * Pet, Owner, and Veterinarian Info Cards for Pet Case View Modal
 */

import { EmptyStateVariants } from '@/components/common';
import type { ClinicPetCase } from '@/types/pet-cases';
import { HeartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Descriptions } from 'antd';
import { FC } from 'react';

interface PetInfoCardProps {
  caseData: ClinicPetCase;
}

export const PetInfoCard: FC<PetInfoCardProps> = ({ caseData }) => {
  return (
    <Card title='Pet Information' size='small'>
      <div className='flex items-center space-x-4 mb-4'>
        <Avatar src={caseData.pet?.photo_url} icon={<HeartOutlined />} size={64} />
        <div>
          <h3 className='text-lg font-medium'>{caseData.pet?.name || 'Unknown Pet'}</h3>
          <p className='text-gray-600'>
            {caseData.pet?.species} {caseData.pet?.breed ? `• ${caseData.pet?.breed}` : ''}
          </p>
          {caseData.pet?.age && (
            <p className='text-sm text-gray-500'>Age: {caseData.pet.age} years old</p>
          )}
          {caseData.pet?.gender && (
            <p className='text-sm text-gray-500'>Gender: {caseData.pet.gender}</p>
          )}
        </div>
      </div>

      <Descriptions size='small' column={2}>
        <Descriptions.Item label='Weight'>
          {caseData.pet?.weight ? `${caseData.pet.weight} lbs` : 'Not specified'}
        </Descriptions.Item>
        <Descriptions.Item label='Size'>
          {caseData.pet?.size ? caseData.pet.size.toUpperCase() : 'Not specified'}
        </Descriptions.Item>
        <Descriptions.Item label='Color'>
          {caseData.pet?.color || 'Not specified'}
        </Descriptions.Item>
        <Descriptions.Item label='Microchip'>
          {caseData.pet?.microchip_number || 'Not specified'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export const OwnerInfoCard: FC<PetInfoCardProps> = ({ caseData }) => {
  return (
    <Card title='Owner Information' size='small'>
      <div className='flex items-center space-x-4 mb-4'>
        <Avatar icon={<UserOutlined />} size={48} />
        <div>
          <h3 className='text-lg font-medium'>
            {caseData.owner?.firstName} {caseData.owner?.lastName}
          </h3>
          <p className='text-gray-600'>{caseData.owner?.email}</p>
          {caseData.owner?.phone && <p className='text-sm text-gray-500'>{caseData.owner.phone}</p>}
        </div>
      </div>
    </Card>
  );
};

export const VeterinarianInfoCard: FC<PetInfoCardProps> = ({ caseData }) => {
  return (
    <Card title='Veterinarian' size='small'>
      {caseData.veterinarian ? (
        <div className='flex items-center space-x-4'>
          <Avatar icon={<UserOutlined />} size={48} />
          <div>
            <h3 className='text-lg font-medium'>
              Dr. {caseData.veterinarian.firstName} {caseData.veterinarian.lastName}
            </h3>
          </div>
        </div>
      ) : (
        <EmptyStateVariants.NoData size='small' description='No veterinarian assigned' />
      )}
    </Card>
  );
};
