/**
 * Medical Information Card for Appointment View Modal
 */

import { Card } from 'antd';
import type { Appointment } from '@/types';
import { FC } from 'react';

interface MedicalInfoCardProps {
  appointment: Appointment;
  isEditing: boolean;
  editedData: Partial<Appointment>;
  onFieldChange: (field: string, value: any) => void;
}

export const MedicalInfoCard: FC<MedicalInfoCardProps> = ({
  appointment,
  isEditing,
  editedData,
  onFieldChange,
}) => {
  return (
    <Card title='Medical Information' size='small'>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Reason for Visit
          </label>
          {isEditing ? (
            <textarea
              value={editedData.reason || ''}
              onChange={e => onFieldChange('reason', e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
              rows={2}
              placeholder='Reason for visit'
            />
          ) : (
            <p className='text-gray-900 bg-gray-50 p-2 rounded'>
              {appointment.reason || 'Not specified'}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Symptoms</label>
          {isEditing ? (
            <textarea
              value={editedData.symptoms || ''}
              onChange={e => onFieldChange('symptoms', e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
              rows={2}
              placeholder='Symptoms observed'
            />
          ) : (
            <p className='text-gray-900 bg-gray-50 p-2 rounded'>
              {appointment.symptoms || 'Not specified'}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Diagnosis</label>
          {isEditing ? (
            <textarea
              value={editedData.diagnosis || ''}
              onChange={e => onFieldChange('diagnosis', e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
              rows={2}
              placeholder='Diagnosis'
            />
          ) : (
            <p className='text-gray-900 bg-gray-50 p-2 rounded'>
              {appointment.diagnosis || 'Not specified'}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Treatment Plan</label>
          {isEditing ? (
            <textarea
              value={editedData.treatment_plan || ''}
              onChange={e => onFieldChange('treatment_plan', e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
              rows={3}
              placeholder='Treatment plan'
            />
          ) : (
            <p className='text-gray-900 bg-gray-50 p-2 rounded'>
              {appointment.treatment_plan || 'Not specified'}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Follow-up Instructions
          </label>
          {isEditing ? (
            <textarea
              value={editedData.follow_up_instructions || ''}
              onChange={e => onFieldChange('follow_up_instructions', e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
              rows={2}
              placeholder='Follow-up instructions'
            />
          ) : (
            <p className='text-gray-900 bg-gray-50 p-2 rounded'>
              {appointment.follow_up_instructions || 'Not specified'}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label>
          {isEditing ? (
            <textarea
              value={editedData.notes || ''}
              onChange={e => onFieldChange('notes', e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
              rows={3}
              placeholder='Additional notes'
            />
          ) : (
            <p className='text-gray-900 bg-gray-50 p-2 rounded'>
              {appointment.notes || 'No notes'}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

