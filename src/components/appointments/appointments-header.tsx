import { Typography, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { CalendarOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AppointmentsHeader = () => {
  const { t } = useTranslation('pages');

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6'>
      <div className='flex items-center gap-4'>
        {/* Icon */}
        <div 
          className='w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-white'
          style={{ backgroundColor: '#ec4899' }}
        >
          <CalendarOutlined className='text-xl' />
        </div>
        
        {/* Content */}
        <div className='flex-1'>
          <Title level={2} className='mb-1 text-slate-800 !tracking-tight !font-bold'>
            {t('appointments.title')}
          </Title>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200'>
              <TeamOutlined className='text-blue-500 text-sm' />
              <Text className='text-xs font-medium text-blue-700'>
                {t('appointments.subtitle')}
              </Text>
            </div>
            
            {/* Stats badges - these would be dynamic if we had stats */}
            <div className='flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200'>
              <CalendarOutlined className='text-slate-500 text-sm' />
              <Text className='text-xs font-medium text-slate-600'>
                All Appointments
              </Text>
            </div>
          </div>
        </div>
        
        {/* Action buttons - these would be dynamic */}
        <div className='flex items-center gap-2'>
          <Button
            type='primary'
            icon={<CalendarOutlined />}
            className='h-10 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300'
            style={{
              backgroundColor: '#ec4899',
              border: 'none',
            }}
          >
            New Appointment
          </Button>
          
          <Button
            icon={<TeamOutlined className='text-slate-500' />}
            className='h-10 px-4 rounded-xl hover:bg-slate-50 transition-colors'
          >
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AppointmentsHeader };
export default AppointmentsHeader;
