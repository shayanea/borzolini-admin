import React from 'react';
import { useReports } from '@/hooks/useReports';
import {
  ReportsHeader,
  KeyMetrics,
  ReportCategories,
  ComingSoon,
} from '@/components/reports';

const Reports = () => {
  const {
    metrics,
    categories,
    handleFilters,
    handleExportReport,
  } = useReports();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ReportsHeader
        onFilters={handleFilters}
        onExportReport={handleExportReport}
      />

      {/* Key Metrics */}
      <KeyMetrics metrics={metrics} />

      {/* Report Categories */}
      <ReportCategories categories={categories} />

      {/* Coming Soon */}
      <ComingSoon />
    </div>
  );
};

export default Reports;
