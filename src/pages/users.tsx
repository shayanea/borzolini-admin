import {
  UserBulkActions,
  UserFilters,
  UserFormModal,
  UserPageHeader,
  UserTable,
  UserViewModal,
} from '@/components/users';

import { Card } from 'antd';
import { UserRole } from '@/types';
import { useCallback } from 'react';
import { useUserManagement } from '@/hooks';

interface UsersProps {
  roleFilter?: UserRole;
}

const Users = ({ roleFilter }: UsersProps) => {
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
    selectedRowKeys,
    bulkLoading,
    isModalVisible,
    editingUser,
    modalLoading,
    isViewModalVisible,
    viewingUser,

    // Actions
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    clearFilters,
    handleTableChange,
    showModal,
    hideModal,
    showViewModal,
    hideViewModal,
    handleSubmit,
    handleDeleteUser,
    handleBulkDelete,
    handleExport,
    setSelectedRowKeys,
  } = useUserManagement(roleFilter);

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
        title={roleFilter === 'veterinarian' ? 'Veterinarians' : 'Users'}
        subtitle={
          roleFilter === 'veterinarian'
            ? 'Manage clinic veterinarians'
            : 'Manage clinic users and staff members'
        }
      />

      {/* Search and Filters */}
      <UserFilters
        searchText={searchText}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
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
          onViewUser={showViewModal}
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

      {/* View User Modal */}
      <UserViewModal isVisible={isViewModalVisible} user={viewingUser} onClose={hideViewModal} />
    </div>
  );
};

export default Users;
