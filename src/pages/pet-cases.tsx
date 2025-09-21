import {
  AdvancedStatsOverview,
  CaseTypeDistribution,
  InteractiveCharts,
  PerformanceMetrics,
  PetCaseFormModal,
  PetCaseViewModal,
  PetCasesFilters,
  PetCasesHeader,
  PetCasesTable,
} from '../components/pet-cases';
// Pet Cases Management Page
import { Alert, Pagination } from 'antd';
import React, { useEffect } from 'react';
import { ErrorState, LoadingState, PageLayout } from '../components/common';

import { useSearchParams } from 'react-router-dom';
import { usePetCases, usePetCasesModals, usePetCasesState } from '../hooks/pet-cases';
import { useCurrentUser } from '../hooks/use-auth';

const PetCasesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const urlClinicId = searchParams.get('clinicId');

  // Use custom hooks for state management
  const state = usePetCasesState();
  const modals = usePetCasesModals();

  // Get clinic ID from URL params or user profile
  const clinicId = urlClinicId || user?.clinicId || user?.clinic_id || user?.clinic?.id;

  // Default stats object to avoid repetition
  const defaultStats = {
    total: 0,
    byStatus: {
      open: 0,
      in_progress: 0,
      pending_consultation: 0,
      pending_visit: 0,
      under_observation: 0,
      resolved: 0,
      closed: 0,
      escalated: 0,
    },
    byPriority: { low: 0, normal: 0, high: 0, urgent: 0, emergency: 0 },
    byType: {
      consultation: 0,
      follow_up: 0,
      emergency: 0,
      preventive: 0,
      chronic_condition: 0,
      post_surgery: 0,
      behavioral: 0,
      nutritional: 0,
    },
    urgent: 0,
    resolved: 0,
    averageResolutionTime: 0,
  };

  const {
    cases,
    total,
    page: currentPage,
    totalPages,
    stats,
    isLoading,
    error,
    refetch,
  } = usePetCases(clinicId || '', state.filters, state.page, 10);

  useEffect(() => {
    if (!userLoading && !clinicId) {
      console.error('No clinic ID provided');
    }
  }, [clinicId, userLoading]);

  const handleRefresh = () => {
    refetch();
    state.handleRefresh();
  };

  // Show loading while fetching user data
  if (userLoading) {
    return <LoadingState message='Loading pet cases...' fullScreen />;
  }

  // Show error if no clinic ID is available
  if (!clinicId) {
    return (
      <ErrorState
        title='Access Error'
        message='Unable to determine your clinic. Please contact support or try accessing pet cases from a clinic-specific page.'
        onRetry={() => window.history.back()}
        retryText='Go Back'
      />
    );
  }

  return (
    <PageLayout>
      {/* Advanced Statistics Overview */}
      <AdvancedStatsOverview stats={stats || defaultStats} loading={isLoading} />

      {/* Interactive Charts */}
      <InteractiveCharts stats={stats || defaultStats} loading={isLoading} />

      {/* Case Type Distribution */}
      <CaseTypeDistribution stats={stats || defaultStats} loading={isLoading} />

      {/* Performance Metrics */}
      <PerformanceMetrics stats={stats || defaultStats} loading={isLoading} />

      {/* Page Header */}
      <PetCasesHeader
        totalCases={total}
        selectedCount={state.selectedRowKeys.length}
        stats={stats || defaultStats}
        loading={isLoading}
        onCreateCase={state.handleCreateCase}
        onExport={state.handleExport}
        onRefresh={handleRefresh}
        onViewStats={state.handleViewStats}
      />

      {/* Filters */}
      <PetCasesFilters
        filters={state.filters}
        onFiltersChange={state.handleFiltersChange}
        onReset={state.handleResetFilters}
        loading={isLoading}
      />

      {/* Cases Table */}
      <div className='bg-white rounded-lg border border-gray-200'>
        <PetCasesTable
          cases={cases}
          loading={isLoading}
          onViewCase={modals.handleViewCase}
          onEditCase={modals.handleEditCase}
          selectedRowKeys={state.selectedRowKeys}
          onSelectionChange={state.handleSelectionChange}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='px-6 py-4 border-t border-gray-200 flex justify-center'>
            <Pagination
              current={currentPage}
              total={total}
              pageSize={10}
              onChange={state.handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} cases`}
            />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className='mt-4'>
          <Alert
            message='Error Loading Cases'
            description={error?.message || 'An error occurred while loading cases'}
            type='error'
            showIcon
            closable
          />
        </div>
      )}

      {/* View Case Modal */}
      <PetCaseViewModal
        caseData={modals.selectedCase}
        visible={modals.viewModalVisible}
        onClose={modals.handleCloseViewModal}
        onEdit={modals.handleEditCase}
        clinicId={clinicId}
      />

      {/* Edit Case Modal */}
      <PetCaseFormModal
        visible={modals.editModalVisible}
        onClose={modals.handleCloseEditModal}
        onSuccess={modals.handleEditSuccess}
        clinicId={clinicId}
        editCase={modals.selectedCase}
      />
    </PageLayout>
  );
};

export default PetCasesPage;
