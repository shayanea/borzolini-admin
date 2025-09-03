import { Avatar, Card, List, Tag } from 'antd';

import type { DashboardStats } from '@/types';
import { HomeOutlined } from '@ant-design/icons';

interface TopPerformingClinicsProps {
  stats: DashboardStats;
}

const TopPerformingClinics = ({ stats }: TopPerformingClinicsProps) => {
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
                  Rating: {clinic.rating.toFixed(1)} ⭐
                </span>
                <span className='text-sm text-text-light'>
                  Revenue: ${clinic.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          }
          description={
            <div className='text-sm text-text-light'>{clinic.totalAppointments} appointments</div>
          }
        />
      </List.Item>
    );
  };

  return (
    <Card
      title={
        <div className='flex items-center gap-2'>
          Top Performing Clinics
          <Tag color='orange'>Soon</Tag>
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
