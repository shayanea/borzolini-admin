import { Typography } from 'antd';

const { Title, Text } = Typography;

const AppointmentsHeader = () => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={2} className='!mb-2'>
          Appointments
        </Title>
        <Text className='text-text-light'>Manage clinic appointments and schedules</Text>
      </div>
    </div>
  );
};

export default AppointmentsHeader;
