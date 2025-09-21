import { ErrorState, LoadingState } from '@/components/common';
import {
  DashboardHeader,
  QuickActions,
  RecentActivity,
  StatisticsCards,
  TopPerformingClinics,
} from '@/components/dashboard';
import { Alert, Col, Row, Spin } from 'antd';

import { useDashboard } from '@/hooks/use-dashboard';

const Dashboard = () => {
  const {
    stats,
    loading,
    error,
    chartsLoading,
    chartsError,
    handleDateRangeChange,
    handleClearFilters,
    handleRefresh,
    isRefreshing,
  } = useDashboard();

  console.log('stats', stats);

  if (loading && !stats) {
    return <LoadingState message='Loading dashboard...' fullScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title='Error Loading Dashboard'
        message={error}
        onRetry={handleRefresh}
        retryText='Retry'
      />
    );
  }

  if (!stats) {
    return (
      <ErrorState
        title='No Data Available'
        message='Unable to load dashboard statistics.'
        type='warning'
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <DashboardHeader
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
        onRefresh={handleRefresh}
        loading={loading || isRefreshing}
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

      {/* Show charts loading state if needed */}
      {chartsLoading && (
        <div className='text-center py-4'>
          <Spin size='default' />
          <div className='mt-2 text-sm text-gray-500'>Loading charts...</div>
        </div>
      )}

      {/* Show charts error if needed */}
      {chartsError && (
        <Alert
          message='Charts Error'
          description={chartsError}
          type='warning'
          showIcon
          className='mt-4'
        />
      )}
    </div>
  );
};

export default Dashboard;
