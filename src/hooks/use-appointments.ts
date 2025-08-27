import AppointmentsService, {
  type AppointmentStats,
  type CreateAppointmentData,
  type UpdateAppointmentData,
} from '@/services/appointments.service';
import { useAuthStore } from '@/stores/auth.store';
import type { Appointment, AppointmentStatus } from '@/types';
import type { AppointmentsFilters } from '@/types/appointments';
import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  handleBulkUpdate: (
    appointmentIds: string[],
    updates: Partial<UpdateAppointmentData>
  ) => Promise<Appointment[]>;
  refreshAppointments: () => void;
  refreshStats: () => void;
  clearError: () => void;
}

export const useAppointments = (): UseAppointmentsReturn => {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<AppointmentsFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Get authentication state from the store
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const queryClient = useQueryClient();

  // Convert filters to API format
  const getApiFilters = useCallback(() => {
    const apiFilters: any = { ...filters };
    if (filters.dateRange && filters.dateRange.length === 2) {
      apiFilters.date_from = filters.dateRange[0];
      apiFilters.date_to = filters.dateRange[1];
      delete apiFilters.dateRange;
    }
    return apiFilters;
  }, [filters]);

  // Query for appointments
  const {
    data: appointmentsData,
    isLoading: loading,
    error: queryError,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ['appointments', filters, pagination.current, pagination.pageSize],
    queryFn: async () => {
      if (!isAuthenticated) return { appointments: [], total: 0 };
      
      const apiFilters = getApiFilters();
      const response = await AppointmentsService.getAll({
        ...apiFilters,
        page: pagination.current,
        limit: pagination.pageSize,
      });
      
      // Update pagination total
      setPagination(prev => ({ ...prev, total: response.total }));
      
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query for appointment stats
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['appointment-stats'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      return await AppointmentsService.getStats();
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createAppointmentMutation = useMutation({
    mutationFn: AppointmentsService.create,
    onSuccess: () => {
      message.success('Appointment created successfully');
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
      message.error(errorMessage);
      throw error;
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentData }) =>
      AppointmentsService.update(id, data),
    onSuccess: () => {
      message.success('Appointment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update appointment';
      message.error(errorMessage);
      throw error;
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: AppointmentsService.cancel,
    onSuccess: () => {
      message.success('Appointment cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel appointment';
      message.error(errorMessage);
      throw error;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      AppointmentsService.updateStatus(id, status),
    onSuccess: () => {
      message.success('Appointment status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update appointment status';
      message.error(errorMessage);
      throw error;
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, newDate }: { id: string; newDate: string }) =>
      AppointmentsService.reschedule(id, newDate),
    onSuccess: () => {
      message.success('Appointment rescheduled successfully');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reschedule appointment';
      message.error(errorMessage);
      throw error;
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ appointmentIds, updates }: { appointmentIds: string[]; updates: Partial<UpdateAppointmentData> }) =>
      AppointmentsService.bulkUpdate(appointmentIds, updates),
    onSuccess: (_, { appointmentIds }) => {
      message.success(`${appointmentIds.length} appointments updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update appointments';
      message.error(errorMessage);
      throw error;
    },
  });

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
      const apiFilters = getApiFilters();
      const blob = await AppointmentsService.export(apiFilters, 'csv');

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
      message.error(errorMessage);
      throw error;
    }
  }, [getApiFilters]);

  const handleNewAppointment = useCallback(
    async (data: CreateAppointmentData): Promise<Appointment> => {
      return await createAppointmentMutation.mutateAsync(data);
    },
    [createAppointmentMutation]
  );

  const handleEditAppointment = useCallback(
    async (id: string, data: UpdateAppointmentData): Promise<Appointment> => {
      return await updateAppointmentMutation.mutateAsync({ id, data });
    },
    [updateAppointmentMutation]
  );

  const handleCancelAppointment = useCallback(async (id: string): Promise<void> => {
    await cancelAppointmentMutation.mutateAsync(id);
  }, [cancelAppointmentMutation]);

  const handleUpdateStatus = useCallback(
    async (id: string, status: AppointmentStatus): Promise<Appointment> => {
      return await updateStatusMutation.mutateAsync({ id, status });
    },
    [updateStatusMutation]
  );

  const handleReschedule = useCallback(
    async (id: string, newDate: string): Promise<Appointment> => {
      return await rescheduleMutation.mutateAsync({ id, newDate });
    },
    [rescheduleMutation]
  );

  const handleBulkUpdate = useCallback(
    async (
      appointmentIds: string[],
      updates: Partial<UpdateAppointmentData>
    ): Promise<Appointment[]> => {
      return await bulkUpdateMutation.mutateAsync({ appointmentIds, updates });
    },
    [bulkUpdateMutation]
  );

  const refreshAppointments = useCallback(() => {
    refetchAppointments();
  }, [refetchAppointments]);

  const refreshStats = useCallback(() => {
    refetchStats();
  }, [refetchStats]);

  const clearError = useCallback(() => {
    // React Query handles errors automatically
  }, []);

  // Extract data from queries
  const appointments = appointmentsData?.appointments || [];
  const error = queryError ? (queryError instanceof Error ? queryError.message : 'An error occurred') : null;

  return {
    appointments,
    loading,
    error,
    searchText,
    filters,
    pagination,
    stats: stats || null,
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
