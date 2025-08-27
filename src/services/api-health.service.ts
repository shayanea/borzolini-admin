import { EndpointStatus, HealthCheckResponse, HealthStatus } from '@/types/api-health';

import { apiService } from './api';
import { environment } from '@/config/environment';

export class ApiHealthService {
  private static instance: ApiHealthService;

  private constructor() {}

  public static getInstance(): ApiHealthService {
    if (!ApiHealthService.instance) {
      ApiHealthService.instance = new ApiHealthService();
    }
    return ApiHealthService.instance;
  }

  /**
   * Check database health status
   */
  async checkDatabaseHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await apiService.get<HealthCheckResponse>('/health/database');
      return response;
    } catch (error) {
      throw new Error(
        `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Test API endpoint health
   */
  async testEndpoint(url: string, method: string = 'GET'): Promise<EndpointStatus> {
    const startTime = Date.now();
    const lastChecked = new Date().toISOString();

    try {
      switch (method.toUpperCase()) {
        case 'GET':
          await apiService.get(url);
          break;
        case 'POST':
          await apiService.post(url, {});
          break;
        case 'PUT':
          await apiService.put(url, {});
          break;
        case 'DELETE':
          await apiService.delete(url);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      const responseTime = Date.now() - startTime;

      return {
        url,
        method: method.toUpperCase(),
        status: 'success',
        responseTime,
        lastChecked,
        statusCode: 200,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const statusCode = error.response?.status || 0;

      return {
        url,
        method: method.toUpperCase(),
        status: statusCode >= 500 ? 'error' : 'timeout',
        responseTime,
        lastChecked,
        error: error.message || 'Request failed',
        statusCode,
      };
    }
  }

  /**
   * Test multiple endpoints for health monitoring
   */
  async testEndpoints(): Promise<EndpointStatus[]> {
    const endpoints = [
      { url: '/appointments', method: 'GET' },
      { url: '/users', method: 'GET' },
      { url: '/clinics', method: 'GET' },
      { url: '/calendar', method: 'GET' },
      { url: '/dashboard', method: 'GET' },
    ];

    const results: EndpointStatus[] = [];

    for (const endpoint of endpoints) {
      try {
        const result = await this.testEndpoint(endpoint.url, endpoint.method);
        results.push(result);
      } catch (error) {
        results.push({
          url: endpoint.url,
          method: endpoint.method,
          status: 'error',
          responseTime: 0,
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Get overall system health status
   */
  async getSystemHealth(): Promise<HealthStatus> {
    try {
      const dbHealth = await this.checkDatabaseHealth();
      const endpointTests = await this.testEndpoints();

      // Determine overall status based on database and endpoint health
      const hasUnhealthyEndpoints = endpointTests.some(test => test.status === 'error');
      const hasDegradedEndpoints = endpointTests.some(test => test.status === 'timeout');

      if (dbHealth.status === 'unhealthy' || hasUnhealthyEndpoints) {
        return 'unhealthy';
      } else if (dbHealth.status === 'degraded' || hasDegradedEndpoints) {
        return 'degraded';
      }

      return 'healthy';
    } catch (error) {
      return 'unhealthy';
    }
  }

  /**
   * Get cache status information
   */
  async getCacheStatus(): Promise<Record<string, any>> {
    try {
      // This would typically call a cache health endpoint
      // For now, return basic cache info
      return {
        appointments: { size: 0, ttl: environment.cache.appointments.ttl },
        users: { size: 0, ttl: environment.cache.users.ttl },
        calendar: { size: 0, ttl: environment.cache.calendar.ttl },
      };
    } catch (error) {
      return {
        error: 'Unable to retrieve cache status',
      };
    }
  }
}

export const apiHealthService = ApiHealthService.getInstance();
