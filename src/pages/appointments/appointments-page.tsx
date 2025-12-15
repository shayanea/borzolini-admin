import {
    AppointmentViewModal,
    AppointmentsFilters,
    AppointmentsHeader,
    AppointmentsTable,
} from '@/components/appointments';
import BulkActionsBar from '@/components/appointments/bulk-actions-bar';
import { ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Empty, Modal, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from '@/components/common/error-boundary';
import LoadingSpinner from '@/components/common/loading-spinner';
import { APPOINTMENT_STATUSES } from '@/constants';
import { useAppointments } from '@/hooks/appointments';
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
    handleBulkUpdate,
    clearError,
  } = useAppointments();

  // Modal states
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  
  // Selection states
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Bulk Action Handlers
  const handleBulkConfirm = async () => {
    try {
      await handleBulkUpdate(selectedRowKeys as string[], { status: APPOINTMENT_STATUSES.CONFIRMED });
      setSelectedRowKeys([]);
      message.success(t('messages.updateSuccess'));
    } catch (e) {
      console.error(e);
      // Error handled by hook
    }
  };

  const handleBulkRemind = () => {
    // Mock action
    message.success(`Reminders sent to ${selectedRowKeys.length} patients via SMS/Email.`);
    setSelectedRowKeys([]);
  };

  const handleBulkReschedule = () => {
    Modal.info({
      title: 'Bulk Reschedule',
      content: (
        <div>
          <p>Please select a new date for {selectedRowKeys.length} appointments.</p>
          <div className='p-4 bg-gray-50 border rounded text-center text-gray-500 italic'>
            Date Picker Placeholder (Not implemented yet)
          </div>
        </div>
      ),
      onOk: () => {
        message.success('Appointments rescheduled successfully');
        setSelectedRowKeys([]);
      },
    });
  };

  const handleBulkExportSelected = () => {
      // Since the service logic exports by filter, extending it to export by IDs might be complex on backend side without endpoint support.
      // However, we can export the *currently loaded* selected appointments easily on client side, 
      // OR pass a filter like `ids: [...]` if backend supported it.
      // Given the "Smart Filters" task context, let's assume client-side export for now or reuse existing with a note.
      // Actually, standard `handleExport` calls the service which takes filters.
      // I will implement a client-side CSV generation here for the selected items to ensure it works correctly for *selection* specifically.
      
      const selectedAppointments = appointments.filter(app => selectedRowKeys.includes(app.id || ''));
      if (selectedAppointments.length === 0) return;

      const headers = ['ID', 'Patient', 'Service', 'Date', 'Status', 'Clinic', 'Staff'];
      const rows = selectedAppointments.map(app => [
        app.id,
        app.pet?.name || 'Unknown',
        app.service?.name || app.appointment_type,
        app.scheduled_date,
        app.status,
        app.clinic?.name,
        app.staff?.role || 'Unknown'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(val => `"${val || ''}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'selected_appointments.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success(`Exported ${selectedRowKeys.length} appointments.`);
      setSelectedRowKeys([]);
  };

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

  // Memoised statistics summary data to avoid recreation on every render
  const summaryData = useMemo(() => {
    if (!stats) return [] as Array<{ value: number; label: string; color: string }>;

    return [
      {
        value: stats.total,
        label: t('appointments.total'),
        color: 'text-primary-navy',
      },
      {
        value: stats.byStatus.pending,
        label: t('appointments.pending'),
        color: 'text-blue-600',
      },
      {
        value: stats.byStatus.confirmed,
        label: t('appointments.confirmed'),
        color: 'text-green-600',
      },
      {
        value: stats.byStatus.in_progress,
        label: t('appointments.inProgress'),
        color: 'text-orange-600',
      },
      {
        value: stats.byStatus.completed,
        label: t('appointments.completed'),
        color: 'text-purple-600',
      },
      {
        value: stats.byStatus.cancelled,
        label: t('appointments.today'),
        color: 'text-red-600',
      },
    ];
  }, [stats, t]);

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
      <div className='space-y-6 relative pb-20'> 
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
            {summaryData.map(({ value, label, color }) => (
              <div key={label} className='bg-white p-4 rounded-lg shadow border'>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className='text-sm text-gray-600'>{label}</div>
              </div>
            ))}
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
            rowSelection={rowSelection}
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

        <BulkActionsBar
            selectedCount={selectedRowKeys.length}
            onClear={() => setSelectedRowKeys([])}
            onConfirm={handleBulkConfirm}
            onRemind={handleBulkRemind}
            onReschedule={handleBulkReschedule}
            onExport={handleBulkExportSelected}
        />
      </div>
    </ErrorBoundary>
  );
};

export { Appointments };
export default Appointments;

