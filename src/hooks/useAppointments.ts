import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import type { Appointment, AppointmentStatus } from '@/types';
import type { AppointmentsFilters } from '@/types/appointments';
import AppointmentsService, {
  type CreateAppointmentData,
  type UpdateAppointmentData,
} from '@/services/appointments.service';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<AppointmentsFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch appointments
  const fetchAppointments = useCallback(
    async (filters: AppointmentsFilters = {}) => {
      try {
        setLoading(true);

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

        setAppointments(response.appointments);
        setPagination(prev => ({
          ...prev,
          total: response.total,
        }));
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        message.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize]
  );

  // Load appointments on mount and when filters change
  useEffect(() => {
    fetchAppointments(filters);
  }, [fetchAppointments, filters]);

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
      message.info('Export functionality coming soon');
      // TODO: Implement export functionality
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Export failed');
    }
  }, []);

  const handleNewAppointment = useCallback(async (data: CreateAppointmentData) => {
    try {
      const newAppointment = await AppointmentsService.create(data);
      setAppointments(prev => [newAppointment, ...prev]);
      message.success('Appointment created successfully');
      return newAppointment;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      message.error('Failed to create appointment');
      throw error;
    }
  }, []);

  const handleEditAppointment = useCallback(async (id: string, data: UpdateAppointmentData) => {
    try {
      const updatedAppointment = await AppointmentsService.update(id, data);
      setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)));
      message.success('Appointment updated successfully');
      return updatedAppointment;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      message.error('Failed to update appointment');
      throw error;
    }
  }, []);

  const handleCancelAppointment = useCallback(async (id: string) => {
    try {
      await AppointmentsService.cancel(id);
      setAppointments(prev =>
        prev.map(apt => (apt.id === id ? { ...apt, status: 'cancelled' as const } : apt))
      );
      message.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      message.error('Failed to cancel appointment');
      throw error;
    }
  }, []);

  const handleUpdateStatus = useCallback(async (id: string, status: AppointmentStatus) => {
    try {
      const updatedAppointment = await AppointmentsService.updateStatus(id, status);
      setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)));
      message.success('Appointment status updated successfully');
      return updatedAppointment;
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      message.error('Failed to update appointment status');
      throw error;
    }
  }, []);

  const handleReschedule = useCallback(async (id: string, newDate: string) => {
    try {
      const updatedAppointment = await AppointmentsService.reschedule(id, newDate);
      setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)));
      message.success('Appointment rescheduled successfully');
      return updatedAppointment;
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      message.error('Failed to reschedule appointment');
      throw error;
    }
  }, []);

  const refreshAppointments = useCallback(() => {
    fetchAppointments(filters);
  }, [fetchAppointments, filters]);

  return {
    appointments,
    loading,
    searchText,
    filters,
    pagination,
    handleSearch,
    handleFilters,
    handlePagination,
    handleExport,
    handleNewAppointment,
    handleEditAppointment,
    handleCancelAppointment,
    handleUpdateStatus,
    handleReschedule,
    refreshAppointments,
  };
};
