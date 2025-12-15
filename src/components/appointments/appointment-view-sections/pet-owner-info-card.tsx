/**
 * Pet & Owner Information Card for Appointment View Modal
 */

import { Card, Descriptions, Tag } from 'antd';

import PatientFlags from '@/components/patients/patient-flags';
import type { Appointment } from '@/types';
import { FC } from 'react';

interface PetOwnerInfoCardProps {
  appointment: Appointment;
}

export const PetOwnerInfoCard: FC<PetOwnerInfoCardProps> = ({ appointment }) => {
  return (
    <Card title='Pet & Owner Information' size='small'>
      <div className='flex items-center space-x-4 mb-4'>
        <img
          src={appointment.pet?.photo_url || '/default-pet.png'}
          alt={appointment.pet?.name}
          className='w-16 h-16 rounded-full object-cover'
          onError={e => {
            (e.target as HTMLImageElement).src = '/default-pet.png';
          }}
        />
        <div>
          <h3 className='text-lg font-semibold'>{appointment.pet?.name || 'Unknown Pet'}</h3>
          <p className='text-gray-600'>
            {appointment.pet?.breed} {appointment.pet?.species}
          </p>
          <div className='mt-1'>
            <PatientFlags flags={appointment.pet?.flags} size='small' />
          </div>
        </div>
      </div>

      <Descriptions column={2} size='small'>
        <Descriptions.Item label='Species'>
          <Tag color='blue'>{appointment.pet?.species}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Gender'>
          <Tag color={appointment.pet?.gender === 'male' ? 'blue' : 'pink'}>
            {appointment.pet?.gender}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Weight'>{appointment.pet?.weight} kg</Descriptions.Item>
        <Descriptions.Item label='Age'>
          {appointment.pet?.date_of_birth
            ? Math.floor(
                (new Date().getTime() - new Date(appointment.pet.date_of_birth).getTime()) /
                  (365.25 * 24 * 60 * 60 * 1000)
              )
            : 'Unknown'}{' '}
          years
        </Descriptions.Item>
        <Descriptions.Item label='Vaccination Status'>
          <Tag color={appointment.pet?.is_vaccinated ? 'green' : 'red'}>
            {appointment.pet?.is_vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label='Spayed/Neutered'>
          <Tag color={appointment.pet?.is_spayed_neutered ? 'green' : 'orange'}>
            {appointment.pet?.is_spayed_neutered ? 'Yes' : 'No'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
