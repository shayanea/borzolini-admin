import { AppointmentsService } from '@/services/appointments';
import type { CalendarAppointment } from '@/types/calendar';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useCalendarData } from './use-calendar-data';
import { useCalendarFilters } from './use-calendar-filters';
import { useCalendarModals } from './use-calendar-modals';
import { useCalendarMutations } from './use-calendar-mutations';
import { useCalendarNavigation } from './use-calendar-navigation';
import { useCalendarVeterinarians } from './use-calendar-veterinarians';

export const useCalendar = () => {
  // Use specialized hooks
  const navigation = useCalendarNavigation();
  const veterinarians = useCalendarVeterinarians();
  const filters = useCalendarFilters(veterinarians.selectedVeterinarians);
  const data = useCalendarData(
    navigation.currentDate,
    veterinarians.selectedVeterinarians,
    filters.filters
  );
  const modals = useCalendarModals();
  const mutations = useCalendarMutations();

  // Query for appointment details when modal is open
  const { data: appointmentDetails, isLoading: fetchingAppointment } = useQuery({
    queryKey: ['appointment-details', modals.selectedAppointment?.id],
    queryFn: async () => {
      if (!modals.selectedAppointment?.id) return null;
      return await AppointmentsService.getById(modals.selectedAppointment.id);
    },
    enabled: !!modals.selectedAppointment?.id,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize selected veterinarians when veterinarians data loads
  useMemo(() => {
    if (data.veterinarians.length > 0 && veterinarians.selectedVeterinarians.length === 0) {
      // This is a bit of a hack - we need to update the selected veterinarians state
      // The proper way would be to have this logic in a useEffect in the veterinarians hook
      veterinarians.toggleAllVeterinarians(data.veterinarians);
    }
  }, [data.veterinarians, veterinarians]);

  const getAppointmentsForTimeAndVet = useCallback(
    (time: number, vetId: string) => {
      return data.appointments.filter(apt => {
        const startHour = parseInt(apt.startTime.split(':')[0]);
        const vet = data.veterinarians.find(v => v.id === vetId);
        return startHour === time && vet?.name === apt.veterinarian;
      });
    },
    [data.appointments, data.veterinarians]
  );

  const handleFilters = useCallback(() => {
    console.log('Filters clicked');
  }, []);

  const handleNewAppointment = useCallback(() => {
    modals.openAppointmentModal();
  }, [modals]);

  // Handle appointment click to show details
  const handleAppointmentClick = useCallback(
    (appointment: CalendarAppointment) => {
      modals.openDetailsModal(appointment);
    },
    [modals]
  );

  return {
    // State
    currentDate: navigation.currentDate,
    selectedVeterinarians: veterinarians.selectedVeterinarians,
    timeSlots: data.timeSlots,
    veterinarians: data.veterinarians,
    appointments: data.appointments,
    loading: data.isLoading,
    error: data.error,
    filters: filters.filters,

    // Modal state
    isAppointmentModalVisible: modals.isAppointmentModalVisible,
    creatingAppointment: mutations.creatingAppointment,
    isDetailsModalVisible: modals.isDetailsModalVisible,
    selectedAppointment: appointmentDetails || modals.selectedAppointment,
    fetchingAppointment,

    // Navigation
    goToPreviousDay: navigation.goToPreviousDay,
    goToNextDay: navigation.goToNextDay,
    goToToday: navigation.goToToday,

    // Veterinarian management
    toggleVeterinarian: veterinarians.toggleVeterinarian,
    toggleAllVeterinarians: (vets: Array<{ id: string }>) =>
      veterinarians.toggleAllVeterinarians(vets),
    addNewCalendar: veterinarians.addNewCalendar,

    // Appointment data
    getAppointmentsForTimeAndVet,

    // Actions
    handleFilters,
    handleNewAppointment,
    handleAppointmentClick,

    // Enhanced filtering
    handleFiltersChange: filters.handleFiltersChange,
    handleSearch: filters.handleSearch,
    clearFilters: filters.clearFilters,

    // Appointment management
    createAppointment: mutations.createAppointment,
    updateAppointment: mutations.updateAppointment,
    deleteAppointment: mutations.deleteAppointment,

    // Modal actions
    closeAppointmentModal: modals.closeAppointmentModal,
    closeDetailsModal: modals.closeDetailsModal,

    // Utilities
    refreshCalendar: data.refetchCalendarData,
  };
};
