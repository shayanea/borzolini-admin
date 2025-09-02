export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: HealthCheck;
    api: HealthCheck;
    cache: HealthCheck;
    external: HealthCheck[];
  };
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastChecked: string;
  error?: string;
  details?: Record<string, any>;
}

export interface EndpointStatus {
  url: string;
  method: string;
  status: 'success' | 'error' | 'timeout';
  responseTime: number;
  lastChecked: string;
  error?: string;
  statusCode?: number;
}

export interface ApiHealthState {
  overallStatus: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: string;
  checks: HealthCheckResponse;
  isLoading: boolean;
  error: string | null;
  endpointTests: EndpointStatus[];
}

export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded';

export interface AnalyticsHealth {
  status: 'ok' | 'healthy' | 'degraded' | 'error';
  error?: string;
  timestamp?: string;
  analytics?: boolean; // health endpoint may include this flag
}

export interface AnalyticsStatus {
  enabled?: boolean;
  configured?: boolean;
  websiteId?: string;
  apiUrl?: string;
}
