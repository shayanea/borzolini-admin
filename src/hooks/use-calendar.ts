import {
  AppointmentsService,
  type CreateAppointmentData,
  type UpdateAppointmentData,
} from '@/services/appointments.service';
import { calendarService } from '@/services/calendar.service';
import type { CalendarAppointment, CalendarFilters, Veterinarian } from '@/types/calendar';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedVeterinarians, setSelectedVeterinarians] = useState<string[]>([]);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [fetchingAppointment, setFetchingAppointment] = useState(false);

  // Dynamic time slots based on working hours
  const [timeSlots, setTimeSlots] = useState<number[]>([]);

  // Load initial data
  useEffect(() => {
    loadVeterinarians();
    loadCalendarData();
  }, []);

  // Load calendar data when date changes
  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  // Load calendar data when filters change
  useEffect(() => {
    if (filters.veterinarianIds && filters.veterinarianIds.length > 0) {
      loadCalendarData();
    }
  }, [filters]);

  // Update time slots when working hours change
  useEffect(() => {
    if (workingHours.start && workingHours.end) {
      const startHour = parseInt(workingHours.start.split(':')[0]);
      const endHour = parseInt(workingHours.end.split(':')[0]);
      const slots = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
      setTimeSlots(slots);
    }
  }, [workingHours]);

  const loadVeterinarians = async () => {
    try {
      setLoading(true);
      const vets = await calendarService.getVeterinarians();
      setVeterinarians(vets);
      // Select all veterinarians by default
      setSelectedVeterinarians(vets.map(v => v.id));
      // Update filters with selected veterinarians
      setFilters(prev => ({ ...prev, veterinarianIds: vets.map(v => v.id) }));
    } catch (error) {
      setError('Failed to load veterinarians');
      message.error('Failed to load veterinarian list');
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare filters with current veterinarian selection
      const currentFilters: CalendarFilters = {
        ...filters,
        veterinarianIds: selectedVeterinarians.length > 0 ? selectedVeterinarians : undefined,
      };

      const calendarData = await calendarService.getCalendarData(
        currentDate.format('YYYY-MM-DD'),
        currentFilters
      );

      setAppointments(calendarData.appointments);
      setWorkingHours(calendarData.workingHours);

      // Note: Working hours are now properly set and can be used by components
      // to dynamically adjust time slots if needed
    } catch (error) {
      setError('Failed to load calendar data');
      message.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

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
    try {
      setFetchingAppointment(true);

      // Fetch full appointment details from the appointments service
      const fullAppointment = await AppointmentsService.getById(appointment.id);

      setSelectedAppointment(fullAppointment);
      setIsDetailsModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch appointment details:', error);
      message.error('Failed to load appointment details');
    } finally {
      setFetchingAppointment(false);
    }
  }, []);

  // Appointment creation using AppointmentsService
  const createAppointment = async (appointmentData: CreateAppointmentData): Promise<void> => {
    try {
      setCreatingAppointment(true);

      // Convert the data to match the appointments service format
      const appointmentRequest = {
        ...appointmentData,
        // Ensure the scheduled_date includes both date and time
        scheduled_date: appointmentData.scheduled_date,
      };

      await AppointmentsService.create(appointmentRequest);

      // Refresh calendar data to show the new appointment
      await loadCalendarData();

      // Close the modal
      setIsAppointmentModalVisible(false);

      message.success('Appointment created successfully!');
    } catch (error) {
      console.error('Failed to create appointment:', error);
      message.error('Failed to create appointment. Please try again.');
    } finally {
      setCreatingAppointment(false);
    }
  };

  // Update appointment using AppointmentsService
  const updateAppointment = async (
    appointmentId: string,
    updates: UpdateAppointmentData
  ): Promise<void> => {
    try {
      setLoading(true);
      await AppointmentsService.update(appointmentId, updates);

      // Refresh calendar data to reflect changes
      await loadCalendarData();

      // Refresh the selected appointment
      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        const updatedAppointment = await AppointmentsService.getById(appointmentId);
        setSelectedAppointment(updatedAppointment);
      }

      message.success('Appointment updated successfully!');
    } catch (error) {
      console.error('Failed to update appointment:', error);
      message.error('Failed to update appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment using AppointmentsService
  const deleteAppointment = async (appointmentId: string): Promise<void> => {
    try {
      setLoading(true);
      await AppointmentsService.cancel(appointmentId);

      // Refresh calendar data to reflect deletion
      await loadCalendarData();

      // Close the details modal
      setIsDetailsModalVisible(false);
      setSelectedAppointment(null);

      message.success('Appointment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      message.error('Failed to delete appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshCalendar = useCallback(() => {
    loadCalendarData();
  }, []);

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
    loading,
    error,
    workingHours,
    filters,

    // Modal state
    isAppointmentModalVisible,
    creatingAppointment,
    isDetailsModalVisible,
    selectedAppointment,
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
