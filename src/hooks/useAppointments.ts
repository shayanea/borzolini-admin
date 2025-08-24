import { useState, useCallback, useEffect, useRef } from 'react';
import { message } from 'antd';
import type { Appointment, AppointmentStatus } from '@/types';
import type { AppointmentsFilters } from '@/types/appointments';
import AppointmentsService, {
  type CreateAppointmentData,
  type UpdateAppointmentData,
  type AppointmentStats,
} from '@/services/appointments.service';


export interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  searchText: string;
  filters: AppointmentsFilters;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  stats: AppointmentStats | null;
  statsLoading: boolean;
  handleSearch: (value: string) => void;
  handleFilters: (filters: Partial<AppointmentsFilters>) => void;
  handlePagination: (page: number, pageSize: number) => void;
  handleExport: () => Promise<void>;
  handleNewAppointment: (data: CreateAppointmentData) => Promise<Appointment>;
  handleEditAppointment: (id: string, data: UpdateAppointmentData) => Promise<Appointment>;
  handleCancelAppointment: (id: string) => Promise<void>;
  handleUpdateStatus: (id: string, status: AppointmentStatus) => Promise<Appointment>;
  handleReschedule: (id: string, newDate: string) => Promise<Appointment>;
  handleBulkUpdate: (appointmentIds: string[], updates: Partial<UpdateAppointmentData>) => Promise<Appointment[]>;
  refreshAppointments: () => void;
  refreshStats: () => void;
  clearError: () => void;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<AppointmentsFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch appointments
  const fetchAppointments = useCallback(
    async (filters: AppointmentsFilters = {}) => {
      if (!isMounted.current) return;
      
      try {
        setLoading(true);
        setError(null);

        // Convert filters to API format
        const apiFilters: any = { ...filters };
        if (filters.dateRange && filters.dateRange.length === 2) {
          apiFilters.date_from = filters.dateRange[0];
          apiFilters.date_to = filters.dateRange[1];
          delete apiFilters.dateRange;
        }

        const response = await AppointmentsService.getAll({
          ...apiFilters,
          page: pagination.current,
          limit: pagination.pageSize,
        });

        if (isMounted.current) {
          setAppointments(response.appointments);
          setPagination(prev => ({
            ...prev,
            total: response.total,
          }));
        }
      } catch (error) {
        if (isMounted.current) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load appointments';
          setError(errorMessage);
          message.error(errorMessage);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [pagination.current, pagination.pageSize]
  );

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setStatsLoading(true);
      const statsData = await AppointmentsService.getStats();
      
      if (isMounted.current) {
        setStats(statsData);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Failed to fetch stats:', error);
        // Don't show error message for stats as it's not critical
      }
    } finally {
      if (isMounted.current) {
        setStatsLoading(false);
      }
    }
  }, []);

  // Load appointments on mount and when filters change
  useEffect(() => {
    fetchAppointments(filters);
  }, [fetchAppointments, filters]);

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setFilters(prev => ({
      ...prev,
      search: value,
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const handleFilters = useCallback((newFilters: Partial<AppointmentsFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const handlePagination = useCallback((page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize,
    }));
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setError(null);
      
      const blob = await AppointmentsService.export(filters, 'csv');
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('Appointments exported successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setError(errorMessage);
      message.error(errorMessage);
    }
  }, [filters]);

  const handleNewAppointment = useCallback(async (data: CreateAppointmentData): Promise<Appointment> => {
    try {
      setError(null);
      const newAppointment = await AppointmentsService.create(data);
      
      if (isMounted.current) {
        setAppointments(prev => [newAppointment, ...prev]);
        setPagination(prev => ({ ...prev, total: prev.total + 1 }));
        message.success('Appointment created successfully');
      }
      
      return newAppointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const handleEditAppointment = useCallback(async (id: string, data: UpdateAppointmentData): Promise<Appointment> => {
    try {
      setError(null);
      const updatedAppointment = await AppointmentsService.update(id, data);
      
      if (isMounted.current) {
        setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)));
        message.success('Appointment updated successfully');
      }
      
      return updatedAppointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update appointment';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const handleCancelAppointment = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await AppointmentsService.cancel(id);
      
      if (isMounted.current) {
        setAppointments(prev =>
          prev.map(apt => (apt.id === id ? { ...apt, status: 'cancelled' as const } : apt))
        );
        message.success('Appointment cancelled successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel appointment';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const handleUpdateStatus = useCallback(async (id: string, status: AppointmentStatus): Promise<Appointment> => {
    try {
      setError(null);
      const updatedAppointment = await AppointmentsService.updateStatus(id, status);
      
      if (isMounted.current) {
        setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)));
        message.success('Appointment status updated successfully');
      }
      
      return updatedAppointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update appointment status';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const handleReschedule = useCallback(async (id: string, newDate: string): Promise<Appointment> => {
    try {
      setError(null);
      const updatedAppointment = await AppointmentsService.reschedule(id, newDate);
      
      if (isMounted.current) {
        setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)));
        message.success('Appointment rescheduled successfully');
      }
      
      return updatedAppointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reschedule appointment';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const handleBulkUpdate = useCallback(async (
    appointmentIds: string[], 
    updates: Partial<UpdateAppointmentData>
  ): Promise<Appointment[]> => {
    try {
      setError(null);
      const updatedAppointments = await AppointmentsService.bulkUpdate(appointmentIds, updates);
      
      if (isMounted.current) {
        setAppointments(prev => 
          prev.map(apt => {
            const updated = updatedAppointments.find(u => u.id === apt.id);
            return updated || apt;
          })
        );
        message.success(`${appointmentIds.length} appointments updated successfully`);
      }
      
      return updatedAppointments;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update appointments';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const refreshAppointments = useCallback(() => {
    fetchAppointments(filters);
  }, [fetchAppointments, filters]);

  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    appointments,
    loading,
    error,
    searchText,
    filters,
    pagination,
    stats,
    statsLoading,
    handleSearch,
    handleFilters,
    handlePagination,
    handleExport,
    handleNewAppointment,
    handleEditAppointment,
    handleCancelAppointment,
    handleUpdateStatus,
    handleReschedule,
    handleBulkUpdate,
    refreshAppointments,
    refreshStats,
    clearError,
  };
};
