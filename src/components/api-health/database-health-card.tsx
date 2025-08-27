import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Statistic, Tag, Tooltip } from 'antd';

import { HealthCheck } from '@/types/api-health';
import React from 'react';

interface DatabaseHealthCardProps {
  databaseHealth: HealthCheck;
  isLoading: boolean;
  title?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircleOutlined className='text-green-500' />;
    case 'degraded':
      return <ExclamationCircleOutlined className='text-yellow-500' />;
    case 'unhealthy':
      return <CloseCircleOutlined className='text-red-500' />;
    default:
      return <ExclamationCircleOutlined className='text-gray-500' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'success';
    case 'degraded':
      return 'warning';
    case 'unhealthy':
      return 'error';
    default:
      return 'default';
  }
};

export const DatabaseHealthCard: React.FC<DatabaseHealthCardProps> = ({
  databaseHealth,
  isLoading,
  title = 'Database Health',
}) => {
  const isHealthy = databaseHealth?.status === 'healthy';
  const responseTime = databaseHealth?.responseTime || 0;
  const lastChecked = databaseHealth?.lastChecked ? new Date(databaseHealth.lastChecked) : null;

  // Calculate response time percentage (assuming 1000ms is 100%)
  const responseTimePercentage = Math.min((responseTime / 1000) * 100, 100);
  const responseTimeColor =
    responseTime < 200 ? 'success' : responseTime < 500 ? 'warning' : 'error';

  return (
    <Card
      title={
        <Space>
          <DatabaseOutlined className='text-blue-500' />
          <span>{title}</span>
          {databaseHealth?.status && (
            <Tag color={getStatusColor(databaseHealth.status)}>
              {databaseHealth.status.toUpperCase()}
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
            title='Status'
            value={databaseHealth?.status || 'Unknown'}
            valueStyle={{
              color: isHealthy
                ? '#52c41a'
                : databaseHealth?.status === 'degraded'
                  ? '#faad14'
                  : databaseHealth?.status === 'unhealthy'
                    ? '#ff4d4f'
                    : '#8c8c8c',
            }}
            prefix={databaseHealth?.status ? getStatusIcon(databaseHealth.status) : null}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title='Response Time'
            value={responseTime}
            suffix='ms'
            valueStyle={{
              color: responseTime < 200 ? '#52c41a' : responseTime < 500 ? '#faad14' : '#ff4d4f',
            }}
          />
          <Progress
            percent={responseTimePercentage}
            strokeColor={
              responseTimeColor === 'success'
                ? '#52c41a'
                : responseTimeColor === 'warning'
                  ? '#faad14'
                  : '#ff4d4f'
            }
            showInfo={false}
            size='small'
            className='mt-2'
          />
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Statistic
            title='Last Check'
            value={lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
            suffix={
              lastChecked && (
                <div className='text-sm text-gray-500'>{lastChecked.toLocaleDateString()}</div>
              )
            }
          />
        </Col>
      </Row>

      {databaseHealth?.details && (
        <div className='mt-4'>
          <h4 className='text-sm font-medium text-gray-700 mb-2'>Additional Details</h4>
          <div className='bg-gray-50 p-3 rounded-lg'>
            <pre className='text-xs text-gray-600 whitespace-pre-wrap'>
              {JSON.stringify(databaseHealth.details, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {databaseHealth?.error && (
        <div className='mt-4'>
          <h4 className='text-sm font-medium text-red-700 mb-2'>Error Details</h4>
          <div className='bg-red-50 p-3 rounded-lg border border-red-200'>
            <p className='text-sm text-red-600'>{databaseHealth.error}</p>
          </div>
        </div>
      )}

      {lastChecked && (
        <div className='mt-4 text-center text-sm text-gray-500'>
          <Tooltip title={lastChecked.toLocaleString()}>
            <span>
              Last updated: {`${Math.floor((Date.now() - lastChecked.getTime()) / 1000)}s ago`}
            </span>
          </Tooltip>
        </div>
      )}
    </Card>
  );
};
