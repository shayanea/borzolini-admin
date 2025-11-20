import {
  CalendarOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, List, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardStats } from '@/types';

const { Text } = Typography;

interface RecentActivityProps {
  stats: DashboardStats;
}

interface ActivityStyle {
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
}

const RecentActivity = ({ stats }: RecentActivityProps) => {
  const { t } = useTranslation('components');

  const getActivityStyle = (type: string): ActivityStyle => {
    switch (type) {
      case 'user_registration':
        return {
          icon: <UserOutlined />,
          gradient: '#667eea',
          textColor: '#667eea',
        };
      case 'clinic_registration':
        return {
          icon: <HomeOutlined />,
          gradient: '#06b6d4',
          textColor: '#06b6d4',
        };
      case 'appointment_created':
        return {
          icon: <CalendarOutlined />,
          gradient: '#ec4899',
          textColor: '#ec4899',
        };
      default:
        return {
          icon: <ClockCircleOutlined />,
          gradient: '#10b981',
          textColor: '#10b981',
        };
    }
  };

  function renderActivityItem(item: any) {
    const style = getActivityStyle(item.type);
    
    return (
      <List.Item className='!border-0'>
        <div className='w-full p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white hover:shadow-md transition-all duration-300 border border-slate-100'>
          <div className='flex items-start gap-4'>
            {/* Icon */}
            <div
              className='w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-white text-lg'
              style={{ backgroundColor: style.gradient }}
            >
              {style.icon}
            </div>
            
            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between gap-2 mb-2'>
                <span className='font-semibold text-slate-800 text-base leading-snug'>
                  {item.description}
                </span>
                <span className='text-xs text-slate-400 whitespace-nowrap flex-shrink-0 mt-1'>
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <div className='space-y-1'>
                {item.userName && (
                  <div 
                    className='text-sm font-medium'
                    style={{ color: style.textColor }}
                  >
                    {item.userName}
                  </div>
                )}
                {item.clinicName && (
                  <div className='text-sm text-slate-500'>
                    {t('dashboard.recentActivity.clinic')}: {item.clinicName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </List.Item>
    );
  }

  const hasActivity = stats.recentActivity && stats.recentActivity.length > 0;

  return (
    <Card 
      title={
        <span className='text-lg font-semibold text-slate-800'>
          {t('dashboard.recentActivity.title')}
        </span>
      }
      className='border-0 shadow-lg hover:shadow-xl transition-shadow duration-300'
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {hasActivity ? (
        <List
          itemLayout='horizontal'
          dataSource={stats.recentActivity}
          rowKey='id'
          renderItem={renderActivityItem}
          className='space-y-3'
        />
      ) : (
        <div className='py-16 text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 mb-4'>
            <FolderOutlined className='text-4xl text-slate-300' />
          </div>
          <div className='space-y-2'>
            <Text className='text-lg font-medium text-slate-600 block'>
              {t('dashboard.recentActivity.noData')}
            </Text>
            <Text className='text-sm text-slate-400 block'>
              {t('dashboard.recentActivity.noActivity')}
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export { RecentActivity };
export default RecentActivity;
