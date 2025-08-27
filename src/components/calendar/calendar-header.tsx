import React from 'react';
import { Typography, Button, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { CalendarHeaderProps } from '@/types/calendar';

const { Title, Text } = Typography;

const CalendarHeader = ({ onFilters, onNewAppointment }: CalendarHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={2} className='!mb-2'>
          Calendar
        </Title>
        <Text className='text-text-light'>Manage appointments and schedules</Text>
      </div>

      <Space>
        <Button icon={<CalendarOutlined />} onClick={onFilters}>
          Filters
        </Button>
        <Button
          type='primary'
          className='bg-primary-navy border-primary-navy'
          onClick={onNewAppointment}
        >
          + New Appointment
        </Button>
      </Space>
    </div>
  );
};

export default CalendarHeader;
