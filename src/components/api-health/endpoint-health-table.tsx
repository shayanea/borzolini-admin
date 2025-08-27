import { Button, Table, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { EndpointStatus } from '@/types/api-health';
import React from 'react';

interface EndpointHealthTableProps {
  endpointTests: EndpointStatus[];
  onRefresh: () => void;
  isLoading: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircleOutlined className='text-green-500' />;
    case 'timeout':
      return <ClockCircleOutlined className='text-yellow-500' />;
    case 'error':
      return <CloseCircleOutlined className='text-red-500' />;
    default:
      return <ExclamationCircleOutlined className='text-gray-500' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'timeout':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'default';
  }
};

const getResponseTimeColor = (responseTime: number) => {
  if (responseTime < 200) return 'success';
  if (responseTime < 500) return 'warning';
  return 'error';
};

export const EndpointHealthTable: React.FC<EndpointHealthTableProps> = ({
  endpointTests,
  onRefresh,
  isLoading,
}) => {
  const columns = [
    {
      title: 'Status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Endpoint',
      key: 'url',
      render: (url: string) => (
        <Tooltip title={url}>
          <span className='font-mono text-sm'>{url}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Method',
      key: 'method',
      width: 80,
      render: (method: string) => (
        <Tag color='blue' className='font-mono'>
          {method}
        </Tag>
      ),
    },
    {
      title: 'Response Time',
      key: 'responseTime',
      width: 120,
      render: (responseTime: number) => (
        <span
          className={`font-mono ${
            getResponseTimeColor(responseTime) === 'success'
              ? 'text-green-600'
              : getResponseTimeColor(responseTime) === 'warning'
                ? 'text-yellow-600'
                : 'text-red-600'
          }`}
        >
          {responseTime}ms
        </span>
      ),
      sorter: (a: EndpointStatus, b: EndpointStatus) => a.responseTime - b.responseTime,
    },
    {
      title: 'Status Code',
      key: 'statusCode',
      width: 100,
      render: (statusCode?: number) =>
        statusCode ? (
          <Tag
            color={
              statusCode >= 200 && statusCode < 300
                ? 'success'
                : statusCode >= 400 && statusCode < 500
                  ? 'warning'
                  : 'error'
            }
          >
            {statusCode}
          </Tag>
        ) : (
          <span className='text-gray-400'>-</span>
        ),
    },
    {
      title: 'Last Check',
      key: 'lastChecked',
      width: 150,
      render: (lastChecked: string) => {
        const date = new Date(lastChecked);
        return (
          <Tooltip title={date.toLocaleString()}>
            <span className='text-sm text-gray-600'>{date.toLocaleTimeString()}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Error',
      key: 'error',
      render: (error?: string) =>
        error ? (
          <Tooltip title={error}>
            <span className='text-red-600 text-sm truncate max-w-32 block'>{error}</span>
          </Tooltip>
        ) : (
          <span className='text-gray-400'>-</span>
        ),
    },
  ];

  const getRowClassName = (record: EndpointStatus) => {
    if (record.status === 'error') return 'bg-red-50';
    if (record.status === 'timeout') return 'bg-yellow-50';
    return '';
  };

  const healthyEndpoints = endpointTests.filter(test => test.status === 'success').length;
  const totalEndpoints = endpointTests.length;
  const healthPercentage = totalEndpoints > 0 ? (healthyEndpoints / totalEndpoints) * 100 : 0;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Endpoint Health</h3>
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-gray-600'>Health:</span>
            <span
              className={`font-medium ${
                healthPercentage >= 80
                  ? 'text-green-600'
                  : healthPercentage >= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {healthPercentage.toFixed(0)}%
            </span>
            <span className='text-sm text-gray-500'>
              ({healthyEndpoints}/{totalEndpoints} healthy)
            </span>
          </div>
        </div>

        <Button
          type='primary'
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={isLoading}
          className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={endpointTests}
        rowKey='url'
        pagination={false}
        size='small'
        loading={isLoading}
        rowClassName={getRowClassName}
        className='admin-table'
        scroll={{ x: 800 }}
      />
    </div>
  );
};
