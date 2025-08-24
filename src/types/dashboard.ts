import type { DashboardStats } from './index';

export interface DashboardHeaderProps {
  onDateRangeChange: (dates: any, dateStrings: [string, string]) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export interface StatisticsCardsProps {
  stats: DashboardStats;
}

export interface RecentActivityProps {
  stats: DashboardStats;
}

export interface TopPerformingClinicsProps {
  stats: DashboardStats;
}

export interface DashboardFilters {
  dateRange?: [string, string];
  clinicId?: string;
}
