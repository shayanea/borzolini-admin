import { Alert, Button, Col, Row, Spin } from 'antd';
import {
  DashboardHeader,
  QuickActions,
  RecentActivity,
  StatisticsCards,
  TopPerformingClinics,
} from '@/components/dashboard';

import { useDashboard } from '@/hooks/use-dashboard';

const Dashboard = () => {
  const { stats, loading, error, handleDateRangeChange, handleClearFilters, handleRefresh } =
    useDashboard();

  if (loading && !stats) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Spin size='large' className='mb-4' />
          <div className='text-lg'>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <Alert
          message='Error Loading Dashboard'
          description={error}
          type='error'
          showIcon
          action={
            <Button size='small' danger onClick={handleRefresh}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='space-y-6'>
        <Alert
          message='No Data Available'
          description='Unable to load dashboard statistics.'
          type='warning'
          showIcon
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <DashboardHeader
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Statistics Cards */}
      <StatisticsCards stats={stats} />

      {/* Quick Actions and Recent Activity */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <RecentActivity stats={stats} />
        </Col>
        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>

      {/* Top Performing Clinics */}
      <TopPerformingClinics stats={stats} />
    </div>
  );
};

export default Dashboard;
