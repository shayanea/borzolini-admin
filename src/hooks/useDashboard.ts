import { useCallback, useEffect, useState } from 'react';

import type { DashboardFilters } from '@/types/dashboard';
import DashboardService from '@/services/dashboard.service';
import type { DashboardStats } from '@/types';
import { message } from 'antd';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DashboardService.getDashboardStats(filters);
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDateRangeChange = useCallback((dates: any) => {
    if (dates) {
      setFilters(prev => ({
        ...prev,
        dateRange: [dates[0].toISOString(), dates[1].toISOString()],
      }));
    } else {
      setFilters(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dateRange, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleRefresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    loading,
    error,
    filters,
    handleDateRangeChange,
    handleClearFilters,
    handleRefresh,
  };
};
