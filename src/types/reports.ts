export interface ReportsHeaderProps {
  onFilters: () => void;
  onExportReport: () => void;
}

export interface Metric {
  key: string;
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  progress: number;
}

export interface KeyMetricsProps {
  metrics: Metric[];
}

export interface Report {
  title: string;
  description: string;
  onClick: () => void;
}

export interface ReportCategory {
  title: string;
  reports: Report[];
}

export interface ReportCategoriesProps {
  categories: ReportCategory[];
}

export interface ReportFilters {
  dateRange?: [string, string];
  clinicId?: string;
  reportType?: string;
  format?: 'csv' | 'pdf';
}
