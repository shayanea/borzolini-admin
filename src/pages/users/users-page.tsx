import { UserFilters, UserPageHeader, UserTable, UserViewModal } from '@/components/users';
import { Modal } from 'antd';

import { useUserManagement } from '@/hooks';
import { UserRole } from '@/types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 flex items-center justify-between'>
					<span className='text-xs font-medium text-blue-700'>
						{selectedRowKeys.length} selected
					</span>
					<div className='flex gap-2'>
						<button
							type='button'
							className='px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700'
							onClick={handleBulkActivate}
							disabled={loading}
						>
							Activate
						</button>
						<button
							type='button'
							className='px-2 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700'
							onClick={handleBulkDeactivate}
							disabled={loading}
						>
							Deactivate
						</button>
						<button
							type='button'
							className='px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700'
							onClick={handleBulkDelete}
							disabled={loading}
						>
							Delete
						</button>
					</div>
				</div>
			)}


			{/* Users Table */}
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
