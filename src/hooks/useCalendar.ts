import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import type { Veterinarian, CalendarAppointment } from '@/types/calendar';

// Mock data - replace with actual API calls
const mockAppointments: CalendarAppointment[] = [
  {
    id: '1',
    clientName: 'Diego Rossi',
    petName: 'Bella',
    petType: 'Dog',
    startTime: '7:30',
    endTime: '8:20',
    veterinarian: 'Dr. Alfhard Botwright',
    veterinarianInitials: 'AB',
    color: 'appointment-purple',
  },
  {
    id: '2',
    clientName: 'Isabella Bianchi',
    petName: 'Oscar',
    petType: 'Turtle',
    startTime: '7:30',
    endTime: '8:50',
    veterinarian: 'Dr. Faramund Eks',
    veterinarianInitials: 'FE',
    color: 'appointment-yellow',
  },
  {
    id: '3',
    clientName: 'Stefan Müller',
    petName: '',
    petType: '',
    startTime: '9:00',
    endTime: '10:00',
    veterinarian: 'Dr. Alfhard Botwright',
    veterinarianInitials: 'AB',
    color: 'appointment-blue',
  },
  {
    id: '4',
    clientName: 'Sofia Fernandez',
    petName: 'Rocky',
    petType: 'Dog',
    startTime: '9:00',
    endTime: '10:00',
    veterinarian: 'Dr. Faramund Eks',
    veterinarianInitials: 'FE',
    color: 'appointment-purple',
  },
  {
    id: '5',
    clientName: 'Oliver Jensen',
    petName: 'Milo',
    petType: 'Cat',
    startTime: '9:00',
    endTime: '9:40',
    veterinarian: 'Dr. Eysteinn Bushe',
    veterinarianInitials: 'EB',
    color: 'appointment-orange',
  },
  {
    id: '6',
    clientName: 'Mateo Costa',
    petName: 'Duke',
    petType: 'Dog',
    startTime: '9:00',
    endTime: '10:00',
    veterinarian: 'Dr. Jacob Stellwagen',
    veterinarianInitials: 'JS',
    color: 'appointment-pink',
  },
];

const mockVeterinarians: Veterinarian[] = [
  { id: '1', name: 'Dr. Alfhard Botwright', initials: 'AB' },
  { id: '2', name: 'Dr. Faramund Eks', initials: 'FE' },
  { id: '3', name: 'Dr. Eysteinn Bushe', initials: 'EB' },
  { id: '4', name: 'Dr. Jacob Stellwagen', initials: 'JS' },
  { id: '5', name: 'Dr. Justin Brandler', initials: 'JB' },
  { id: '6', name: 'Dr. Faramund De Grootd', initials: 'FD' },
];

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs('2023-05-23'));
  const [selectedVeterinarians, setSelectedVeterinarians] = useState<string[]>(['1', '2', '3', '4', '5', '6']);

  const timeSlots = Array.from({ length: 6 }, (_, i) => 8 + i); // 8 AM to 1 PM

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
      prev.includes(vetId)
        ? prev.filter(id => id !== vetId)
        : [...prev, vetId]
    );
  }, []);

  const toggleAllVeterinarians = useCallback(() => {
    setSelectedVeterinarians(
      selectedVeterinarians.length === mockVeterinarians.length ? [] : mockVeterinarians.map(v => v.id)
    );
  }, [selectedVeterinarians.length]);

  const addNewCalendar = useCallback(() => {
    console.log('Add new calendar clicked');
  }, []);

  const getAppointmentsForTimeAndVet = useCallback((time: number, vetId: string) => {
    return mockAppointments.filter(apt => {
      const startHour = parseInt(apt.startTime.split(':')[0]);
      return startHour === time && mockVeterinarians.find(v => v.id === vetId)?.name === apt.veterinarian;
    });
  }, []);

  const handleFilters = useCallback(() => {
    console.log('Filters clicked');
  }, []);

  const handleNewAppointment = useCallback(() => {
    console.log('New appointment clicked');
  }, []);

  return {
    currentDate,
    selectedVeterinarians,
    timeSlots,
    veterinarians: mockVeterinarians,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    toggleVeterinarian,
    toggleAllVeterinarians,
    addNewCalendar,
    getAppointmentsForTimeAndVet,
    handleFilters,
    handleNewAppointment,
  };
};
