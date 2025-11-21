import { ErrorState, LoadingState } from '@/components/common';
import {
  DashboardHeader,
  PetCasesWidget,
  QuickActions,
  RecentActivity,
  StatisticsCards,
  TopPerformingClinics,
} from '@/components/dashboard';
import { Alert, Col, Row, Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import { useDashboard } from '@/hooks/dashboard';

const Dashboard = () => {
  const { t } = useTranslation('pages');
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

  if (loading && !stats) {
    return <LoadingState message={t('dashboard.loading')} fullScreen />;
  }

  if (error) {
    return (
      <ErrorState
        title={t('dashboard.errorTitle')}
        message={error}
        onRetry={handleRefresh}
        retryText={t('dashboard.retry')}
      />
    );
  }

  if (!stats) {
    return (
      <ErrorState
        title={t('dashboard.noDataTitle')}
        message={t('dashboard.noDataMessage')}
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

      {/* Pet Cases Widget */}
      {stats.petCases && (
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <PetCasesWidget stats={stats} loading={loading} />
          </Col>
        </Row>
      )}

      {/* Top Performing Clinics */}
      <TopPerformingClinics stats={stats} />

      {/* Show charts loading state if needed */}
      {chartsLoading && (
        <div className='text-center py-4'>
          <Spin size='default' />
          <div className='mt-2 text-sm text-gray-500'>{t('dashboard.loadingCharts')}</div>
        </div>
      )}

      {/* Show charts error if needed */}
      {chartsError && (
        <Alert
          message={t('dashboard.chartsError')}
          description={chartsError}
          type='warning'
          showIcon
          className='mt-4'
        />
      )}
    </div>
  );
};

export { Dashboard };
export default Dashboard;
