import { ExclamationCircleOutlined, MonitorOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Space, Spin, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { CacheStatusCard } from '@/components/api-health/cache-status-card';
import { DatabaseHealthCard } from '@/components/api-health/database-health-card';
import { EndpointHealthTable } from '@/components/api-health/endpoint-health-table';
import { HealthStatusCard } from '@/components/api-health/health-status-card';
import { useApiHealth } from '@/hooks/use-api-health';
import { apiHealthService } from '@/services/api-health.service';

const ApiHealthPage: React.FC = () => {
  const { overallStatus, lastCheck, checks, isLoading, error, endpointTests, refreshHealthStatus } =
    useApiHealth();

  const [cacheStatus, setCacheStatus] = useState<Record<string, any>>({});
  const [cacheLoading, setCacheLoading] = useState(false);

  const loadCacheStatus = async () => {
    setCacheLoading(true);
    try {
      const status = await apiHealthService.getCacheStatus();
      setCacheStatus(status);
    } catch (error) {
      setCacheStatus({ error: 'Failed to load cache status' });
    } finally {
      setCacheLoading(false);
    }
  };

  useEffect(() => {
    loadCacheStatus();
  }, []);

  const handleRefreshAll = async () => {
    try {
      await Promise.all([refreshHealthStatus(), loadCacheStatus()]);
      message.success('All health checks refreshed successfully');
    } catch (error) {
      message.error('Some health checks failed to refresh');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <MonitorOutlined className='text-green-500' />;
      case 'degraded':
        return <ExclamationCircleOutlined className='text-yellow-500' />;
      case 'unhealthy':
        return <ExclamationCircleOutlined className='text-red-500' />;
      default:
        return <MonitorOutlined className='text-gray-500' />;
    }
  };

  return (
    <div className='space-y-6'>
      <div className='admin-page-header mb-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Space>
              {getStatusIcon(overallStatus)}
              <Typography.Title level={2} className='!mb-0'>
                API Health Monitor
              </Typography.Title>
              <span className='text-sm text-gray-500'>Real-time system health monitoring</span>
            </Space>
          </div>

          <Button
            type='primary'
            icon={<ReloadOutlined />}
            onClick={handleRefreshAll}
            loading={isLoading}
            className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
          >
            Refresh All
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message='Health Check Error'
          description={error}
          type='error'
          showIcon
          closable
          className='mb-4'
        />
      )}

      {/* Overall Health Status */}
      <HealthStatusCard overallStatus={overallStatus} lastCheck={lastCheck} isLoading={isLoading} />

      <Row gutter={[16, 16]}>
        {/* API Health Status */}
        <Col xs={24} lg={12}>
          <DatabaseHealthCard
            databaseHealth={checks?.checks?.api || {}}
            isLoading={isLoading}
            title='API Health Status'
          />
        </Col>

        {/* Cache Status */}
        <Col xs={24} lg={12}>
          <CacheStatusCard cacheStatus={cacheStatus} isLoading={cacheLoading} />
        </Col>
      </Row>

      {/* Endpoint Health Table */}
      <Card className='admin-card'>
        <EndpointHealthTable
          endpointTests={endpointTests}
          onRefresh={refreshHealthStatus}
          isLoading={isLoading}
        />
      </Card>

      {/* System Information */}
      <Card title='System Information' className='admin-card'>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <div className='text-center p-4'>
              <h4 className='font-medium text-gray-900 mb-2'>Environment</h4>
              <p className='text-sm text-gray-600'>
                {import.meta.env.VITE_NODE_ENV || 'development'}
              </p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className='text-center p-4'>
              <h4 className='font-medium text-gray-900 mb-2'>API Base URL</h4>
              <p className='text-sm text-gray-600 font-mono'>
                {import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'}
              </p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className='text-center p-4'>
              <h4 className='font-medium text-gray-900 mb-2'>Auto-refresh</h4>
              <p className='text-sm text-gray-600'>Every 5 minutes</p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Loading Overlay */}
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg text-center'>
            <Spin size='large' />
            <p className='mt-4 text-gray-600'>Running health checks...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiHealthPage;
