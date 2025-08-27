import { ComingSoon, KeyMetrics, ReportCategories, ReportsHeader } from '@/components/reports';

import { useReports } from '@/hooks/use-reports';

const Reports = () => {
  const { metrics, categories, handleFilters, handleExportReport } = useReports();

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <ReportsHeader onFilters={handleFilters} onExportReport={handleExportReport} />

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
