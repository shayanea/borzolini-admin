import { ApiHealthState, HealthCheckResponse, HealthStatus } from '@/types/api-health';
import { useCallback, useEffect, useState } from 'react';

import { apiHealthService } from '@/services/api-health.service';
import { message } from 'antd';

export const useApiHealth = () => {
  const [state, setState] = useState<ApiHealthState>({
    overallStatus: 'degraded',
    lastCheck: '',
    checks: {} as HealthCheckResponse,
    isLoading: false,
    error: null,
    endpointTests: [],
  });

  const checkApiHealth = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const apiHealth = await apiHealthService.checkApiHealth();
      setState(prev => ({
        ...prev,
        checks: apiHealth,
        lastCheck: new Date().toISOString(),
        isLoading: false,
      }));
      return apiHealth;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'API health check failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const testEndpoints = useCallback(async () => {
    try {
      const endpointTests = await apiHealthService.testCriticalEndpoints();
      setState(prev => ({
        ...prev,
        endpointTests,
        lastCheck: new Date().toISOString(),
      }));
      return endpointTests;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Endpoint testing failed';
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const getSystemHealth = useCallback(async (): Promise<HealthStatus> => {
    try {
      const systemHealth = await apiHealthService.getSystemHealth();
      setState(prev => ({
        ...prev,
        overallStatus: systemHealth,
        lastCheck: new Date().toISOString(),
      }));
      return systemHealth;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'System health check failed';
      setState(prev => ({
        ...prev,
        overallStatus: 'unhealthy',
        error: errorMessage,
      }));
      message.error(errorMessage);
      return 'unhealthy';
    }
  }, []);

  const runFullHealthCheck = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Run all health checks in parallel
      const [apiHealth, endpointTests] = await Promise.all([checkApiHealth(), testEndpoints()]);

      // Determine overall status
      const hasUnhealthyEndpoints = endpointTests.some(test => test.status === 'error');
      const hasDegradedEndpoints = endpointTests.some(test => test.status === 'timeout');

      let overallStatus: HealthStatus = 'healthy';
      if (apiHealth.status === 'unhealthy' || hasUnhealthyEndpoints) {
        overallStatus = 'unhealthy';
      } else if (apiHealth.status === 'degraded' || hasDegradedEndpoints) {
        overallStatus = 'degraded';
      }

      setState(prev => ({
        ...prev,
        overallStatus,
        checks: apiHealth,
        endpointTests,
        lastCheck: new Date().toISOString(),
        isLoading: false,
      }));

      return { overallStatus, apiHealth, endpointTests };
    } catch (error) {
      setState(prev => ({
        ...prev,
        overallStatus: 'unhealthy',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Health check failed',
      }));
      throw error;
    }
  }, [checkApiHealth, testEndpoints]);

  const refreshHealthStatus = useCallback(async () => {
    try {
      await runFullHealthCheck();
      message.success('Health status refreshed successfully');
    } catch (error) {
      // Error already handled in runFullHealthCheck
    }
  }, [runFullHealthCheck]);

  // Auto-refresh health status every 5 minutes
  useEffect(() => {
    const interval = window.setInterval(
      () => {
        if (!state.isLoading) {
          runFullHealthCheck();
        }
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => window.clearInterval(interval);
  }, [runFullHealthCheck, state.isLoading]);

  // Initial health check on mount
  useEffect(() => {
    runFullHealthCheck();
  }, [runFullHealthCheck]);

  return {
    ...state,
    checkApiHealth,
    testEndpoints,
    getSystemHealth,
    runFullHealthCheck,
    refreshHealthStatus,
  };
};
