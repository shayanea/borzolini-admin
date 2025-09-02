import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CACHE_PRESETS } from '@/constants';
import type { DashboardFilters } from '@/types/dashboard';
import DashboardService from '@/services/dashboard.service';
import { message } from 'antd';
import { useAuth } from '@/hooks/use-auth';

// Query keys for React Query
const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  stats: (filters: DashboardFilters) => [...DASHBOARD_KEYS.all, 'stats', filters] as const,
  charts: (filters: DashboardFilters) => [...DASHBOARD_KEYS.all, 'charts', filters] as const,
};

export const useDashboard = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DashboardFilters>({});

  // Main dashboard stats query
  const {
    data: stats,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: DASHBOARD_KEYS.stats(filters),
    queryFn: async () => {
      const result = await DashboardService.getDashboardStats(filters);
      return result;
    },
    enabled: isAuthenticated,
    staleTime: CACHE_PRESETS.STANDARD.staleTime,
    gcTime: CACHE_PRESETS.STANDARD.gcTime,
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Dashboard charts query
  const {
    data: chartsData,
    isLoading: chartsLoading,
    error: chartsError,
  } = useQuery({
    queryKey: DASHBOARD_KEYS.charts(filters),
    queryFn: async () => {
      const result = await DashboardService.getDashboardCharts(filters);
      return result;
    },
    enabled: isAuthenticated,
    staleTime: CACHE_PRESETS.STANDARD.staleTime,
    gcTime: CACHE_PRESETS.STANDARD.gcTime,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Refresh mutation
  const refreshMutation = useMutation({
    mutationFn: () => DashboardService.getDashboardStats(filters),
    onSuccess: newStats => {
      // Update the cache with new data
      queryClient.setQueryData(DASHBOARD_KEYS.stats(filters), newStats);
      message.success('Dashboard data refreshed successfully');
    },
    onError: (error: any) => {
      console.error('Error refreshing dashboard data:', error);
      message.error('Failed to refresh dashboard data');
    },
  });

  // Handle date range change
  const handleDateRangeChange = useCallback(
    (dates: any) => {
      const newFilters: DashboardFilters = { ...filters };

      if (dates && dates[0] && dates[1]) {
        newFilters.dateRange = [dates[0].toISOString(), dates[1].toISOString()];
      } else {
        delete newFilters.dateRange;
      }

      setFilters(newFilters);

      // React Query will automatically refetch with new filters
      // due to the query key change
    },
    [filters]
  );

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({});
    // React Query will automatically refetch with empty filters
  }, []);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    if (isAuthenticated) {
      refreshMutation.mutate();
    }
  }, [isAuthenticated, refreshMutation]);

  // Memoized error message
  const errorMessage = useMemo(() => {
    if (!isAuthenticated) {
      return 'User not authenticated';
    }
    if (error) {
      return 'Failed to load dashboard data. Please try again.';
    }
    return null;
  }, [isAuthenticated, error]);

  // Memoized charts error message
  const chartsErrorMessage = useMemo(() => {
    if (!isAuthenticated) {
      return 'Failed to load dashboard charts. Please try again.';
    }
    if (chartsError) {
      return 'Failed to load dashboard charts. Please try again.';
    }
    return null;
  }, [isAuthenticated, chartsError]);

  return {
    // Data
    stats: stats || null,
    chartsData: chartsData || null,

    // Loading states
    loading,
    chartsLoading,

    // Error states
    error: errorMessage,
    chartsError: chartsErrorMessage,

    // Filters
    filters,

    // Actions
    handleDateRangeChange,
    handleClearFilters,
    handleRefresh,

    // Refresh mutation state
    isRefreshing: refreshMutation.isPending,

    // Query invalidation helpers
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.all });
    },

    // Manual refetch
    refetch,
  };
};
