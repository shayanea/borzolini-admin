import { UserFilters, UserFormModal, UserPageHeader, UserViewModal } from '@/components/users';

import ClinicStaffTable from '@/components/clinics/clinic-staff-table';
import { useUserManagement } from '@/hooks';
import { useCurrentUser } from '@/hooks/auth';
import { useClinicContext, useClinicStaff } from '@/hooks/clinics';
import UsersService from '@/services/users';
import type { UserRole } from '@/types';
import { Card } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
		dateRange,

		isModalVisible,
		editingUser,
		modalLoading,
		isViewModalVisible,
		viewingUser,

		// Actions
		handleSearch,
		handleRoleFilter,
		handleIsActiveFilter,
		handleDateRangeChange,
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
	} = useUserManagement('staff' as UserRole);

	// Fetch clinic staff via clinics/{id}/staff
	const { clinicContext } = useClinicContext();
	const {
		data: clinicStaffResponse,
		isLoading: staffLoading,
		refetch: refetchClinicStaff,
	} = useClinicStaff({ clinicId: clinicContext?.clinicId });

	const staff = clinicStaffResponse?.data ?? [];
	const total = clinicStaffResponse?.total;

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
				onAddUser={
					currentUser?.role === 'admin' || currentUser?.role === 'clinic_admin'
						? handleAddUser
						: () => { }
				}
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
				dateRange={dateRange}
				onSearch={handleSearch}
				onRoleFilter={handleRoleFilter}
				onIsActiveFilter={handleIsActiveFilter}
				onDateRangeChange={handleDateRangeChange}
				onClearFilters={clearFilters}
			/>

			{/* Clinic Staff Table */}
			<Card className='admin-card'>
				<ClinicStaffTable
					staff={staff}
					loading={loading || staffLoading}
					currentPage={currentPage}
					pageSize={pageSize}
					total={total}
					onTableChange={handleTableChange as any}
					onViewUser={showViewModal}
					onEditUser={
						currentUser?.role === 'admin' || currentUser?.role === 'clinic_admin'
							? showModal
							: () => { }
					}
					onDeleteUser={currentUser?.role === 'clinic_admin' ? handleDeleteUser : () => { }}
					onResolveViewUser={userId => {
						(async () => {
							try {
								const user = await UsersService.getUserById(userId);
								showViewModal(user);
							} catch (error) {
								// no-op
							}
						})();
					}}
					onResolveEditUser={userId => {
						(async () => {
							try {
								const user = await UsersService.getUserById(userId);
								if (currentUser?.role === 'admin' || currentUser?.role === 'clinic_admin') {
									showModal(user);
								}
							} catch (error) {
								console.error(error);
								// no-op
							}
						})();
					}}
				/>
			</Card>

			{/* Create/Edit User Modal */}
			{(currentUser?.role === 'admin' || currentUser?.role === 'clinic_admin') && (
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

export { Staff };
export default Staff;
