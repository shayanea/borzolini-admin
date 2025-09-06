// Pet Cases Management Page
import { Alert, Layout, Pagination } from 'antd';
import { CaseFilters, ClinicPetCase } from '../types/pet-cases';
import {
  PetCaseFormModal,
  PetCaseStatsCard,
  PetCaseViewModal,
  PetCasesFilters,
  PetCasesHeader,
  PetCasesTable,
} from '../components/pet-cases';
import React, { useEffect, useState } from 'react';

import { usePetCases } from '../hooks/use-pet-cases';
import { useSearchParams } from 'react-router-dom';

const { Content } = Layout;

const PetCasesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const clinicId = searchParams.get('clinicId');
  const [filters, setFilters] = useState<CaseFilters>({});
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ClinicPetCase | null>(null);

  const {
    cases,
    total,
    page: currentPage,
    totalPages,
    stats,
    isLoading,
    error,
    refetch,
  } = usePetCases(clinicId || '', filters, page, 10);

  useEffect(() => {
    if (!clinicId) {
      console.error('No clinic ID provided');
    }
  }, [clinicId]);

  const handleFiltersChange = (newFilters: CaseFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    setSelectedRowKeys([]); // Clear selection
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedRowKeys([]); // Clear selection when changing pages
  };

  const handleRefresh = () => {
    refetch();
    setSelectedRowKeys([]);
  };

  const handleViewCase = (caseData: ClinicPetCase) => {
    setSelectedCase(caseData);
    setViewModalVisible(true);
  };

  const handleEditCase = (caseData: ClinicPetCase) => {
    setSelectedCase(caseData);
    setEditModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedCase(null);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedCase(null);
  };

  const handleEditSuccess = () => {
    refetch();
    setEditModalVisible(false);
    setSelectedCase(null);
  };

  const handleSelectionChange = (keys: string[]) => {
    setSelectedRowKeys(keys);
  };

  const handleCreateCase = () => {
    // TODO: Implement create case modal
    console.log('Create new case');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export cases');
  };

  const handleViewStats = () => {
    // TODO: Implement stats modal or redirect to stats page
    console.log('View detailed statistics');
  };

  if (!clinicId) {
    return (
      <Layout className='min-h-screen'>
        <Content className='p-6'>
          <Alert
            message='Error'
            description='No clinic ID provided. Please navigate to a specific clinic.'
            type='error'
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className='min-h-screen'>
      <Content className='p-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Statistics Card */}
          <PetCaseStatsCard
            stats={
              stats || {
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
              }
            }
            loading={isLoading}
          />

          {/* Page Header */}
          <PetCasesHeader
            totalCases={total}
            selectedCount={selectedRowKeys.length}
            stats={
              stats || {
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
              }
            }
            loading={isLoading}
            onCreateCase={handleCreateCase}
            onExport={handleExport}
            onRefresh={handleRefresh}
            onViewStats={handleViewStats}
          />

          {/* Filters */}
          <PetCasesFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={() => {
              setFilters({});
              setPage(1);
              setSelectedRowKeys([]);
            }}
            loading={isLoading}
          />

          {/* Cases Table */}
          <div className='bg-white rounded-lg border border-gray-200'>
            <PetCasesTable
              cases={cases}
              loading={isLoading}
              onViewCase={handleViewCase}
              onEditCase={handleEditCase}
              selectedRowKeys={selectedRowKeys}
              onSelectionChange={handleSelectionChange}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='px-6 py-4 border-t border-gray-200 flex justify-center'>
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={10}
                  onChange={handlePageChange}
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
                description={error.message}
                type='error'
                showIcon
                closable
              />
            </div>
          )}

          {/* View Case Modal */}
          <PetCaseViewModal
            caseData={selectedCase}
            visible={viewModalVisible}
            onClose={handleCloseViewModal}
            onEdit={handleEditCase}
            clinicId={clinicId}
          />

          {/* Edit Case Modal */}
          <PetCaseFormModal
            visible={editModalVisible}
            onClose={handleCloseEditModal}
            onSuccess={handleEditSuccess}
            clinicId={clinicId}
            editCase={selectedCase}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default PetCasesPage;
