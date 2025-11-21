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
} from '../../components/pet-cases';
// Pet Cases Management Page
import { Alert, Pagination } from 'antd';
import { ErrorState, LoadingState } from '../../components/common';

import { usePetCasesPage } from '../../hooks/pet-cases/use-pet-cases-page';

function PetCasesPage() {
  const {
    user,
    userLoading,
    clinicId,
    isAdmin,
    shouldFetchAllCases,
    state,
    modals,
    result: { cases, total, currentPage, totalPages, isLoading, error },
    stats,
    defaultStats,
    handleRefresh,
  } = usePetCasesPage();

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
    <div className='space-y-6'>
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
    </div>
  );
}

export { PetCasesPage };
export default PetCasesPage;
