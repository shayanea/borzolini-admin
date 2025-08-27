import { ApiHealthState, HealthCheckResponse, HealthStatus } from '@/types/api-health';
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiHealthService } from '@/services/api-health.service';
import { message } from 'antd';

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
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  // Query for endpoint tests
  const {
    data: endpointTests = [],
    refetch: refetchEndpointTests,
  } = useQuery({
    queryKey: ['endpoint-tests'],
    queryFn: async () => {
      return await apiHealthService.testCriticalEndpoints();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query for system health
  const {
    data: systemHealth = 'degraded',
    refetch: refetchSystemHealth,
  } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      return await apiHealthService.getSystemHealth();
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mutation for running full health check
  const runFullHealthCheckMutation = useMutation({
    mutationFn: async () => {
      // Run all health checks in parallel
      const [apiHealthResult, endpointTestsResult] = await Promise.all([
        refetchApiHealth(),
        refetchEndpointTests(),
      ]);

      // Determine overall status
      const hasUnhealthyEndpoints = endpointTestsResult.data?.some(test => test.status === 'error') || false;
      const hasDegradedEndpoints = endpointTestsResult.data?.some(test => test.status === 'timeout') || false;

      let overallStatus: HealthStatus = 'healthy';
      if (apiHealthResult.data?.status === 'unhealthy' || hasUnhealthyEndpoints) {
        overallStatus = 'unhealthy';
      } else if (apiHealthResult.data?.status === 'degraded' || hasDegradedEndpoints) {
        overallStatus = 'degraded';
      }

      // Update system health
      queryClient.setQueryData(['system-health'], overallStatus);

      return { overallStatus, apiHealth: apiHealthResult.data, endpointTests: endpointTestsResult.data };
    },
    onSuccess: () => {
      message.success('Health status refreshed successfully');
    },
    onError: (error) => {
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
    checks: apiHealth || {} as HealthCheckResponse,
    isLoading: isLoadingApiHealth || runFullHealthCheckMutation.isPending,
    error: apiHealthError ? (apiHealthError instanceof Error ? apiHealthError.message : 'API health check failed') : null,
    endpointTests,
  };

  return {
    ...state,
    checkApiHealth,
    testEndpoints,
    getSystemHealth,
    runFullHealthCheck,
    refreshHealthStatus,
  };
};
