import {
  ClinicBulkActions,
  ClinicFilters,
  ClinicPageHeader,
  ClinicStaffModal,
  ClinicTable,
} from '@/components/clinics';
import { useCallback, useMemo, useState } from 'react';

import { Card } from 'antd';
import type { Clinic } from '@/types';
import ClinicAppointmentsModal from '@/components/clinics/clinic-appointments-modal';
import { ROUTES } from '@/constants';
import { useClinicManagement } from '@/hooks';
import { useNavigate } from 'react-router-dom';

const Clinics = () => {
  const navigate = useNavigate();
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

    // Actions
    handleSearch,
    handleCityFilter,
    handleStatusFilter,
    clearFilters,
    handleTableChange,
    handleDeleteClinic,
    handleBulkDelete,
    handleExportCSV,
    handleExportExcel,
    setSelectedRowKeys,

    // Utils
    refetch,
  } = useClinicManagement();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAddClinic = useCallback(() => {
    navigate(ROUTES.CLINIC_CREATE);
  }, [navigate]);

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

  const handleEditClinic = useCallback(
    (clinic: Clinic) => {
      navigate(`${ROUTES.CLINIC_EDIT}/${clinic.id}`);
    },
    [navigate]
  );

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <ClinicPageHeader
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onAddClinic={handleAddClinic}
        loading={loading}
        title='Clinics'
        subtitle='Manage clinic locations and information'
        filters={{
          search: searchText,
          city: selectedCity,
          isActive: selectedStatus,
        }}
        estimatedRecordCount={total}
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
          onEdit={handleEditClinic}
          onDelete={handleDeleteClinic}
          onView={handleViewClinic}
          onViewStaff={handleViewStaff}
        />
      </Card>

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

export { Clinics };
export default Clinics;
