import { Alert, Button, Card, Col, Row, Space, Spin, Typography, message } from 'antd';
import { ExclamationCircleOutlined, MonitorOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import { AnalyticsHealthCard } from '@/components/api-health/analytics-health-card';
import { CacheStatusCard } from '@/components/api-health/cache-status-card';
import { DatabaseHealthCard } from '@/components/api-health/database-health-card';
import { EndpointHealthTable } from '@/components/api-health/endpoint-health-table';
import { HealthStatusCard } from '@/components/api-health/health-status-card';
import { SystemMetricsCard } from '@/components/api-health/system-metrics-card';
import { apiHealthService } from '@/services/api-health.service';
import { useApiHealth } from '@/hooks/use-api-health';

const ApiHealthPage: React.FC = () => {
  const {
    overallStatus,
    lastCheck,
    checks,
    isLoading,
    error,
    endpointTests,
    databaseHealth,
    systemMetrics,
    analyticsHealth,
    analyticsStatus,
    refreshHealthStatus,
  } = useApiHealth();

  const [cacheStatus, setCacheStatus] = useState<Record<string, unknown>>({});
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
      <div className='admin-page-header mb-4 md:mb-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center'>
            <Space size={12} wrap>
              {getStatusIcon(overallStatus)}
              <Typography.Title level={3} className='!mb-0 md:!mb-0 md:!text-2xl !text-xl'>
                API Health Monitor
              </Typography.Title>
              <span className='text-sm text-gray-500'>Real-time system health monitoring</span>
            </Space>
          </div>

          <Button
            type='primary'
            size='middle'
            icon={<ReloadOutlined />}
            onClick={handleRefreshAll}
            loading={isLoading}
            className='w-full sm:w-auto bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
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

      <Row gutter={[16, 16]} className='[&_.ant-card-head-title]:!m-0'>
        {/* Database Health Status */}
        <Col xs={24} lg={24}>
          <DatabaseHealthCard
            databaseHealth={databaseHealth || checks?.checks?.database || {}}
            isLoading={isLoading}
            title='Database Health'
          />
        </Col>

        {/* System Metrics */}
        <Col xs={24} lg={24}>
          <SystemMetricsCard systemMetrics={systemMetrics} isLoading={isLoading} />
        </Col>

        {/* Analytics Health */}
        <Col xs={24} lg={24}>
          <AnalyticsHealthCard
            analyticsHealth={analyticsHealth}
            analyticsStatus={analyticsStatus}
            isLoading={isLoading}
          />
        </Col>

        {/* Cache Status */}
        <Col xs={24} lg={24}>
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
