/**
 * Appointment Information Card for Appointment View Modal
 */

import { Card, Descriptions, Select, Tag } from 'antd';
import type { Appointment } from '@/types';
import { APPOINTMENT_PRIORITIES, APPOINTMENT_STATUSES } from '@/constants/appointments';
import {
  getAppointmentPriorityColor,
  getAppointmentStatusColor,
} from '@/utils/color-helpers';
import dayjs from 'dayjs';
import { FC } from 'react';

const { Option } = Select;

interface AppointmentInfoCardProps {
  appointment: Appointment;
  isEditing: boolean;
  editedData: Partial<Appointment>;
  onFieldChange: (field: string, value: any) => void;
  getFormattedType: (type: string) => string;
}

export const AppointmentInfoCard: FC<AppointmentInfoCardProps> = ({
  appointment,
  isEditing,
  editedData,
  onFieldChange,
  getFormattedType,
}) => {
  return (
    <Card title='Appointment Information' size='small'>
      <Descriptions column={2} size='small'>
        <Descriptions.Item label='Service'>
          {appointment.service?.name || getFormattedType(appointment.appointment_type)}
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
              onChange={value => onFieldChange('status', value)}
              style={{ width: 120 }}
            >
              {Object.entries(APPOINTMENT_STATUSES).map(([_, value]) => (
                <Option key={value} value={value}>
                  {value
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Option>
              ))}
            </Select>
          ) : (
            <Tag color={getAppointmentStatusColor(appointment.status)}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Priority'>
          {isEditing ? (
            <Select
              value={editedData.priority}
              onChange={value => onFieldChange('priority', value)}
              style={{ width: 120 }}
            >
              {Object.entries(APPOINTMENT_PRIORITIES).map(([_, value]) => (
                <Option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Option>
              ))}
            </Select>
          ) : (
            <Tag color={getAppointmentPriorityColor(appointment.priority)}>
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
  );
};

