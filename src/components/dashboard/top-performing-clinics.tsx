import { Card, List, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardStats } from '@/types';
import { DollarOutlined, HomeOutlined, StarFilled } from '@ant-design/icons';

const { Text } = Typography;

interface TopPerformingClinicsProps {
  stats: DashboardStats;
}

const TopPerformingClinics = ({ stats }: TopPerformingClinicsProps) => {
  const { t } = useTranslation('components');

  if (stats.topPerformingClinics.length === 0) {
    return null;
  }

  const renderClinicItem = (clinic: any, index: number) => {
    const colors = [
      '#667eea',
      '#ec4899',
      '#06b6d4',
    ];
    
    const color = colors[index % colors.length];
    
    return (
      <List.Item className='!border-0 !px-0'>
        <div className='w-full p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-slate-200'>
          <div className='flex items-start gap-4'>
            {/* Rank Badge */}
            <div
              className='w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md text-white'
              style={{ backgroundColor: color }}
            >
              <div className='flex flex-col items-center'>
                <HomeOutlined className='text-xl' />
                <span className='text-xs font-bold mt-0.5'>#{index + 1}</span>
              </div>
            </div>
            
            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between gap-3 mb-3'>
                <h4 className='font-semibold text-slate-800 text-lg m-0 leading-tight'>
                  {clinic.name}
                </h4>
              </div>
              
              <div className='flex flex-wrap gap-4'>
                {/* Rating */}
                <div className='flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100'>
                  <StarFilled className='text-amber-500 text-sm' />
                  <Text className='text-sm font-semibold text-amber-700'>
                    {clinic.rating.toFixed(1)}
                  </Text>
                </div>
                
                {/* Revenue */}
                <div className='flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100'>
                  <DollarOutlined className='text-emerald-600 text-sm' />
                  <Text className='text-sm font-semibold text-emerald-700'>
                    ${clinic.revenue.toLocaleString()}
                  </Text>
                </div>
                
                {/* Appointments */}
                <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100'>
                  <Text className='text-sm font-semibold text-blue-700'>
                    {clinic.totalAppointments} {t('dashboard.topClinics.appointments')}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </List.Item>
    );
  };

  return (
    <Card
      title={
        <div className='flex items-center gap-3'>
          <span className='text-lg font-semibold text-slate-800'>
            {t('dashboard.topClinics.title')}
          </span>
          <Tag 
            className='!border-0 !px-3 !py-1 !rounded-full font-medium'
            style={{
              backgroundColor: '#ec4899',
              color: 'white',
            }}
          >
            {t('dashboard.topClinics.soon')}
          </Tag>
        </div>
      }
      className='border-0 shadow-lg hover:shadow-xl transition-shadow duration-300'
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <List
        itemLayout='horizontal'
        dataSource={stats.topPerformingClinics}
        rowKey='id'
        renderItem={renderClinicItem}
        className='space-y-3'
      />
    </Card>
  );
};

export { TopPerformingClinics };
export default TopPerformingClinics;
