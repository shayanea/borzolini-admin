import React from 'react';
import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { AppointmentsHeaderProps } from '@/types/appointments';

const { Title, Text } = Typography;

const AppointmentsHeader: React.FC<AppointmentsHeaderProps> = ({
  onNewAppointment,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Title level={2} className="!mb-2">
          Appointments
        </Title>
        <Text className="text-text-light">
          Manage clinic appointments and schedules
        </Text>
      </div>
      
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        className="bg-primary-navy border-primary-navy"
        onClick={onNewAppointment}
      >
        New Appointment
      </Button>
    </div>
  );
};

export default AppointmentsHeader;
