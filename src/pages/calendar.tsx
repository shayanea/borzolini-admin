import {
  AppointmentDetailsModal,
  AppointmentFormModal,
  CalendarFilters,
  CalendarGrid,
  CalendarHeader,
  CalendarNavigation,
  VeterinarianSelection,
} from '@/components/calendar';

import { useCalendar } from '@/hooks/use-calendar';

const CalendarPage = () => {
  const {
    // State
    currentDate,
    selectedVeterinarians,
    timeSlots,
    veterinarians,
    appointments,
    loading,
    error,
    filters,

    // Modal state
    isAppointmentModalVisible,
    creatingAppointment,
    isDetailsModalVisible,
    selectedAppointment,

    // Navigation
    goToPreviousDay,
    goToNextDay,
    goToToday,

    // Veterinarian management
    toggleVeterinarian,
    toggleAllVeterinarians,
    addNewCalendar,

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
  } = useCalendar();

  if (error) {
    return (
      <div className='p-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <h3 className='text-red-800 font-medium'>Error Loading Calendar</h3>
          <p className='text-red-600 mt-1'>{error}</p>
          <button
            onClick={refreshCalendar}
            className='mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <CalendarHeader onNewAppointment={handleNewAppointment} onFilters={handleFilters} />

      {/* Navigation */}
      <CalendarNavigation
        currentDate={currentDate}
        onPreviousDay={goToPreviousDay}
        onNextDay={goToNextDay}
        onToday={goToToday}
      />

      {/* Enhanced Calendar Filters */}
      <CalendarFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
        onSearch={handleSearch}
        searchText={filters.search || ''}
        loading={loading}
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
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy'></div>
        </div>
      ) : (
        <CalendarGrid
          timeSlots={timeSlots}
          veterinarians={veterinarians}
          appointments={appointments}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      {/* Appointment Form Modal */}
      <AppointmentFormModal
        visible={isAppointmentModalVisible}
        onCancel={closeAppointmentModal}
        onSubmit={createAppointment}
        loading={creatingAppointment}
        veterinarians={veterinarians}
        currentDate={currentDate}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        visible={isDetailsModalVisible}
        onCancel={closeDetailsModal}
        onUpdate={updateAppointment}
        onDelete={deleteAppointment}
        veterinarians={veterinarians}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default CalendarPage;
