import React from 'react';
import { Card } from 'antd';
import { useCalendar } from '@/hooks/useCalendar';
import {
  CalendarHeader,
  CalendarNavigation,
  VeterinarianSelection,
  CalendarGrid,
} from '@/components/calendar';

const Calendar: React.FC = () => {
  const {
    currentDate,
    selectedVeterinarians,
    timeSlots,
    veterinarians,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    toggleVeterinarian,
    toggleAllVeterinarians,
    addNewCalendar,
    getAppointmentsForTimeAndVet,
    handleFilters,
    handleNewAppointment,
  } = useCalendar();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <CalendarHeader
        onFilters={handleFilters}
        onNewAppointment={handleNewAppointment}
      />

      {/* Calendar */}
      <Card className="admin-card">
        {/* Calendar Navigation */}
        <CalendarNavigation
          currentDate={currentDate}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onToday={goToToday}
        />

        {/* Veterinarian Selection */}
        <VeterinarianSelection
          veterinarians={veterinarians}
          selectedVeterinarians={selectedVeterinarians}
          onToggleVeterinarian={toggleVeterinarian}
          onToggleAll={toggleAllVeterinarians}
          onAddNew={addNewCalendar}
        />

        {/* Calendar Grid */}
        <CalendarGrid
          veterinarians={veterinarians}
          timeSlots={timeSlots}
          getAppointmentsForTimeAndVet={getAppointmentsForTimeAndVet}
        />
      </Card>
    </div>
  );
};

export default Calendar;
