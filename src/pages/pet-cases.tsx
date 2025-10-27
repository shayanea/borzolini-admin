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
import { ErrorState, LoadingState, PageLayout } from '../components/common';
import React, { useEffect } from 'react';
import {
  useAllPetCases,
  usePetCases,
  usePetCasesModals,
  usePetCasesState,
} from '../hooks/pet-cases';

import { User } from '@/types';
import { useCurrentUser } from '../hooks/use-auth';
import { useSearchParams } from 'react-router-dom';

const PetCasesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { data: user, isLoading: userLoading } = useCurrentUser() as {
    data: User;
    isLoading: boolean;
  };
  const urlClinicId = searchParams.get('clinicId');

  // Get clinic ID from URL params or user profile
  const clinicId: string | undefined =
    urlClinicId || user?.clinicId || user?.clinic_id || user?.clinic?.id;
  console.log('clinicId', clinicId);

  // Use custom hooks for state management
  const state = usePetCasesState({ clinicId });
  const modals = usePetCasesModals();

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Determine if we should fetch all cases (admin without clinic ID) or clinic-specific cases
  const shouldFetchAllCases = isAdmin && !clinicId;

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

  // Use different hooks based on whether we're fetching all cases or clinic-specific cases
  const clinicCasesResult = usePetCases(clinicId || '', state.filters, state.page, 10);
  const allCasesResult = useAllPetCases(state.filters, state.page, 10, !!clinicId);

  // Select the appropriate result based on the condition
  const result = shouldFetchAllCases ? allCasesResult : clinicCasesResult;

  const { cases, total, page: currentPage, totalPages, isLoading, error, refetch } = result;

  // Stats are only available when fetching clinic-specific cases
  const stats = shouldFetchAllCases ? undefined : clinicCasesResult.stats;

  useEffect(() => {
    const isNotValid = !userLoading && !clinicId && !isAdmin;
    if (isNotValid) {
      console.error('No clinic ID provided and user is not admin');
    }
  }, [clinicId, userLoading, isAdmin]);

  const handleRefresh = () => {
    refetch();
    state.handleRefresh();
  };

  // Show loading while fetching user data
  if (userLoading) {
    return <LoadingState message='Loading pet cases...' fullScreen />;
  }

  // Show error if no clinic ID is available and user is not admin
  if (!clinicId && !isAdmin) {
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
        onCreateCase={modals.handleCreateCase}
        onExport={state.handleExport}
        onRefresh={handleRefresh}
        onViewStats={state.handleViewStats}
        viewAllCases={shouldFetchAllCases}
        clinicName={user?.clinic?.name}
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
        clinicId={modals.selectedCase?.clinic_id || clinicId || ''}
      />

      {/* Edit Case Modal */}
      <PetCaseFormModal
        visible={modals.editModalVisible}
        onClose={modals.handleCloseEditModal}
        onSuccess={modals.handleEditSuccess}
        clinicId={modals.selectedCase?.clinic_id || clinicId || ''}
        editCase={modals.selectedCase}
      />
    </PageLayout>
  );
};

export default PetCasesPage;
