import type { CalendarAppointment } from '@/types/calendar';
import { useCallback, useState } from 'react';

export const useCalendarModals = () => {
  // Modal state
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);

  // Modal actions
  const openAppointmentModal = useCallback(() => {
    setIsAppointmentModalVisible(true);
  }, []);

  const closeAppointmentModal = useCallback(() => {
    setIsAppointmentModalVisible(false);
  }, []);

  const openDetailsModal = useCallback((appointment: CalendarAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalVisible(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setIsDetailsModalVisible(false);
    setSelectedAppointment(null);
  }, []);

  return {
    // Modal state
    isAppointmentModalVisible,
    isDetailsModalVisible,
    selectedAppointment,

    // Modal actions
    openAppointmentModal,
    closeAppointmentModal,
    openDetailsModal,
    closeDetailsModal,
  };
};
