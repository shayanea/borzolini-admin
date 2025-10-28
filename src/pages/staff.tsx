import {
  UserFilters,
  UserFormModal,
  UserPageHeader,
  UserTable,
  UserViewModal,
} from '@/components/users';

import { Card } from 'antd';
import { useCallback } from 'react';
import { useCurrentUser } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { useUserManagement } from '@/hooks';
import { useClinicStaff } from '@/hooks/use-clinic-staff';
import { useClinicContext } from '@/hooks/use-clinic-context';
import type { User } from '@/types';

const Staff = () => {
  const { t } = useTranslation('pages');
  const { data: currentUser } = useCurrentUser();

  const {
    // State from legacy user management (filters, modals, exports)
    loading,
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
  } = useUserManagement('staff');

  // Fetch clinic staff via clinics/{id}/staff
  const { clinicContext } = useClinicContext();
  const {
    data: clinicStaffResponse,
    isLoading: staffLoading,
    refetch: refetchClinicStaff,
  } = useClinicStaff({ clinicId: clinicContext?.clinicId });

  const users: User[] = (clinicStaffResponse?.staff ?? [])
    .map(s => s.user)
    .filter(Boolean) as User[];
  const total = clinicStaffResponse?.total ?? users.length;

  const handleRefresh = useCallback(() => {
    refetch();
    refetchClinicStaff();
  }, [refetch, refetchClinicStaff]);

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
        onAddUser={currentUser?.role === 'admin' ? handleAddUser : () => {}}
        loading={loading}
        title={t('users.clinicStaff')}
        subtitle={t('users.manageClinicStaff')}
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
          loading={loading || staffLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          total={total}
          selectedRowKeys={[]}
          onRowSelectionChange={() => {}}
          onTableChange={handleTableChange}
          onViewUser={showViewModal}
          onEditUser={currentUser?.role === 'admin' ? showModal : () => {}}
          onDeleteUser={currentUser?.role === 'admin' ? handleDeleteUser : () => {}}
        />
      </Card>

      {/* Create/Edit User Modal */}
      {currentUser?.role === 'admin' && (
        <UserFormModal
          isVisible={isModalVisible}
          editingUser={editingUser}
          loading={modalLoading}
          onCancel={hideModal}
          onSubmit={handleSubmit}
        />
      )}

      {/* View User Modal */}
      <UserViewModal
        isVisible={isViewModalVisible}
        user={viewingUser}
        onClose={hideViewModal}
        hidePetsSection={false}
      />
    </div>
  );
};

export default Staff;
