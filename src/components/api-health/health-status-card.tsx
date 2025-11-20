import { Card, Col, Row, Statistic, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { HealthStatus } from '@/types/api-health';

interface HealthStatusCardProps {
  overallStatus: HealthStatus;
  lastCheck: string;
  isLoading: boolean;
}

const getStatusConfig = (status: HealthStatus) => {
  switch (status) {
    case 'healthy':
      return {
        color: 'success',
        icon: <CheckCircleOutlined />,
        text: 'All Systems Operational',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    case 'degraded':
      return {
        color: 'warning',
        icon: <ExclamationCircleOutlined />,
        text: 'System Degraded',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    case 'unhealthy':
      return {
        color: 'error',
        icon: <CloseCircleOutlined />,
        text: 'System Issues Detected',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    default:
      return {
        color: 'default',
        icon: <ClockCircleOutlined />,
        text: 'Status Unknown',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
  }
};

export function HealthStatusCard({
  overallStatus,
  lastCheck,
  isLoading,
}: HealthStatusCardProps) {
  const statusConfig = getStatusConfig(overallStatus);
  const lastCheckDate = lastCheck ? new Date(lastCheck) : null;

  return (
    <Card
      className={`admin-card ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}
      loading={isLoading}
    >
      <Row gutter={[16, 16]} align='middle'>
        <Col xs={24} sm={12} md={8}>
          <div className='text-center'>
            <div className='text-4xl mb-2'>{statusConfig.icon}</div>
            <Tag color={statusConfig.color} className='text-lg px-4 py-2'>
              {statusConfig.text}
            </Tag>
          </div>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title='Overall Status'
            value={overallStatus}
            valueStyle={{
              color:
                statusConfig.color === 'success'
                  ? '#52c41a'
                  : statusConfig.color === 'warning'
                    ? '#faad14'
                    : statusConfig.color === 'error'
                      ? '#ff4d4f'
                      : '#8c8c8c',
            }}
            suffix={
              <Tag color={statusConfig.color} className='ml-2'>
                {overallStatus.toUpperCase()}
              </Tag>
            }
          />
        </Col>

        <Col xs={24} sm={24} md={8}>
          <div className='text-center'>
            <Statistic
              title='Last Check'
              value={lastCheckDate ? lastCheckDate.toLocaleTimeString() : 'Never'}
              suffix={
                lastCheckDate && (
                  <div className='text-sm text-gray-500'>{lastCheckDate.toLocaleDateString()}</div>
                )
              }
            />
          </div>
        </Col>
      </Row>

      {lastCheck && (
        <div className='mt-4 text-center text-sm text-gray-500'>
          <Tooltip title={new Date(lastCheck).toLocaleString()}>
            <span>
              Last updated:{' '}
              {`${Math.floor((Date.now() - new Date(lastCheck).getTime()) / 1000)}s ago`}
            </span>
          </Tooltip>
        </div>
      )}
    </Card>
  );
}
