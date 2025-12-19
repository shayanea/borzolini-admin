import { Card, Modal } from 'antd';
import { UserFilters, UserPageHeader, UserTable, UserViewModal } from '@/components/users';

import { UserRole } from '@/types';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserManagement } from '@/hooks';

interface UsersProps {
  roleFilter?: UserRole;
}

const Users = ({ roleFilter }: UsersProps) => {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
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
    dateRange,
    selectedRowKeys,
    userStats,

    isViewModalVisible,
    viewingUser,

    // Actions
    handleSearch,
    handleRoleFilter,
    handleIsActiveFilter,
    handleDateRangeChange,
    clearFilters,
    handleTableChange,
    showViewModal,
    hideViewModal,
    handleDeleteUser,
    handleRowSelectionChange,
    handleUpdateUserStatus,
    handleBulkUpdateStatus,
    handleBulkDeleteUsers,

    handleExportCSV,
    handleExportExcel,

    refetch,
  } = useUserManagement(roleFilter);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAddUser = useCallback(() => {
    navigate('/users/create');
  }, [navigate]);

  const handleEditUser = useCallback(
    (user: { id: string }) => {
      navigate(`/users/edit/${user.id}`);
    },
    [navigate]
  );

  const handleBulkActivate = useCallback(async () => {
    if (!selectedRowKeys.length) return;
    await handleBulkUpdateStatus(selectedRowKeys, true);
  }, [handleBulkUpdateStatus, selectedRowKeys]);

  const handleBulkDeactivate = useCallback(async () => {
    if (!selectedRowKeys.length) return;
    await handleBulkUpdateStatus(selectedRowKeys, false);
  }, [handleBulkUpdateStatus, selectedRowKeys]);

  const handleBulkDelete = useCallback(() => {
    if (!selectedRowKeys.length) return;
    Modal.confirm({
      title: t('users.confirmBulkDeleteTitle'),
      content: t('users.confirmBulkDeleteMessage', { count: selectedRowKeys.length }),
      okType: 'danger',
      onOk: async () => {
        await handleBulkDeleteUsers(selectedRowKeys);
      },
    });
  }, [handleBulkDeleteUsers, selectedRowKeys, t]);

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
        stats={userStats}
        onQuickRoleFilter={handleRoleFilter}
        onQuickStatusFilter={handleIsActiveFilter}
      />

      {/* Search and Filters */}
      <UserFilters
        searchText={searchText}
        selectedRole={selectedRole}
        selectedIsActive={selectedIsActive}
        dateRange={dateRange}
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onIsActiveFilter={handleIsActiveFilter}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={clearFilters}
      />

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <Card className='admin-card'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-slate-700'>
              {t('users.selectedCount', { count: selectedRowKeys.length })}
            </span>
            <div className='flex gap-2'>
              <button
                type='button'
                className='px-3 py-1 text-xs rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                onClick={handleBulkActivate}
                disabled={loading}
              >
                {t('users.bulkActivate')}
              </button>
              <button
                type='button'
                className='px-3 py-1 text-xs rounded-md bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                onClick={handleBulkDeactivate}
                disabled={loading}
              >
                {t('users.bulkDeactivate')}
              </button>
              <button
                type='button'
                className='px-3 py-1 text-xs rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                onClick={handleBulkDelete}
                disabled={loading}
              >
                {t('users.bulkDelete')}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Users Table */}
      <Card className='admin-card'>
        <UserTable
          users={users}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          selectedRowKeys={selectedRowKeys}
          onRowSelectionChange={handleRowSelectionChange}
          onTableChange={handleTableChange}
          onViewUser={showViewModal}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleActive={(user, isActive) => handleUpdateUserStatus(user.id, isActive)}
        />
      </Card>

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
