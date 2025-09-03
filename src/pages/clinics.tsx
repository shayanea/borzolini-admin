import {
  ClinicBulkActions,
  ClinicFilters,
  ClinicFormModal,
  ClinicPageHeader,
  ClinicStaffModal,
  ClinicTable,
} from '@/components/clinics';
import { useCallback, useMemo, useState } from 'react';

import { Card } from 'antd';
import type { Clinic } from '@/types';
import ClinicAppointmentsModal from '@/components/clinics/clinic-appointments-modal';
import { useClinicManagement } from '@/hooks';

const Clinics = () => {
  const [viewClinic, setViewClinic] = useState<Clinic | null>(null);
  const [staffClinic, setStaffClinic] = useState<Clinic | null>(null);
  const isAppointmentsModalVisible = useMemo(() => !!viewClinic, [viewClinic]);
  const isStaffModalVisible = useMemo(() => !!staffClinic, [staffClinic]);
  const {
    // State
    clinics,
    loading,
    total,
    currentPage,
    pageSize,
    searchText,
    selectedCity,
    selectedStatus,
    selectedRowKeys,
    bulkLoading,
    isModalVisible,
    editingClinic,
    modalLoading,

    // Actions
    handleSearch,
    handleCityFilter,
    handleStatusFilter,
    clearFilters,
    handleTableChange,
    showModal,
    hideModal,
    handleSubmit,
    handleDeleteClinic,
    handleBulkDelete,
    handleExport,
    setSelectedRowKeys,
  } = useClinicManagement();

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleAddClinic = useCallback(() => {
    showModal();
  }, [showModal]);

  const handleViewClinic = useCallback((clinic: Clinic) => {
    setViewClinic(clinic);
  }, []);

  const handleCloseAppointmentsModal = useCallback(() => {
    setViewClinic(null);
  }, []);

  const handleViewStaff = useCallback((clinic: Clinic) => {
    setStaffClinic(clinic);
  }, []);

  const handleCloseStaffModal = useCallback(() => {
    setStaffClinic(null);
  }, []);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <ClinicPageHeader
        onRefresh={handleRefresh}
        onExport={handleExport}
        onAddClinic={handleAddClinic}
        loading={loading}
        title='Clinics'
        subtitle='Manage clinic locations and information'
      />

      {/* Search and Filters */}
      <ClinicFilters
        searchText={searchText}
        selectedCity={selectedCity}
        selectedStatus={selectedStatus}
        onSearch={handleSearch}
        onCityFilter={handleCityFilter}
        onStatusFilter={handleStatusFilter}
        onClearFilters={clearFilters}
      />

      {/* Bulk Actions */}
      <ClinicBulkActions
        selectedCount={selectedRowKeys.length}
        loading={bulkLoading}
        onBulkDelete={handleBulkDelete}
      />

      {/* Clinics Table */}
      <Card className='admin-card'>
        <ClinicTable
          clinics={clinics}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}-${range[1]} of ${total} clinics`,
            position: ['bottomCenter'],
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: keys => setSelectedRowKeys(keys as string[]),
          }}
          onChange={handleTableChange}
          onEdit={showModal}
          onDelete={handleDeleteClinic}
          onView={handleViewClinic}
          onViewStaff={handleViewStaff}
        />
      </Card>

      {/* Clinic Form Modal */}
      <ClinicFormModal
        visible={isModalVisible}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        loading={modalLoading}
        editingClinic={editingClinic}
      />

      <ClinicAppointmentsModal
        visible={isAppointmentsModalVisible}
        clinic={viewClinic}
        onClose={handleCloseAppointmentsModal}
      />

      <ClinicStaffModal
        visible={isStaffModalVisible}
        clinic={staffClinic}
        onClose={handleCloseStaffModal}
      />
    </div>
  );
};

export default Clinics;
