import {
  AppointmentsService,
  type CreateAppointmentData,
  type UpdateAppointmentData,
} from '@/services/appointments';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useCalendarMutations = () => {
  const queryClient = useQueryClient();

  // Mutations
  const createAppointmentMutation = useMutation({
    mutationFn: AppointmentsService.create,
    onSuccess: () => {
      message.success('Appointment created successfully!');
      // Invalidate and refetch calendar data
      queryClient.invalidateQueries({ queryKey: ['calendar-data'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
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
    },
    onError: error => {
      console.error('Failed to delete appointment:', error);
      message.error('Failed to delete appointment. Please try again.');
    },
  });

  // Appointment management functions
  const createAppointment = async (appointmentData: CreateAppointmentData): Promise<void> => {
    // Convert the data to match the appointments service format
    const appointmentRequest = {
      ...appointmentData,
      // Ensure the scheduled_date includes both date and time
      scheduled_date: appointmentData.scheduled_date,
    };

    await createAppointmentMutation.mutateAsync(appointmentRequest);
  };

  const updateAppointment = async (
    appointmentId: string,
    updates: UpdateAppointmentData
  ): Promise<void> => {
    await updateAppointmentMutation.mutateAsync({ appointmentId, updates });
  };

  const deleteAppointment = async (appointmentId: string): Promise<void> => {
    await deleteAppointmentMutation.mutateAsync(appointmentId);
  };

  return {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    creatingAppointment: createAppointmentMutation.isPending,
    updatingAppointment: updateAppointmentMutation.isPending,
    deletingAppointment: deleteAppointmentMutation.isPending,
  };
};
