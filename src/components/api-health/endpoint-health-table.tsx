import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Table, Tag, Tooltip } from 'antd';

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
      render: (_: any, record: EndpointStatus) => (
        <Tag color={getStatusColor(record.status)} icon={getStatusIcon(record.status)}>
          {record.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Endpoint',
      key: 'url',
      render: (_: any, record: EndpointStatus) => (
        <Tooltip title={record.url}>
          <span className='font-mono text-sm'>{record.url}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Method',
      key: 'method',
      width: 80,
      render: (_: any, record: EndpointStatus) => (
        <Tag color='blue' className='font-mono'>
          {record.method}
        </Tag>
      ),
    },
    {
      title: 'Response Time',
      key: 'responseTime',
      width: 120,
      render: (_: any, record: EndpointStatus) => (
        <span
          className={`font-mono ${
            getResponseTimeColor(record.responseTime) === 'success'
              ? 'text-green-600'
              : getResponseTimeColor(record.responseTime) === 'warning'
                ? 'text-yellow-600'
                : 'text-red-600'
          }`}
        >
          {record.responseTime}ms
        </span>
      ),
      sorter: (a: EndpointStatus, b: EndpointStatus) => a.responseTime - b.responseTime,
    },
    {
      title: 'Status Code',
      key: 'statusCode',
      width: 100,
      render: (_: any, record: EndpointStatus) =>
        record.statusCode ? (
          <Tag
            color={
              record.statusCode >= 200 && record.statusCode < 300
                ? 'success'
                : record.statusCode >= 400 && record.statusCode < 500
                  ? 'warning'
                  : 'error'
            }
          >
            {record.statusCode}
          </Tag>
        ) : (
          <span className='text-gray-400'>-</span>
        ),
    },
    {
      title: 'Last Check',
      key: 'lastChecked',
      width: 150,
      render: (_: any, record: EndpointStatus) => {
        const date = new Date(record.lastChecked);
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
      render: (_: any, record: EndpointStatus) =>
        record.error ? (
          <Tooltip title={record.error}>
            <span className='text-red-600 text-sm truncate max-w-32 block'>{record.error}</span>
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
