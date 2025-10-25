import {
  AppointmentViewModal,
  AppointmentsFilters,
  AppointmentsHeader,
  AppointmentsTable,
} from '@/components/appointments';
import { ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Empty } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from '@/components/common/error-boundary';
import LoadingSpinner from '@/components/common/loading-spinner';
import { useAppointments } from '@/hooks/use-appointments';
import { useAuthStore } from '@/stores/auth.store';
import type { Appointment } from '@/types';

const Appointments = () => {
  const { t } = useTranslation('pages');
  const { isAuthenticated } = useAuthStore();
  const {
    appointments,
    loading,
    error,
    searchText,
    pagination,
    stats,
    statsLoading,
    handleSearch,
    handleFilters,
    handlePagination,
    handleExport,
    handleEditAppointment,
    handleCancelAppointment,
    clearError,
  } = useAppointments();

  // Modal states
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  const handleViewAppointment = useCallback((appointment: Appointment) => {
    setViewingAppointment(appointment);
    setIsViewModalVisible(true);
  }, []);

  const handleViewModalCancel = useCallback(() => {
    setIsViewModalVisible(false);
    setViewingAppointment(null);
  }, []);

  const handleUpdateAppointment = useCallback(
    async (id: string, updates: Partial<Appointment>) => {
      try {
        // Convert the updates to the format expected by the API
        const updateData = {
          status: updates.status,
          priority: updates.priority,
          notes: updates.notes,
          reason: updates.reason,
          symptoms: updates.symptoms,
          diagnosis: updates.diagnosis,
          treatment_plan: updates.treatment_plan,
          follow_up_instructions: updates.follow_up_instructions,
        };

        await handleEditAppointment(id, updateData);
      } catch (error) {
        console.error('Failed to update appointment:', error);
        throw error;
      }
    },
    [handleEditAppointment]
  );

  // Show loading spinner for initial load
  if (loading) {
    return <LoadingSpinner fullScreen text={t('appointments.loading')} />;
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-primary-dark'>
        <div className='text-center text-white'>
          <LockOutlined className='text-6xl mb-4 text-primary-orange' />
          <h1 className='text-2xl font-bold mb-2'>{t('appointments.authRequired')}</h1>
          <p className='text-lg text-gray-300 mb-6'>{t('appointments.pleaseLogin')}</p>
          <p className='text-sm text-gray-400'>{t('appointments.autoRedirect')}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='space-y-6'>
        {/* Error Alert */}
        {error && (
          <Alert
            message={t('appointments.errorLoading')}
            description={error}
            type='error'
            showIcon
            icon={<ExclamationCircleOutlined />}
            closable
            onClose={clearError}
            className='mb-4'
          />
        )}

        {/* Page Header */}
        <AppointmentsHeader />

        {/* Search and Filters */}
        <AppointmentsFilters
          searchText={searchText}
          onSearch={handleSearch}
          onFilters={handleFilters}
          onExport={handleExport}
        />

        {/* Statistics Summary */}
        {stats && !statsLoading && (
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6'>
            <div className='bg-white p-4 rounded-lg shadow border'>
              <div className='text-2xl font-bold text-primary-navy'>{stats.total}</div>
              <div className='text-sm text-gray-600'>{t('appointments.total')}</div>
            </div>
            <div className='bg-white p-4 rounded-lg shadow border'>
              <div className='text-2xl font-bold text-blue-600'>{stats.byStatus.pending}</div>
              <div className='text-sm text-gray-600'>{t('appointments.pending')}</div>
            </div>
            <div className='bg-white p-4 rounded-lg shadow border'>
              <div className='text-2xl font-bold text-green-600'>{stats.byStatus.confirmed}</div>
              <div className='text-sm text-gray-600'>{t('appointments.confirmed')}</div>
            </div>
            <div className='bg-white p-4 rounded-lg shadow border'>
              <div className='text-2xl font-bold text-orange-600'>{stats.byStatus.in_progress}</div>
              <div className='text-sm text-gray-600'>{t('appointments.inProgress')}</div>
            </div>
            <div className='bg-white p-4 rounded-lg shadow border'>
              <div className='text-2xl font-bold text-purple-600'>{stats.byStatus.completed}</div>
              <div className='text-sm text-gray-600'>{t('appointments.completed')}</div>
            </div>
            <div className='bg-white p-4 rounded-lg shadow border'>
              <div className='text-2xl font-bold text-red-600'>{stats.byStatus.cancelled}</div>
              <div className='text-sm text-gray-600'>{t('appointments.today')}</div>
            </div>
          </div>
        )}

        {/* Appointments Table */}
        {appointments.length > 0 ? (
          <AppointmentsTable
            appointments={appointments}
            loading={loading}
            pagination={pagination}
            onView={handleViewAppointment}
            onCancel={handleCancelAppointment}
            onPagination={handlePagination}
          />
        ) : !loading ? (
          <Empty description={t('appointments.noData')} className='my-12' />
        ) : null}

        {/* Loading indicator for subsequent loads */}
        {loading && appointments.length > 0 && (
          <div className='text-center py-4'>
            <LoadingSpinner size='small' text={t('appointments.updating')} />
          </div>
        )}

        {/* Appointment View Modal */}
        <AppointmentViewModal
          visible={isViewModalVisible}
          appointment={viewingAppointment}
          onCancel={handleViewModalCancel}
          onUpdate={handleUpdateAppointment}
          loading={loading}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Appointments;
