import {
  UserBulkActions,
  UserFilters,
  UserFormModal,
  UserPageHeader,
  UserTable,
} from '@/components/users';

import { Card } from 'antd';
import { useCallback } from 'react';
import { useUserManagement } from '@/hooks/use-user-management';

const Users = () => {
  const {
    // State
    users,
    loading,
    total,
    currentPage,
    pageSize,
    searchText,
    selectedRole,
    selectedStatus,
    dateRange,
    selectedRowKeys,
    bulkLoading,
    isModalVisible,
    editingUser,
    modalLoading,

    // Actions
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    handleDateRangeChange,
    clearFilters,
    handleTableChange,
    showModal,
    hideModal,
    handleSubmit,
    handleDeleteUser,
    handleBulkDelete,
    handleExport,
    setSelectedRowKeys,
  } = useUserManagement();

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleAddUser = useCallback(() => {
    showModal();
  }, [showModal]);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <UserPageHeader
        onRefresh={handleRefresh}
        onExport={handleExport}
        onAddUser={handleAddUser}
        loading={loading}
      />

      {/* Search and Filters */}
      <UserFilters
        searchText={searchText}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={clearFilters}
      />

      {/* Bulk Actions */}
      <UserBulkActions
        selectedCount={selectedRowKeys.length}
        loading={bulkLoading}
        onBulkDelete={handleBulkDelete}
      />

      {/* Users Table */}
      <Card className='admin-card'>
        <UserTable
          users={users}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          selectedRowKeys={selectedRowKeys as never[]}
          onTableChange={handleTableChange}
          onRowSelectionChange={setSelectedRowKeys}
          onViewUser={showModal}
          onEditUser={showModal}
          onDeleteUser={handleDeleteUser}
        />
      </Card>

      {/* Create/Edit User Modal */}
      <UserFormModal
        isVisible={isModalVisible}
        editingUser={editingUser}
        loading={modalLoading}
        onCancel={hideModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Users;
