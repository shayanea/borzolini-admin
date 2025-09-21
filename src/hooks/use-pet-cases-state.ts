import { CaseFilters } from '@/types/pet-cases';
import { useCallback, useState } from 'react';

export const usePetCasesState = () => {
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

  const handleCreateCase = useCallback(() => {
    // TODO: Implement create case modal
    console.log('Create new case');
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export cases');
  }, []);

  const handleViewStats = useCallback(() => {
    // TODO: Implement stats modal or redirect to stats page
    console.log('View detailed statistics');
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
    handleCreateCase,
    handleExport,
    handleViewStats,
  };
};
