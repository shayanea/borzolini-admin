import { useCallback } from 'react';
import { DEFAULT_METRICS, REPORT_CATEGORIES } from '@/constants/reports';
import type { Metric, ReportCategory } from '@/types/reports';

export const useReports = () => {
  const handleFilters = useCallback(() => {
    console.log('Filters clicked');
  }, []);

  const handleExportReport = useCallback(() => {
    console.log('Export report clicked');
  }, []);

  const metrics: Metric[] = DEFAULT_METRICS as unknown as Metric[];
  const categories: ReportCategory[] = REPORT_CATEGORIES as unknown as ReportCategory[];

  return {
    metrics,
    categories,
    handleFilters,
    handleExportReport,
  };
};
