import { ArrowRightOutlined, CalendarOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';

interface ActionConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
  onClick: () => void;
}

const QuickActions = () => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();

  const handleNewAppointment = () => {
    navigate(ROUTES.CALENDAR);
  };

  const handleAddPatient = () => {
    navigate(ROUTES.PETS);
  };

  const handleAddClinic = () => {
    navigate(ROUTES.CLINIC_CREATE);
  };

  const actions: ActionConfig[] = [
    {
      icon: <CalendarOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.newAppointment'),
      description: t('dashboard.quickActions.scheduleVisit'),
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      iconColor: '#667eea',
      onClick: handleNewAppointment,
    },
    {
      icon: <UserOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.addPatient'),
      description: t('dashboard.quickActions.registerPatient'),
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      iconColor: '#ec4899',
      onClick: handleAddPatient,
    },
    {
      icon: <HomeOutlined className='text-2xl' />,
      title: t('dashboard.quickActions.addClinic'),
      description: t('dashboard.quickActions.registerClinic'),
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      iconColor: '#06b6d4',
      onClick: handleAddClinic,
    },
  ];

  return (
    <Card 
      title={
        <span className='text-lg font-semibold text-slate-800'>
          {t('dashboard.quickActions.title')}
        </span>
      }
      className='border-0 shadow-lg hover:shadow-xl transition-shadow duration-300'
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <Space direction='vertical' className='w-full' size='middle'>
        {actions.map((action, index) => (
          <div
            key={index}
            className='group relative p-5 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden'
            onClick={action.onClick}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            {/* Decorative gradient overlay on hover */}
            <div 
              className='absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300'
              style={{ background: action.gradient }}
            />
            
            <div className='relative flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                {/* Icon */}
                <div
                  className='w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg text-white'
                  style={{ 
                    backgroundColor: action.iconColor,
                  }}
                >
                  {action.icon}
                </div>
                
                {/* Content */}
                <div className='flex-1'>
                  <div className='font-semibold text-slate-800 text-base mb-1 group-hover:text-slate-900 transition-colors'>
                    {action.title}
                  </div>
                  <div className='text-sm text-slate-500 group-hover:text-slate-600 transition-colors'>
                    {action.description}
                  </div>
                </div>
              </div>
              
              {/* Arrow indicator */}
              <div className='text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300'>
                <ArrowRightOutlined className='text-lg' />
              </div>
            </div>
          </div>
        ))}
      </Space>
    </Card>
  );
};

export { QuickActions };
export default QuickActions;
