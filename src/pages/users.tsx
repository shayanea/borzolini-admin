import {
  UserFilters,
  UserFormModal,
  UserPageHeader,
  UserTable,
  UserViewModal,
} from '@/components/users';

import { Card } from 'antd';
import { UserRole } from '@/types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserManagement } from '@/hooks';

interface UsersProps {
  roleFilter?: UserRole;
}

const Users = ({ roleFilter }: UsersProps) => {
  const { t } = useTranslation('pages');
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
  }, [refetch]);

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
        title={roleFilter === 'veterinarian' ? t('users.veterinarians') : t('users.title')}
        subtitle={
          roleFilter === 'veterinarian' ? t('users.manageVeterinarians') : t('users.manageUsers')
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
          selectedRowKeys={[]}
          onRowSelectionChange={() => {}}
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

export { Users };
export default Users;
