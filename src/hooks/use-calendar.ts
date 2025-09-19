import {
  AppointmentsService,
  type CreateAppointmentData,
  type UpdateAppointmentData,
} from '@/services/appointments.service';
import { calendarService } from '@/services/calendar.service';
import type { CalendarAppointment, CalendarFilters } from '@/types/calendar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedVeterinarians, setSelectedVeterinarians] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState({ start: '08:00', end: '18:00' });

  // Enhanced filtering state
  const [filters, setFilters] = useState<CalendarFilters>({
    veterinarianIds: [],
    includeCancelled: false,
    search: '',
    priority: undefined,
    appointmentType: undefined,
    status: undefined,
    timeFrom: undefined,
    timeTo: undefined,
    isTelemedicine: undefined,
    isHomeVisit: undefined,
    sortBy: 'startTime',
    sortOrder: 'ASC',
    page: 1,
    limit: 100,
  });

  // Modal state
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const queryClient = useQueryClient();

  // Query for veterinarians
  const { data: veterinarians = [], isLoading: vetsLoading } = useQuery({
    queryKey: ['veterinarians'],
    queryFn: async () => {
      const vets = await calendarService.getVeterinarians();
      // Select all veterinarians by default
      setSelectedVeterinarians(vets.map(v => v.id));
      // Update filters with selected veterinarians
      setFilters(prev => ({ ...prev, veterinarianIds: vets.map(v => v.id) }));
      return vets;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Query for calendar data
  const {
    data: calendarData,
    isLoading: loading,
    error: queryError,
    refetch: refetchCalendarData,
  } = useQuery({
    queryKey: ['calendar-data', currentDate.format('YYYY-MM-DD'), selectedVeterinarians, filters],
    queryFn: async () => {
      // Prepare filters with current veterinarian selection
      const currentFilters: CalendarFilters = {
        ...filters,
        veterinarianIds: selectedVeterinarians.length > 0 ? selectedVeterinarians : undefined,
      };

      const data = await calendarService.getCalendarData(
        currentDate.format('YYYY-MM-DD'),
        currentFilters
      );

      // Update working hours
      setWorkingHours(data.workingHours);

      return data;
    },
    enabled: selectedVeterinarians.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for appointment details
  const { data: appointmentDetails, isLoading: fetchingAppointment } = useQuery({
    queryKey: ['appointment-details', selectedAppointment?.id],
    queryFn: async () => {
      if (!selectedAppointment?.id) return null;
      return await AppointmentsService.getById(selectedAppointment.id);
    },
    enabled: !!selectedAppointment?.id,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createAppointmentMutation = useMutation({
    mutationFn: AppointmentsService.create,
    onSuccess: () => {
      message.success('Appointment created successfully!');
      // Invalidate and refetch calendar data
      queryClient.invalidateQueries({ queryKey: ['calendar-data'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Close the modal
      setIsAppointmentModalVisible(false);
    },
    onError: error => {
      console.error('Failed to create appointment:', error);
      message.error('Failed to create appointment. Please try again.');
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({
      appointmentId,
      updates,
    }: {
      appointmentId: string;
      updates: UpdateAppointmentData;
    }) => AppointmentsService.update(appointmentId, updates),
    onSuccess: () => {
      message.success('Appointment updated successfully!');
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['calendar-data'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-details'] });
    },
    onError: error => {
      console.error('Failed to update appointment:', error);
      message.error('Failed to update appointment. Please try again.');
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: AppointmentsService.cancel,
    onSuccess: () => {
      message.success('Appointment deleted successfully!');
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['calendar-data'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Close the details modal
      setIsDetailsModalVisible(false);
      setSelectedAppointment(null);
    },
    onError: error => {
      console.error('Failed to delete appointment:', error);
      message.error('Failed to delete appointment. Please try again.');
    },
  });

  // Dynamic time slots based on working hours
  const timeSlots = (() => {
    if (workingHours.start && workingHours.end) {
      const startHour = parseInt(workingHours.start.split(':')[0]);
      const endHour = parseInt(workingHours.end.split(':')[0]);
      return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
    }
    return [];
  })();

  // Extract data from queries
  const appointments = useMemo(
    () => calendarData?.appointments || [],
    [calendarData?.appointments]
  );
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : 'Failed to load calendar data'
    : null;

  const goToPreviousDay = useCallback(() => {
    setCurrentDate(currentDate.subtract(1, 'day'));
  }, [currentDate]);

  const goToNextDay = useCallback(() => {
    setCurrentDate(currentDate.add(1, 'day'));
  }, [currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(dayjs());
  }, []);

  const toggleVeterinarian = useCallback((vetId: string) => {
    setSelectedVeterinarians(prev =>
      prev.includes(vetId) ? prev.filter(id => id !== vetId) : [...prev, vetId]
    );
  }, []);

  const toggleAllVeterinarians = useCallback(() => {
    setSelectedVeterinarians(
      selectedVeterinarians.length === veterinarians.length ? [] : veterinarians.map(v => v.id)
    );
  }, [selectedVeterinarians.length, veterinarians]);

  const addNewCalendar = useCallback(() => {
    console.log('Add new calendar clicked');
  }, []);

  const getAppointmentsForTimeAndVet = useCallback(
    (time: number, vetId: string) => {
      return appointments.filter(apt => {
        const startHour = parseInt(apt.startTime.split(':')[0]);
        const vet = veterinarians.find(v => v.id === vetId);
        return startHour === time && vet?.name === apt.veterinarian;
      });
    },
    [appointments, veterinarians]
  );

  const handleFilters = useCallback(() => {
    console.log('Filters clicked');
  }, []);

  // Enhanced filter handling
  const handleFiltersChange = useCallback((newFilters: Partial<CalendarFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  const handleSearch = useCallback((searchText: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchText,
      page: 1, // Reset to first page when search changes
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      veterinarianIds: selectedVeterinarians,
      includeCancelled: false,
      search: '',
      priority: undefined,
      appointmentType: undefined,
      status: undefined,
      timeFrom: undefined,
      timeTo: undefined,
      isTelemedicine: undefined,
      isHomeVisit: undefined,
      sortBy: 'startTime',
      sortOrder: 'ASC',
      page: 1,
      limit: 100,
    });
  }, [selectedVeterinarians]);

  const handleNewAppointment = useCallback(() => {
    setIsAppointmentModalVisible(true);
  }, []);

  // Handle appointment click to show details
  const handleAppointmentClick = useCallback(async (appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalVisible(true);
  }, []);

  // Appointment creation using AppointmentsService
  const createAppointment = async (appointmentData: CreateAppointmentData): Promise<void> => {
    // Convert the data to match the appointments service format
    const appointmentRequest = {
      ...appointmentData,
      // Ensure the scheduled_date includes both date and time
      scheduled_date: appointmentData.scheduled_date,
    };

    await createAppointmentMutation.mutateAsync(appointmentRequest);
  };

  // Update appointment using AppointmentsService
  const updateAppointment = async (
    appointmentId: string,
    updates: UpdateAppointmentData
  ): Promise<void> => {
    await updateAppointmentMutation.mutateAsync({ appointmentId, updates });
  };

  // Delete appointment using AppointmentsService
  const deleteAppointment = async (appointmentId: string): Promise<void> => {
    await deleteAppointmentMutation.mutateAsync(appointmentId);
  };

  const refreshCalendar = useCallback(() => {
    refetchCalendarData();
  }, [refetchCalendarData]);

  const closeAppointmentModal = useCallback(() => {
    setIsAppointmentModalVisible(false);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(false);
    setSelectedAppointment(null);
  }, []);

  return {
    // State
    currentDate,
    selectedVeterinarians,
    timeSlots,
    veterinarians,
    appointments,
    loading: loading || vetsLoading,
    error,
    workingHours,
    filters,

    // Modal state
    isAppointmentModalVisible,
    creatingAppointment: createAppointmentMutation.isPending,
    isDetailsModalVisible,
    selectedAppointment: appointmentDetails || selectedAppointment,
    fetchingAppointment,

    // Navigation
    goToPreviousDay,
    goToNextDay,
    goToToday,

    // Veterinarian management
    toggleVeterinarian,
    toggleAllVeterinarians,
    addNewCalendar,

    // Appointment data
    getAppointmentsForTimeAndVet,

    // Actions
    handleFilters,
    handleNewAppointment,
    handleAppointmentClick,

    // Enhanced filtering
    handleFiltersChange,
    handleSearch,
    clearFilters,

    // Appointment management
    createAppointment,
    updateAppointment,
    deleteAppointment,

    // Modal actions
    closeAppointmentModal,
    closeDetailsModal,

    // Utilities
    refreshCalendar,
  };
};
