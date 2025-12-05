import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { CACHE_PRESETS } from '@/constants';
import { useAuth } from '@/hooks/auth';
import { useClinicContext } from '@/hooks/clinics';
import { useFilterManagement } from '@/hooks/common/use-filter-management';
import DashboardService from '@/services/dashboard';
import type { DashboardFilters } from '@/types/dashboard';
import { message } from 'antd';

// Query keys for React Query
const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  stats: (filters: DashboardFilters) => [...DASHBOARD_KEYS.all, 'stats', filters] as const,
  charts: (filters: DashboardFilters) => [...DASHBOARD_KEYS.all, 'charts', filters] as const,
};

export const useDashboard = () => {
  const { isAuthenticated } = useAuth();
  const { clinicContext } = useClinicContext();
  const queryClient = useQueryClient();
  
  const { filters, setFilter, clearAllFilters } = useFilterManagement<DashboardFilters>({
    initialFilters: {}
  });

  // Automatically add clinicId filter for clinic_admin users
  const effectiveFilters = useMemo(() => {
    const effectiveFiltersWithClinic = { ...filters };

    // If user is clinic_admin and has a clinicId, add it to filters
    const isClinicAdmin = clinicContext?.shouldFilterByClinic;
    const hasClinicId = clinicContext?.clinicId;
    const notAlreadyFiltered = !filters.clinicId;
    const shouldAddClinicFilter = isClinicAdmin && hasClinicId && notAlreadyFiltered;

    if (shouldAddClinicFilter) {
      console.log('🔄 Dashboard: Adding clinicId filter for clinic_admin', {
        clinicId: clinicContext.clinicId,
        clinicName: clinicContext.clinicName,
      });
      effectiveFiltersWithClinic.clinicId = clinicContext.clinicId;
    } else {
      console.log('🔄 Dashboard: Not adding clinicId filter', {
        isClinicAdmin,
        hasClinicId,
        notAlreadyFiltered,
        clinicId: clinicContext?.clinicId,
      });
    }

    return effectiveFiltersWithClinic;
  }, [filters, clinicContext]);

  // Main dashboard stats query
  const {
    data: stats,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: DASHBOARD_KEYS.stats(effectiveFilters),
    queryFn: async () => {
      const result = await DashboardService.getDashboardStats(effectiveFilters);
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
      return failureCount < 1;
    },
  });

  // Dashboard charts query
  const {
    data: chartsData,
    isLoading: chartsLoading,
    error: chartsError,
  } = useQuery({
    queryKey: DASHBOARD_KEYS.charts(effectiveFilters),
    queryFn: async () => {
      const result = await DashboardService.getDashboardCharts(effectiveFilters);
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
    mutationFn: async () => {
      // Refresh both stats and charts
      const [stats, charts] = await Promise.all([
        DashboardService.getDashboardStats(effectiveFilters),
        DashboardService.getDashboardCharts(effectiveFilters),
      ]);
      return { stats, charts };
    },
    onSuccess: ({ stats, charts }) => {
      // Update the cache with new data
      queryClient.setQueryData(DASHBOARD_KEYS.stats(effectiveFilters), stats);
      queryClient.setQueryData(DASHBOARD_KEYS.charts(effectiveFilters), charts);
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
      // Using setFilter which expects specific key
      if (dates && dates[0] && dates[1]) {
        setFilter('dateRange', [dates[0].toISOString(), dates[1].toISOString()]);
      } else {
        setFilter('dateRange', undefined);
      }
    },
    [setFilter]
  );

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

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
