import { useCallback, useState } from 'react';

import { CaseFilters } from '@/types/pet-cases';
import { PetCasesService } from '@/services/pet-cases';
import { message } from 'antd';

interface UsePetCasesStateProps {
  clinicId?: string;
}

export const usePetCasesState = ({ clinicId }: UsePetCasesStateProps = {}) => {
  const [filters, setFilters] = useState<CaseFilters>({});
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleFiltersChange = useCallback((newFilters: CaseFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    setSelectedRowKeys([]); // Clear selection
  }, []);

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
    setFilters({});
    setPage(1);
    setSelectedRowKeys([]);
  }, []);

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
