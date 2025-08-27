import { useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { DEFAULT_METRICS, REPORT_CATEGORIES } from '@/constants/reports';
import type { Metric, ReportCategory, ReportFilters } from '@/types/reports';

// Mock service - replace with real service when available
const ReportsService = {
  getMetrics: async (_filters?: ReportFilters): Promise<Metric[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return DEFAULT_METRICS as unknown as Metric[];
  },
  
  getCategories: async (): Promise<ReportCategory[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return REPORT_CATEGORIES as unknown as ReportCategory[];
  },
  
  exportReport: async (_filters: ReportFilters, _format: 'csv' | 'pdf'): Promise<Blob> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return new Blob(['Mock report data'], { type: 'text/csv' });
  }
};

export const useReports = (filters: ReportFilters = {}) => {

  // Query for metrics
  const {
    data: metrics = [],
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ['reports', 'metrics', filters],
    queryFn: () => ReportsService.getMetrics(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Query for report categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['reports', 'categories'],
    queryFn: () => ReportsService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Mutation for exporting reports
  const exportReportMutation = useMutation({
    mutationFn: ({ filters, format }: { filters: ReportFilters; format: 'csv' | 'pdf' }) =>
      ReportsService.exportReport(filters, format),
    onSuccess: (blob, { format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(`Report exported successfully as ${format.toUpperCase()}`);
    },
    onError: (error) => {
      console.error('Export failed:', error);
      message.error('Failed to export report. Please try again.');
    },
  });

  const handleFilters = useCallback(() => {
    console.log('Filters clicked');
    // This could trigger a refetch with new filters
    refetchMetrics();
  }, [refetchMetrics]);

  const handleExportReport = useCallback(async (format: 'csv' | 'pdf' = 'csv') => {
    await exportReportMutation.mutateAsync({ filters, format });
  }, [filters, exportReportMutation]);

  return {
    // Data
    metrics,
    categories,
    
    // Loading states
    metricsLoading,
    categoriesLoading,
    exportLoading: exportReportMutation.isPending,
    
    // Error states
    metricsError,
    categoriesError,
    
    // Actions
    handleFilters,
    handleExportReport,
    
    // Utilities
    refetchMetrics,
  };
};
