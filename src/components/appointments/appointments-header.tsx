import { Button, Typography } from 'antd';

import type { AppointmentsHeaderProps } from '@/types/appointments';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AppointmentsHeader = ({ onNewAppointment }: AppointmentsHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={2} className='!mb-2'>
          Appointments
        </Title>
        <Text className='text-text-light'>Manage clinic appointments and schedules</Text>
      </div>

      <Button
        type='primary'
        icon={<PlusOutlined />}
        className='bg-primary-navy border-primary-navy'
        onClick={onNewAppointment}
      >
        New Appointment
      </Button>
    </div>
  );
};

export default AppointmentsHeader;
