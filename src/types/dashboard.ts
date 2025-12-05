import type { DashboardStats } from './index';

export interface DashboardHeaderProps {
  onDateRangeChange?: (dates: [any, any] | null) => void;
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
  [key: string]: any;
  dateRange?: [string, string];
  clinicId?: string;
}
