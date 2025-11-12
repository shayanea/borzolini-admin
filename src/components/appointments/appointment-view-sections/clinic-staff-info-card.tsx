/**
 * Clinic & Staff Information Card for Appointment View Modal
 */

import { Card, Descriptions } from 'antd';
import type { Appointment } from '@/types';
import { FC } from 'react';

interface ClinicStaffInfoCardProps {
  appointment: Appointment;
}

export const ClinicStaffInfoCard: FC<ClinicStaffInfoCardProps> = ({ appointment }) => {
  return (
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
  );
};

