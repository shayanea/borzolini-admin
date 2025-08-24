import React from 'react';
import { Card, List, Avatar, Typography } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { DashboardStats } from '@/types';

const { Text } = Typography;

interface RecentActivityProps {
  stats: DashboardStats;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ stats }) => {
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
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.description}</span>
              <span className="text-xs text-text-light">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
          }
          description={
            <div className="space-y-1">
              {item.userName && (
                <div className="text-sm text-primary-navy font-medium">
                  {item.userName}
                </div>
              )}
              {item.clinicName && (
                <div className="text-sm text-text-light">
                  Clinic: {item.clinicName}
                </div>
              )}
            </div>
          }
        />
      </List.Item>
    );
  }

  return (
    <Card
      title="Recent Activity"
      className="admin-card"
      extra={
        <Text 
          className="text-primary-navy cursor-pointer hover:underline"
          onClick={handleViewAll}
        >
          View All
        </Text>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={stats.recentActivity}
        rowKey="id"
        renderItem={renderActivityItem}
      />
    </Card>
  );
};

export default RecentActivity;
