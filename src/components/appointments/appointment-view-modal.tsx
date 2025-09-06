import { Button, Card, Descriptions, Modal, Select, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';

import type { Appointment } from '@/types';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

export interface AppointmentViewModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onCancel: () => void;
  onUpdate?: (id: string, updates: Partial<Appointment>) => Promise<void>;
  loading?: boolean;
}

export const AppointmentViewModal: React.FC<AppointmentViewModalProps> = ({
  visible,
  appointment,
  onCancel,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Appointment>>({});
  const [saving, setSaving] = useState(false);

  // Initialize edited data when appointment changes
  useEffect(() => {
    if (appointment) {
      setEditedData({
        status: appointment.status,
        priority: appointment.priority,
        notes: appointment.notes,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        diagnosis: appointment.diagnosis,
        treatment_plan: appointment.treatment_plan,
        follow_up_instructions: appointment.follow_up_instructions,
      });
    }
  }, [appointment]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!appointment || !onUpdate) return;

    try {
      setSaving(true);
      await onUpdate(appointment.id, editedData);
      setIsEditing(false);
      message.success('Appointment updated successfully');
    } catch (error) {
      message.error('Failed to update appointment');
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edited data to original values
    if (appointment) {
      setEditedData({
        status: appointment.status,
        priority: appointment.priority,
        notes: appointment.notes,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        diagnosis: appointment.diagnosis,
        treatment_plan: appointment.treatment_plan,
        follow_up_instructions: appointment.follow_up_instructions,
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'orange',
      confirmed: 'green',
      in_progress: 'blue',
      completed: 'purple',
      cancelled: 'red',
      no_show: 'red',
      rescheduled: 'yellow',
      waiting: 'cyan',
    };
    return statusColors[status] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: Record<string, string> = {
      low: 'green',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
      emergency: 'red',
    };
    return priorityColors[priority] || 'default';
  };

  const formatAppointmentType = (type: string) => {
    if (!type) return 'Unknown';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!appointment) return null;

  return (
    <Modal
      title='Appointment Details'
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      destroyOnHidden
    >
      <div className='space-y-6'>
        {/* Pet & Owner Information */}
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
              <p className='text-sm text-gray-500'>Owner ID: {appointment.owner_id}</p>
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

        {/* Appointment Information */}
        <Card title='Appointment Information' size='small'>
          <Descriptions column={2} size='small'>
            <Descriptions.Item label='Service'>
              {appointment.service?.name || formatAppointmentType(appointment.appointment_type)}
            </Descriptions.Item>
            <Descriptions.Item label='Duration'>
              {appointment.duration_minutes} minutes
            </Descriptions.Item>
            <Descriptions.Item label='Scheduled Date'>
              {dayjs(appointment.scheduled_date).format('MMMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label='Scheduled Time'>
              {dayjs(appointment.scheduled_date).format('h:mm A')}
            </Descriptions.Item>
            <Descriptions.Item label='Status'>
              {isEditing ? (
                <Select
                  value={editedData.status}
                  onChange={value => setEditedData(prev => ({ ...prev, status: value }))}
                  style={{ width: 120 }}
                >
                  <Option value='pending'>Pending</Option>
                  <Option value='confirmed'>Confirmed</Option>
                  <Option value='in_progress'>In Progress</Option>
                  <Option value='completed'>Completed</Option>
                  <Option value='cancelled'>Cancelled</Option>
                  <Option value='no_show'>No Show</Option>
                  <Option value='rescheduled'>Rescheduled</Option>
                  <Option value='waiting'>Waiting</Option>
                </Select>
              ) : (
                <Tag color={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Priority'>
              {isEditing ? (
                <Select
                  value={editedData.priority}
                  onChange={value => setEditedData(prev => ({ ...prev, priority: value }))}
                  style={{ width: 120 }}
                >
                  <Option value='low'>Low</Option>
                  <Option value='normal'>Normal</Option>
                  <Option value='high'>High</Option>
                  <Option value='urgent'>Urgent</Option>
                  <Option value='emergency'>Emergency</Option>
                </Select>
              ) : (
                <Tag color={getPriorityColor(appointment.priority)}>
                  {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)}
                </Tag>
              )}
            </Descriptions.Item>
            {appointment.service?.price && (
              <Descriptions.Item label='Service Price'>
                ${appointment.service.price} {appointment.service.currency}
              </Descriptions.Item>
            )}
            <Descriptions.Item label='Payment Status'>
              <Tag color={appointment.payment_status === 'paid' ? 'green' : 'orange'}>
                {appointment.payment_status
                  ? appointment.payment_status.charAt(0).toUpperCase() +
                    appointment.payment_status.slice(1)
                  : 'Unknown'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Clinic & Staff Information */}
        <Card title='Clinic & Staff Information' size='small'>
          <Descriptions column={2} size='small'>
            <Descriptions.Item label='Clinic'>
              {appointment.clinic?.name || 'Unknown Clinic'}
            </Descriptions.Item>
            <Descriptions.Item label='Location'>
              {appointment.clinic?.city && appointment.clinic?.state
                ? `${appointment.clinic.city}, ${appointment.clinic.state}`
                : 'Not specified'}
            </Descriptions.Item>
            <Descriptions.Item label='Staff'>
              {appointment.staff?.specialization || appointment.staff?.role || 'Unassigned'}
            </Descriptions.Item>
            <Descriptions.Item label='License Number'>
              {appointment.staff?.license_number || 'Not available'}
            </Descriptions.Item>
            <Descriptions.Item label='Experience'>
              {appointment.staff?.experience_years || 'Unknown'} years
            </Descriptions.Item>
            <Descriptions.Item label='Phone'>
              {appointment.clinic?.phone || 'Not available'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Medical Information */}
        <Card title='Medical Information' size='small'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Reason for Visit
              </label>
              {isEditing ? (
                <textarea
                  value={editedData.reason || ''}
                  onChange={e => setEditedData(prev => ({ ...prev, reason: e.target.value }))}
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
                  onChange={e => setEditedData(prev => ({ ...prev, symptoms: e.target.value }))}
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
                  onChange={e => setEditedData(prev => ({ ...prev, diagnosis: e.target.value }))}
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
                  onChange={e =>
                    setEditedData(prev => ({ ...prev, treatment_plan: e.target.value }))
                  }
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
                  onChange={e =>
                    setEditedData(prev => ({ ...prev, follow_up_instructions: e.target.value }))
                  }
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
                  onChange={e => setEditedData(prev => ({ ...prev, notes: e.target.value }))}
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

        {/* Action Buttons */}
        <div className='flex justify-end space-x-2 pt-4 border-t'>
          {!isEditing ? (
            <>
              <Button onClick={onCancel}>Close</Button>
              {onUpdate && (
                <Button type='primary' onClick={handleEdit}>
                  Edit Critical Fields
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type='primary'
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
                className='bg-primary-navy border-primary-navy'
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentViewModal;
