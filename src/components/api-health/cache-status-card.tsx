import { Card, Col, Progress, Row, Space, Statistic, Tag } from 'antd';
import {
  ClockCircleOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
  HddOutlined,
} from '@ant-design/icons';

import React from 'react';
import { environment } from '@/config/environment';

interface CacheStatusCardProps {
  cacheStatus: Record<string, any>;
  isLoading: boolean;
}

const formatTTL = (ttl: number) => {
  if (ttl < 1000) return `${ttl}ms`;
  if (ttl < 60000) return `${Math.floor(ttl / 1000)}s`;
  if (ttl < 3600000) return `${Math.floor(ttl / 60000)}m`;
  return `${Math.floor(ttl / 3600000)}h`;
};

const getCacheHealthColor = (size: number, maxSize: number) => {
  const percentage = (size / maxSize) * 100;
  if (percentage < 50) return 'success';
  if (percentage < 80) return 'warning';
  return 'error';
};

export const CacheStatusCard: React.FC<CacheStatusCardProps> = ({ cacheStatus, isLoading }) => {
  const cacheTypes = [
    {
      key: 'appointments',
      label: 'Appointments',
      icon: <ClockCircleOutlined className='text-blue-500' />,
      maxSize: environment.cache.appointments.maxSize,
      ttl: environment.cache.appointments.ttl,
    },
    {
      key: 'users',
      label: 'Users',
      icon: <HddOutlined className='text-green-500' />,
      maxSize: environment.cache.users.maxSize,
      ttl: environment.cache.users.ttl,
    },
    {
      key: 'calendar',
      label: 'Calendar',
      icon: <DatabaseOutlined className='text-purple-500' />,
      maxSize: environment.cache.calendar.maxSize,
      ttl: environment.cache.calendar.ttl,
    },
  ];

  if (cacheStatus.error) {
    return (
      <Card
        title={
          <Space>
            <DatabaseOutlined className='text-red-500' />
            <span>Cache Status</span>
            <Tag color='error'>Error</Tag>
          </Space>
        }
        className='admin-card'
        loading={isLoading}
      >
        <div className='text-center py-8'>
          <ExclamationCircleOutlined className='text-4xl text-red-500 mb-4' />
          <p className='text-red-600'>{cacheStatus.error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <DatabaseOutlined className='text-blue-500' />
          <span>Cache Status</span>
        </Space>
      }
      className='admin-card'
      loading={isLoading}
    >
      <Row gutter={[16, 16]}>
        {cacheTypes.map(cacheType => {
          const cacheData = cacheStatus[cacheType.key] || {};
          const size = cacheData.size || 0;
          const maxSize = cacheType.maxSize;
          const ttl = cacheType.ttl;
          const healthColor = getCacheHealthColor(size, maxSize);
          const usagePercentage = (size / maxSize) * 100;

          return (
            <Col xs={24} sm={12} md={8} key={cacheType.key}>
              <div className='text-center p-4 border rounded-lg'>
                <div className='mb-3'>{cacheType.icon}</div>

                <h4 className='font-medium text-gray-900 mb-2'>{cacheType.label}</h4>

                <div className='space-y-3'>
                  <Statistic
                    title='Usage'
                    value={size}
                    suffix={`/ ${maxSize}`}
                    valueStyle={{
                      color:
                        healthColor === 'success'
                          ? '#52c41a'
                          : healthColor === 'warning'
                            ? '#faad14'
                            : '#ff4d4f',
                    }}
                  />

                  <Progress
                    percent={usagePercentage}
                    strokeColor={
                      healthColor === 'success'
                        ? '#52c41a'
                        : healthColor === 'warning'
                          ? '#faad14'
                          : '#ff4d4f'
                    }
                    showInfo={false}
                    size='small'
                  />

                  <div className='text-sm text-gray-600'>
                    <div className='flex items-center justify-center space-x-2'>
                      <ClockCircleOutlined className='text-gray-400' />
                      <span>TTL: {formatTTL(ttl)}</span>
                    </div>
                  </div>

                  <Tag color={healthColor} className='text-xs'>
                    {healthColor === 'success'
                      ? 'Healthy'
                      : healthColor === 'warning'
                        ? 'Moderate'
                        : 'High Usage'}
                  </Tag>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <h4 className='text-sm font-medium text-gray-700 mb-2'>Cache Configuration</h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
          <div>
            <span className='font-medium'>Offline Mode:</span>
            <Tag
              color={environment.features.enableOfflineMode ? 'success' : 'default'}
              className='ml-2'
            >
              {environment.features.enableOfflineMode ? 'Enabled' : 'Disabled'}
            </Tag>
          </div>
          <div>
            <span className='font-medium'>Caching:</span>
            <Tag
              color={environment.features.enableCaching ? 'success' : 'default'}
              className='ml-2'
            >
              {environment.features.enableCaching ? 'Enabled' : 'Disabled'}
            </Tag>
          </div>
          <div>
            <span className='font-medium'>API Timeout:</span>
            <span className='ml-2'>{environment.api.timeout}ms</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
