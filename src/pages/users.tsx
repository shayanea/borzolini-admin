import {
  UserFilters,
  UserFormModal,
  UserPageHeader,
  UserTable,
  UserViewModal,
} from '@/components/users';

import { useUserManagement } from '@/hooks';
import { UserRole } from '@/types';
import { Card } from 'antd';
import { useCallback } from 'react';

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
    selectedIsActive,

    isModalVisible,
    editingUser,
    modalLoading,
    isViewModalVisible,
    viewingUser,

    // Actions
    handleSearch,
    handleRoleFilter,
    handleIsActiveFilter,
    clearFilters,
    handleTableChange,
    showModal,
    hideModal,
    showViewModal,
    hideViewModal,
    handleSubmit,
    handleDeleteUser,

    handleExportCSV,
    handleExportExcel,

    refetch,
  } = useUserManagement(roleFilter);

  const handleRefresh = useCallback(() => {
    refetch();
  }, []);

  const handleAddUser = useCallback(() => {
    showModal();
  }, [showModal]);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <UserPageHeader
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onAddUser={handleAddUser}
        loading={loading}
        title={roleFilter === 'veterinarian' ? 'Veterinarians' : 'Users'}
        subtitle={
          roleFilter === 'veterinarian'
            ? 'Manage clinic veterinarians'
            : 'Manage clinic users and staff members'
        }
        filters={{
          search: searchText,
          role: selectedRole,
          isActive: selectedIsActive,
        }}
        estimatedRecordCount={total}
      />

      {/* Search and Filters */}
      <UserFilters
        searchText={searchText}
        selectedRole={selectedRole}
        selectedIsActive={selectedIsActive}
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onIsActiveFilter={handleIsActiveFilter}
        onClearFilters={clearFilters}
      />

      {/* Users Table */}
      <Card className='admin-card'>
        <UserTable
          users={users}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          onTableChange={handleTableChange}
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
      <UserViewModal
        isVisible={isViewModalVisible}
        user={viewingUser}
        onClose={hideViewModal}
        hidePetsSection={roleFilter === 'veterinarian'}
      />
    </div>
  );
};

export default Users;
