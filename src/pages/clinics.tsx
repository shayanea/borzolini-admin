import {
  ClinicBulkActions,
  ClinicFilters,
  ClinicFormModal,
  ClinicPageHeader,
  ClinicTable,
} from '@/components/clinics';

import { Card } from 'antd';
import { useCallback } from 'react';
import { useClinicManagement } from '@/hooks';

const Clinics = () => {
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
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onChange={handleTableChange}
          onEdit={showModal}
          onDelete={handleDeleteClinic}
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
    </div>
  );
};

export default Clinics;
