import { useCallback, useState } from 'react';

import { PetCasesService } from '@/services/pet-cases';
import { CaseFilters } from '@/types/pet-cases';
import { message } from 'antd';

interface UsePetCasesStateProps {
  clinicId?: string;
}

import { useFilterManagement } from '@/hooks/common/use-filter-management';

export const usePetCasesState = ({ clinicId }: UsePetCasesStateProps = {}) => {
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  
  const { filters, setFilters, resetFilters } = useFilterManagement<CaseFilters>({
    initialFilters: {},
    resetToPage1: () => setPage(1),
  });

  const handleFiltersChange = useCallback((newFilters: CaseFilters) => {
    setFilters(newFilters);
    setSelectedRowKeys([]); // Clear selection
  }, [setFilters]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setSelectedRowKeys([]); // Clear selection when changing pages
  }, []);

  const handleRefresh = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  const handleSelectionChange = useCallback((keys: string[]) => {
    setSelectedRowKeys(keys);
  }, []);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setSelectedRowKeys([]);
  }, [resetFilters]);

  const handleExport = useCallback(async () => {
    if (!clinicId) {
      message.error('Unable to export: Clinic ID not available');
      return;
    }

    try {
      message.loading({ content: 'Exporting cases...', key: 'export' });
      const blob = await PetCasesService.exportCases(clinicId, filters, 'csv');

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pet-cases-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success({ content: 'Cases exported successfully', key: 'export' });
    } catch (error: any) {
      console.error('Export error:', error);
      message.error({ content: `Failed to export cases: ${error.message}`, key: 'export' });
    }
  }, [clinicId, filters]);

  const handleViewStats = useCallback(() => {
    // Stats are already displayed on the page, this can scroll to stats section
    const statsSection = document.getElementById('pet-cases-stats');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return {
    filters,
    page,
    selectedRowKeys,
    handleFiltersChange,
    handlePageChange,
    handleRefresh,
    handleSelectionChange,
    handleResetFilters,
    handleExport,
    handleViewStats,
  };
};
