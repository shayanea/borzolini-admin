import React, { useState } from 'react';
import { Card, Typography, Button, Space, Avatar } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Mock data - replace with actual API calls
const mockAppointments = [
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

const mockVeterinarians = [
  { id: '1', name: 'Dr. Alfhard Botwright', initials: 'AB' },
  { id: '2', name: 'Dr. Faramund Eks', initials: 'FE' },
  { id: '3', name: 'Dr. Eysteinn Bushe', initials: 'EB' },
  { id: '4', name: 'Dr. Jacob Stellwagen', initials: 'JS' },
  { id: '5', name: 'Dr. Justin Brandler', initials: 'JB' },
  { id: '6', name: 'Dr. Faramund De Grootd', initials: 'FD' },
];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs('2023-05-23'));
  const [selectedVeterinarians, setSelectedVeterinarians] = useState<string[]>(['1', '2', '3', '4', '5', '6']);

  const timeSlots = Array.from({ length: 6 }, (_, i) => 8 + i); // 8 AM to 1 PM

  const goToPreviousDay = () => {
    setCurrentDate(currentDate.subtract(1, 'day'));
  };

  const goToNextDay = () => {
    setCurrentDate(currentDate.add(1, 'day'));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  const toggleVeterinarian = (vetId: string) => {
    setSelectedVeterinarians(prev =>
      prev.includes(vetId)
        ? prev.filter(id => id !== vetId)
        : [...prev, vetId]
    );
  };

  const getAppointmentsForTimeAndVet = (time: number, vetId: string) => {
    return mockAppointments.filter(apt => {
      const startHour = parseInt(apt.startTime.split(':')[0]);
      return startHour === time && mockVeterinarians.find(v => v.id === vetId)?.name === apt.veterinarian;
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Calendar
          </Title>
          <Text className="text-text-light">
            Manage appointments and schedules
          </Text>
        </div>
        
        <Space>
          <Button icon={<CalendarOutlined />}>
            Filters
          </Button>
          <Button type="primary" className="bg-primary-navy border-primary-navy">
            + New Appointment
          </Button>
        </Space>
      </div>

      {/* Calendar Navigation */}
      <Card className="admin-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              icon={<LeftOutlined />}
              onClick={goToPreviousDay}
              className="border-gray-300"
            />
            <Title level={3} className="!mb-0">
              {currentDate.format('MMMM D, YYYY')}
            </Title>
            <Button
              icon={<RightOutlined />}
              onClick={goToNextDay}
              className="border-gray-300"
            />
            <Button onClick={goToToday} className="text-primary-navy border-primary-navy">
              Today
            </Button>
          </div>
        </div>

        {/* Veterinarian Selection */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Text strong>My Calendars:</Text>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedVeterinarians.length === mockVeterinarians.length}
                onChange={() => setSelectedVeterinarians(
                  selectedVeterinarians.length === mockVeterinarians.length ? [] : mockVeterinarians.map(v => v.id)
                )}
                className="mr-2"
              />
              <Text>All</Text>
            </div>
            <Button type="link" className="!p-0 !h-auto text-primary-orange">
              + Add new
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Text strong>Vet Calendars:</Text>
            <div className="flex items-center space-x-4">
              {mockVeterinarians.map(vet => (
                <div key={vet.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedVeterinarians.includes(vet.id)}
                    onChange={() => toggleVeterinarian(vet.id)}
                    className="mr-2"
                  />
                  <Text>{vet.name}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
              <div className="p-3 bg-gray-50 font-medium text-gray-600">
                Time
              </div>
              {mockVeterinarians.map(vet => (
                <div key={vet.id} className="p-3 bg-gray-50 font-medium text-gray-600 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <Avatar
                      size={32}
                      className="bg-primary-navy text-white font-medium"
                    >
                      {vet.initials}
                    </Avatar>
                    <Text className="text-xs">{vet.name.split(' ').slice(-1)[0]}</Text>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-7 gap-0 border-b border-gray-200 min-h-[60px]">
                {/* Time Column */}
                <div className="p-3 bg-gray-50 text-sm text-gray-600 font-medium border-r border-gray-200">
                  {time === 8 ? '8:00 AM' : time === 12 ? '12:00 PM' : `${time}:00 ${time < 12 ? 'AM' : 'PM'}`}
                </div>

                {/* Veterinarian Columns */}
                {mockVeterinarians.map(vet => {
                  const appointments = getAppointmentsForTimeAndVet(time, vet.id);
                  return (
                    <div key={vet.id} className="p-2 border-r border-gray-200 relative">
                      {appointments.map(apt => (
                        <div
                          key={apt.id}
                          className={`${apt.color} calendar-appointment mb-1 cursor-pointer hover:opacity-90 transition-opacity`}
                        >
                          <div className="font-medium text-sm">{apt.clientName}</div>
                          {apt.petName && (
                            <div className="text-xs opacity-90">
                              {apt.petName} ({apt.petType})
                            </div>
                          )}
                          <div className="text-xs opacity-90">
                            {apt.startTime} - {apt.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;
