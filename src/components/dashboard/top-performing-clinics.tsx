import { Avatar, Card, List, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardStats } from '@/types';
import { HomeOutlined } from '@ant-design/icons';

interface TopPerformingClinicsProps {
  stats: DashboardStats;
}

const TopPerformingClinics = ({ stats }: TopPerformingClinicsProps) => {
  const { t } = useTranslation('components');

  if (stats.topPerformingClinics.length === 0) {
    return null;
  }

  const renderClinicItem = (clinic: any) => {
    return (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar style={{ backgroundColor: '#1890ff' }} icon={<HomeOutlined />} />}
          title={
            <div className='flex items-center justify-between'>
              <span className='font-medium'>{clinic.name}</span>
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-text-light'>
                  {t('dashboard.topClinics.rating')}: {clinic.rating.toFixed(1)} ⭐
                </span>
                <span className='text-sm text-text-light'>
                  {t('dashboard.topClinics.revenue')}: ${clinic.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          }
          description={
            <div className='text-sm text-text-light'>
              {clinic.totalAppointments} {t('dashboard.topClinics.appointments')}
            </div>
          }
        />
      </List.Item>
    );
  };

  return (
    <Card
      title={
        <div className='flex items-center gap-2'>
          {t('dashboard.topClinics.title')}
          <Tag color='orange'>{t('dashboard.topClinics.soon')}</Tag>
        </div>
      }
      className='admin-card'
    >
      <List
        itemLayout='horizontal'
        dataSource={stats.topPerformingClinics}
        rowKey='id'
        renderItem={renderClinicItem}
      />
    </Card>
  );
};

export default TopPerformingClinics;
