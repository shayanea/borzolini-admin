import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal, message as antMessage } from 'antd';
import { useCallback } from 'react';

import ClinicsService from '@/services/clinics';
import type { Clinic, ClinicsQueryParams } from '@/types';
import { useFilterManagement, type FilterValue } from '../common/use-filter-management';
import { useTableManagement } from '../common/use-table-management';

/**
 * Clinic-specific filters
 */
interface ClinicFilters {
  city: string | null;
  isActive: boolean | null;
  [key: string]: FilterValue;
}

interface UseClinicManagementReturn {
  // State
  clinics: Clinic[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  searchText: string;
  selectedCity: string | null;
  selectedStatus: boolean | null;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  selectedRowKeys: string[];
  bulkLoading: boolean;

  // Actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSearch: (value: string) => void;
  handleCityFilter: (value: string | null) => void;
  handleStatusFilter: (value: boolean | null) => void;
  clearFilters: () => void;
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
  handleDeleteClinic: (clinicId: string) => Promise<void>;
  handleBulkDelete: () => Promise<void>;
  handleExportCSV: () => Promise<Blob>;
  handleExportExcel: () => Promise<Blob>;
  setSelectedRowKeys: (keys: string[]) => void;

  // Utils
  refetch: () => void;
}

/**
 * Hook for managing clinic data with table, filters, and CRUD operations
 *
 * @example
 * ```tsx
 * const clinicManagement = useClinicManagement();
 *
 * <Table
 *   dataSource={clinicManagement.clinics}
 *   loading={clinicManagement.loading}
 *   onChange={clinicManagement.handleTableChange}
 *   pagination={{
 *     current: clinicManagement.currentPage,
 *     pageSize: clinicManagement.pageSize,
 *     total: clinicManagement.total,
 *   }}
 * />
 * ```
 */
export function useClinicManagement(): UseClinicManagementReturn {
  const queryClient = useQueryClient();

  // Use reusable table management hook
  const table = useTableManagement({
    initialSortBy: 'name',
    initialSortOrder: 'ASC',
  });

  // Use reusable filter management hook
  const filterManager = useFilterManagement<ClinicFilters>({
    initialFilters: {
      city: null,
      isActive: null,
    },
    resetToPage1: () => table.setCurrentPage(1),
  });

  // Query for clinics with optimized dependencies
  const {
    data: clinicsResponse,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'clinics',
      table.currentPage,
      table.pageSize,
      filterManager.searchText,
      filterManager.filters.city,
      filterManager.filters.isActive,
      table.sortBy,
      table.sortOrder,
    ],
    queryFn: async () => {
      const params: ClinicsQueryParams = {
        page: table.currentPage,
        limit: table.pageSize,
        search: filterManager.searchText || undefined,
        city: filterManager.filters.city || undefined,
        isActive:
          filterManager.filters.isActive !== null ? filterManager.filters.isActive : undefined,
        sortBy: table.sortBy,
        sortOrder: table.sortOrder,
      };

      return await ClinicsService.getClinics(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteClinicMutation = useMutation({
    mutationFn: ClinicsService.deleteClinic,
    onSuccess: () => {
      antMessage.success('Clinic deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: ClinicsService.bulkDeleteClinics,
    onSuccess: () => {
      antMessage.success('Clinics deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      table.clearSelection();
    },
  });

  // Computed values
  const clinics = clinicsResponse?.clinics || [];
  const total = clinicsResponse?.total || 0;

  // City filter handler (maps to filter manager)
  const handleCityFilter = useCallback(
    (value: string | null) => {
      filterManager.setFilter('city', value);
    },
    [filterManager]
  );

  // Status filter handler (maps to filter manager)
  const handleStatusFilter = useCallback(
    (value: boolean | null) => {
      filterManager.setFilter('isActive', value);
    },
    [filterManager]
  );

  // Delete handler with confirmation
  const handleDeleteClinic = useCallback(
    async (clinicId: string) => {
      Modal.confirm({
        title: 'Are you sure you want to delete this clinic?',
        content: 'This action cannot be undone.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          await deleteClinicMutation.mutateAsync(clinicId);
        },
      });
    },
    [deleteClinicMutation]
  );

  // Bulk delete handler with confirmation
  const handleBulkDelete = useCallback(async () => {
    if (table.selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: `Are you sure you want to delete ${table.selectedRowKeys.length} clinic(s)?`,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        await bulkDeleteMutation.mutateAsync(table.selectedRowKeys);
      },
    });
  }, [table.selectedRowKeys, bulkDeleteMutation]);

  // Export handlers
  const handleExportCSV = useCallback(async () => {
    return await ClinicsService.exportClinicsToCSV({
      search: filterManager.searchText || undefined,
      city: filterManager.filters.city || undefined,
      isActive:
        filterManager.filters.isActive !== null ? filterManager.filters.isActive : undefined,
    });
  }, [filterManager.searchText, filterManager.filters.city, filterManager.filters.isActive]);

  const handleExportExcel = useCallback(async () => {
    return await ClinicsService.exportClinicsToExcel({
      search: filterManager.searchText || undefined,
      city: filterManager.filters.city || undefined,
      isActive:
        filterManager.filters.isActive !== null ? filterManager.filters.isActive : undefined,
    });
  }, [filterManager.searchText, filterManager.filters.city, filterManager.filters.isActive]);

  return {
    // State from table management
    clinics,
    loading,
    total,
    currentPage: table.currentPage,
    pageSize: table.pageSize,
    sortBy: table.sortBy,
    sortOrder: table.sortOrder,
    selectedRowKeys: table.selectedRowKeys,
    bulkLoading: bulkDeleteMutation.isPending,

    // State from filter management
    searchText: filterManager.searchText,
    selectedCity: filterManager.filters.city,
    selectedStatus: filterManager.filters.isActive,

    // Actions from table management
    setCurrentPage: table.setCurrentPage,
    setPageSize: table.setPageSize,
    handleTableChange: table.handleTableChange,
    setSelectedRowKeys: table.setSelectedRowKeys,

    // Actions from filter management
    handleSearch: filterManager.handleSearch,
    clearFilters: filterManager.clearAllFilters,

    // Custom filter handlers
    handleCityFilter,
    handleStatusFilter,

    // CRUD operations
    handleDeleteClinic,
    handleBulkDelete,
    handleExportCSV,
    handleExportExcel,

    // Utils
    refetch,
  };
}
