import {
  AppointmentsFilters,
  AppointmentsHeader,
  AppointmentsTable,
} from '@/components/appointments';

import React from 'react';
import { useAppointments } from '@/hooks/useAppointments';

const Appointments: React.FC = () => {
  const {
    appointments,
    loading,
    searchText,
    pagination,
    handleSearch,
    handleFilters,
    handlePagination,
    handleExport,
    handleNewAppointment,
    handleEditAppointment,
    handleCancelAppointment,
  } = useAppointments();

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <AppointmentsHeader onNewAppointment={handleNewAppointment} />

      {/* Search and Filters */}
      <AppointmentsFilters
        searchText={searchText}
        onSearch={handleSearch}
        onFilters={handleFilters}
        onExport={handleExport}
      />

      {/* Appointments Table */}
      <AppointmentsTable
        appointments={appointments}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditAppointment}
        onCancel={handleCancelAppointment}
        onPagination={handlePagination}
      />
    </div>
  );
};

export default Appointments;
