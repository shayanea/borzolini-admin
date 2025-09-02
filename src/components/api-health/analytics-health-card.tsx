import {
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Tag, Tooltip } from 'antd';

import React from 'react';

interface AnalyticsHealthCardProps {
  analyticsHealth: any;
  analyticsStatus: any;
  isLoading: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ok':
    case 'healthy':
      return <CheckCircleOutlined className='text-green-500' />;
    case 'degraded':
      return <ExclamationCircleOutlined className='text-yellow-500' />;
    case 'error':
    case 'unhealthy':
      return <CloseCircleOutlined className='text-red-500' />;
    default:
      return <ExclamationCircleOutlined className='text-gray-500' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ok':
    case 'healthy':
      return 'success';
    case 'degraded':
      return 'warning';
    case 'error':
    case 'unhealthy':
      return 'error';
    default:
      return 'default';
  }
};

const renderConfigurationDetails = (analyticsStatus: any) => (
  <div className='mt-4'>
    <h4 className='text-sm font-medium text-gray-700 mb-2'>Configuration Details</h4>
    <div className='bg-gray-50 p-3 rounded-lg'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
        <div>
          <span className='font-medium text-gray-600'>Website ID:</span>
          <span className='ml-2 font-mono text-xs'>
            {analyticsStatus.websiteId || 'Not configured'}
          </span>
        </div>
        <div>
          <span className='font-medium text-gray-600'>API URL:</span>
          <span className='ml-2 font-mono text-xs'>
            {analyticsStatus.apiUrl ? 'Configured' : 'Not configured'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const renderErrorDetails = (error: string) => (
  <div className='mt-4'>
    <h4 className='text-sm font-medium text-red-700 mb-2'>Error Details</h4>
    <div className='bg-red-50 p-3 rounded-lg border border-red-200'>
      <p className='text-sm text-red-600'>{error}</p>
    </div>
  </div>
);

const renderLastUpdated = (timestamp: string) => (
  <div className='mt-4 text-center text-sm text-gray-500'>
    <Tooltip title={new Date(timestamp).toLocaleString()}>
      <span>
        Last updated: {`${Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)}s ago`}
      </span>
    </Tooltip>
  </div>
);

export const AnalyticsHealthCard: React.FC<AnalyticsHealthCardProps> = ({
  analyticsHealth,
  analyticsStatus,
  isLoading,
}) => {
  const isHealthy = analyticsHealth?.status === 'ok' || analyticsHealth?.status === 'healthy';
  const isEnabled = analyticsStatus?.enabled || analyticsHealth?.analytics;
  const isConfigured = analyticsStatus?.configured;

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined className='text-purple-500' />
          <span>Analytics Service</span>
          {analyticsHealth?.status && (
            <Tag color={getStatusColor(analyticsHealth.status)}>
              {analyticsHealth.status.toUpperCase()}
            </Tag>
          )}
        </Space>
      }
      className='admin-card'
      loading={isLoading}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title='Service Status'
            value={analyticsHealth?.status || 'Unknown'}
            valueStyle={{
              color: isHealthy
                ? '#52c41a'
                : analyticsHealth?.status === 'degraded'
                  ? '#faad14'
                  : analyticsHealth?.status === 'error'
                    ? '#ff4d4f'
                    : '#8c8c8c',
            }}
            prefix={analyticsHealth?.status ? getStatusIcon(analyticsHealth.status) : null}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title='Analytics Enabled'
            value={isEnabled ? 'Yes' : 'No'}
            valueStyle={{
              color: isEnabled ? '#52c41a' : '#ff4d4f',
            }}
            prefix={isEnabled ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          />
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Statistic
            title='Configuration'
            value={isConfigured ? 'Complete' : 'Incomplete'}
            valueStyle={{
              color: isConfigured ? '#52c41a' : '#faad14',
            }}
            prefix={isConfigured ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          />
        </Col>
      </Row>

      {analyticsStatus && renderConfigurationDetails(analyticsStatus)}
      {analyticsHealth?.error && renderErrorDetails(analyticsHealth.error)}
      {analyticsHealth?.timestamp && renderLastUpdated(analyticsHealth.timestamp)}
    </Card>
  );
};
