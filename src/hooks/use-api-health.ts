import { ApiHealthState, HealthCheckResponse, HealthStatus } from '@/types/api-health';
import { CACHE_PRESETS, GC_TIMES, STALE_TIMES } from '@/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiHealthService } from '@/services/api-health.service';
import { message } from 'antd';
import { useCallback } from 'react';

export const useApiHealth = () => {
  const queryClient = useQueryClient();

  // Query for API health
  const {
    data: apiHealth,
    isLoading: isLoadingApiHealth,
    error: apiHealthError,
    refetch: refetchApiHealth,
  } = useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      return await apiHealthService.checkApiHealth();
    },
    staleTime: CACHE_PRESETS.LIVE.staleTime,
    gcTime: CACHE_PRESETS.LIVE.gcTime,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  // Query for endpoint tests
  const { data: endpointTests = [], refetch: refetchEndpointTests } = useQuery({
    queryKey: ['endpoint-tests'],
    queryFn: async () => {
      return await apiHealthService.testCriticalEndpoints();
    },
    staleTime: CACHE_PRESETS.ACTIVE.staleTime,
    gcTime: CACHE_PRESETS.ACTIVE.gcTime,
  });

  // Query for system health
  const { data: systemHealth = 'degraded', refetch: refetchSystemHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      return await apiHealthService.getSystemHealth();
    },
    staleTime: STALE_TIMES.VERY_SHORT,
    gcTime: GC_TIMES.VERY_SHORT,
  });

  // Query for database health
  const { data: databaseHealth, refetch: refetchDatabaseHealth } = useQuery({
    queryKey: ['database-health'],
    queryFn: async () => {
      return await apiHealthService.getDatabaseHealth();
    },
    staleTime: CACHE_PRESETS.ACTIVE.staleTime,
    gcTime: CACHE_PRESETS.ACTIVE.gcTime,
  });

  // Query for detailed system metrics
  const { data: systemMetrics, refetch: refetchSystemMetrics } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      return await apiHealthService.getDetailedHealth();
    },
    staleTime: CACHE_PRESETS.ACTIVE.staleTime,
    gcTime: CACHE_PRESETS.ACTIVE.gcTime,
  });

  // Query for analytics health
  const { data: analyticsHealth, refetch: refetchAnalyticsHealth } = useQuery({
    queryKey: ['analytics-health'],
    queryFn: async () => {
      return await apiHealthService.getAnalyticsHealth();
    },
    staleTime: CACHE_PRESETS.ACTIVE.staleTime,
    gcTime: CACHE_PRESETS.ACTIVE.gcTime,
  });

  // Query for analytics status
  const { data: analyticsStatus, refetch: refetchAnalyticsStatus } = useQuery({
    queryKey: ['analytics-status'],
    queryFn: async () => {
      return await apiHealthService.getAnalyticsStatus();
    },
    staleTime: CACHE_PRESETS.ACTIVE.staleTime,
    gcTime: CACHE_PRESETS.ACTIVE.gcTime,
  });

  // Query for cache status
  const {
    data: cacheStatus = {},
    isLoading: cacheLoading,
    refetch: refetchCacheStatus,
  } = useQuery({
    queryKey: ['cache-status'],
    queryFn: async () => {
      return await apiHealthService.getCacheStatus();
    },
    staleTime: CACHE_PRESETS.ACTIVE.staleTime,
    gcTime: CACHE_PRESETS.ACTIVE.gcTime,
  });

  // Mutation for running full health check
  const runFullHealthCheckMutation = useMutation({
    mutationFn: async () => {
      // Run all health checks in parallel (including detailed metrics and analytics)
      const [
        apiHealthResult,
        endpointTestsResult,
        systemMetricsResult,
        databaseHealthResult,
        analyticsHealthResult,
        analyticsStatusResult,
        cacheStatusResult,
      ] = await Promise.all([
        refetchApiHealth(),
        refetchEndpointTests(),
        refetchSystemMetrics(),
        refetchDatabaseHealth(),
        refetchAnalyticsHealth(),
        refetchAnalyticsStatus(),
        refetchCacheStatus(),
      ]);

      // Determine overall status
      const hasUnhealthyEndpoints =
        endpointTestsResult.data?.some(test => test.status === 'error') || false;
      const hasDegradedEndpoints =
        endpointTestsResult.data?.some(test => test.status === 'timeout') || false;

      let overallStatus: HealthStatus = 'healthy';
      if (apiHealthResult.data?.status === 'unhealthy' || hasUnhealthyEndpoints) {
        overallStatus = 'unhealthy';
      } else if (apiHealthResult.data?.status === 'degraded' || hasDegradedEndpoints) {
        overallStatus = 'degraded';
      }

      // Update system health and related caches
      queryClient.setQueryData(['system-health'], overallStatus);
      if (systemMetricsResult.data) {
        queryClient.setQueryData(['system-metrics'], systemMetricsResult.data);
      }
      if (databaseHealthResult.data) {
        queryClient.setQueryData(['database-health'], databaseHealthResult.data);
      }
      if (analyticsHealthResult.data) {
        queryClient.setQueryData(['analytics-health'], analyticsHealthResult.data);
      }
      if (analyticsStatusResult.data) {
        queryClient.setQueryData(['analytics-status'], analyticsStatusResult.data);
      }
      if (cacheStatusResult.data) {
        queryClient.setQueryData(['cache-status'], cacheStatusResult.data);
      }

      return {
        overallStatus,
        apiHealth: apiHealthResult.data,
        endpointTests: endpointTestsResult.data,
        systemMetrics: systemMetricsResult.data,
        databaseHealth: databaseHealthResult.data,
        analyticsHealth: analyticsHealthResult.data,
        analyticsStatus: analyticsStatusResult.data,
        cacheStatus: cacheStatusResult.data,
      };
    },
    onSuccess: () => {
      message.success('Health status refreshed successfully');
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Health check failed';
      message.error(errorMessage);
      // Set system health as unhealthy on error
      queryClient.setQueryData(['system-health'], 'unhealthy');
      throw error;
    },
  });

  // Helper functions
  const checkApiHealth = useCallback(async () => {
    return await refetchApiHealth();
  }, [refetchApiHealth]);

  const testEndpoints = useCallback(async () => {
    return await refetchEndpointTests();
  }, [refetchEndpointTests]);

  const getSystemHealth = useCallback(async (): Promise<HealthStatus> => {
    const result = await refetchSystemHealth();
    return result.data || 'degraded';
  }, [refetchSystemHealth]);

  const runFullHealthCheck = useCallback(async () => {
    return await runFullHealthCheckMutation.mutateAsync();
  }, [runFullHealthCheckMutation]);

  const refreshHealthStatus = useCallback(async () => {
    try {
      await runFullHealthCheck();
    } catch (error) {
      // Error already handled in runFullHealthCheck
    }
  }, [runFullHealthCheck]);

  // Construct the state object
  const state: ApiHealthState = {
    overallStatus: systemHealth,
    lastCheck: new Date().toISOString(),
    checks: apiHealth || ({} as HealthCheckResponse),
    isLoading: isLoadingApiHealth || runFullHealthCheckMutation.isPending,
    error: apiHealthError
      ? apiHealthError instanceof Error
        ? apiHealthError.message
        : 'API health check failed'
      : null,
    endpointTests,
  };

  return {
    ...state,
    databaseHealth,
    systemMetrics,
    analyticsHealth,
    analyticsStatus,
    cacheStatus,
    cacheLoading,
    checkApiHealth,
    testEndpoints,
    getSystemHealth,
    runFullHealthCheck,
    refreshHealthStatus,
  };
};
