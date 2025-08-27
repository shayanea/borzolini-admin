import { Avatar, Card, Empty, List, Typography } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';

import type { DashboardStats } from '@/types';

const { Text } = Typography;

interface RecentActivityProps {
  stats: DashboardStats;
}

const RecentActivity = ({ stats }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UserOutlined />;
      case 'clinic_registration':
        return <HomeOutlined />;
      case 'appointment_created':
        return <CalendarOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registration':
        return '#1890ff';
      case 'clinic_registration':
        return '#52c41a';
      case 'appointment_created':
        return '#faad14';
      default:
        return '#10b981';
    }
  };

  const handleViewAll = () => {
    // TODO: Navigate to full activity page
  };

  function renderActivityItem(item: any) {
    return (
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar
              style={{
                backgroundColor: getActivityColor(item.type),
              }}
              icon={getActivityIcon(item.type)}
            />
          }
          title={
            <div className='flex items-center justify-between'>
              <span className='font-medium'>{item.description}</span>
              <span className='text-xs text-text-light'>
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
          }
          description={
            <div className='space-y-1'>
              {item.userName && (
                <div className='text-sm text-primary-navy font-medium'>{item.userName}</div>
              )}
              {item.clinicName && (
                <div className='text-sm text-text-light'>Clinic: {item.clinicName}</div>
              )}
            </div>
          }
        />
      </List.Item>
    );
  }

  const hasActivity = stats.recentActivity && stats.recentActivity.length > 0;

  return (
    <Card
      title='Recent Activity'
      className='admin-card border-0 shadow-sm'
      extra={
        <Text
          className='text-primary-navy cursor-pointer hover:underline font-medium'
          onClick={handleViewAll}
        >
          View All
        </Text>
      }
    >
      {hasActivity ? (
        <List
          itemLayout='horizontal'
          dataSource={stats.recentActivity}
          rowKey='id'
          renderItem={renderActivityItem}
        />
      ) : (
        <div className='py-12 text-center'>
          <Empty
            image={<FolderOutlined className='text-4xl text-gray-300' />}
            description={
              <div className='space-y-2'>
                <Text className='text-lg text-gray-500'>No data</Text>
                <Text className='text-sm text-gray-400 block'>No recent activity to display</Text>
              </div>
            }
          />
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
