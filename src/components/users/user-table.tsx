import { TABLE_PAGE_SIZES, USER_TABLE_COLUMNS } from '@/constants';
import type { User, UserTableProps } from '@/types';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	MailOutlined,
	PhoneOutlined,
	SaveOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Avatar, Input, Select, Switch, Table, Tooltip, message } from 'antd';
import { useState } from 'react';

const UserTable = ({
	users,
	loading = false,
	currentPage = 1,
	pageSize = 10,
	total = 0,
	selectedRowKeys,

	onEditUser,
	onDeleteUser,
	onTableChange,
	onRowSelectionChange,
	onToggleActive,
}: UserTableProps) => {
	const [editingCell, setEditingCell] = useState<{ userId: string; field: string } | null>(null);
	const [editValue, setEditValue] = useState<string>('');

	const startEdit = (userId: string, field: string, currentValue: string) => {
		setEditingCell({ userId, field });
		setEditValue(currentValue);
	};

	const cancelEdit = () => {
		setEditingCell(null);
		setEditValue('');
	};

	const saveEdit = async () => {
		// Here you would call your API to update the user with editingCell and editValue
		message.success('User updated successfully');
		setEditingCell(null);
		setEditValue('');
	};

	const isEditing = (userId: string, field: string) => {
		return editingCell?.userId === userId && editingCell?.field === field;
	};

	const roleOptions = [
		{ label: 'Admin', value: 'admin' },
		{ label: 'Veterinarian', value: 'veterinarian' },
		{ label: 'Staff', value: 'staff' },
		{ label: 'Patient', value: 'patient' },
		{ label: 'Clinic Admin', value: 'clinic_admin' },
	];

	const getRoleBadgeColor = (role: string) => {
		const colors: Record<string, string> = {
			admin: 'bg-red-100 text-red-700 border-red-200',
			veterinarian: 'bg-emerald-100 text-emerald-700 border-emerald-200',
			staff: 'bg-blue-100 text-blue-700 border-blue-200',
			patient: 'bg-amber-100 text-amber-700 border-amber-200',
			clinic_admin: 'bg-purple-100 text-purple-700 border-purple-200',
		};
		return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
	};

	const columns = [
		{
			title: 'User',
			key: USER_TABLE_COLUMNS.USER,
			width: 300,
			render: (user: User) => (
				<div className='flex items-center gap-3 py-1'>
					<Avatar
						size={32}
						className='flex-shrink-0'
						style={{
							backgroundColor: '#3b82f6',
							fontWeight: '600',
						}}
					>
						{user.firstName.charAt(0)}
					</Avatar>
					<div className='flex-1 min-w-0'>
						{isEditing(user.id, 'name') ? (
							<div className='flex items-center gap-1'>
								<Input
									size='small'
									value={editValue}
									onChange={e => setEditValue(e.target.value)}
									onPressEnter={saveEdit}
									className='text-sm'
									autoFocus
								/>
								<SaveOutlined
									className='text-green-600 cursor-pointer hover:text-green-700'
									onClick={saveEdit}
								/>
								<CloseOutlined
									className='text-gray-400 cursor-pointer hover:text-gray-600'
									onClick={cancelEdit}
								/>
							</div>
						) : (
							<div
								className='font-medium text-sm text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors'
								onClick={() => startEdit(user.id, 'name', `${user.firstName} ${user.lastName}`)}
							>
								{user.firstName} {user.lastName}
							</div>
						)}
						{isEditing(user.id, 'email') ? (
							<div className='flex items-center gap-1 mt-0.5'>
								<Input
									size='small'
									value={editValue}
									onChange={e => setEditValue(e.target.value)}
									onPressEnter={saveEdit}
									className='text-xs'
									autoFocus
								/>
								<SaveOutlined
									className='text-green-600 cursor-pointer hover:text-green-700 text-xs'
									onClick={saveEdit}
								/>
								<CloseOutlined
									className='text-gray-400 cursor-pointer hover:text-gray-600 text-xs'
									onClick={cancelEdit}
								/>
							</div>
						) : (
							<div
								className='text-xs text-gray-500 truncate cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1'
								onClick={() => startEdit(user.id, 'email', user.email)}
							>
								<MailOutlined className='text-[10px]' />
								{user.email}
							</div>
						)}
						{user.phone && (
							<>
								{isEditing(user.id, 'phone') ? (
									<div className='flex items-center gap-1 mt-0.5'>
										<Input
											size='small'
											value={editValue}
											onChange={e => setEditValue(e.target.value)}
											onPressEnter={saveEdit}
											className='text-xs'
											autoFocus
										/>
										<SaveOutlined
											className='text-green-600 cursor-pointer hover:text-green-700 text-xs'
											onClick={saveEdit}
										/>
										<CloseOutlined
											className='text-gray-400 cursor-pointer hover:text-gray-600 text-xs'
											onClick={cancelEdit}
										/>
									</div>
								) : (
									<div
										className='text-xs text-gray-500 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1'
										onClick={() => startEdit(user.id, 'phone', user.phone || '')}
									>
										<PhoneOutlined className='text-[10px]' />
										{user.phone}
									</div>
								)}
							</>
						)}
					</div>
				</div>
			),
		},
		{
			title: 'Role',
			key: USER_TABLE_COLUMNS.ROLE,
			width: 140,
			render: (user: User) => (
				<>
					{isEditing(user.id, 'role') ? (
						<div className='flex items-center gap-1'>
							<Select
								size='small'
								value={editValue}
								onChange={value => setEditValue(value)}
								options={roleOptions}
								className='w-full'
								autoFocus
							/>
							<SaveOutlined
								className='text-green-600 cursor-pointer hover:text-green-700'
								onClick={saveEdit}
							/>
							<CloseOutlined
								className='text-gray-400 cursor-pointer hover:text-gray-600'
								onClick={cancelEdit}
							/>
						</div>
					) : (
						<span
							className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${getRoleBadgeColor(user.role)}`}
							onClick={() => startEdit(user.id, 'role', user.role)}
						>
							{user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
						</span>
					)}
				</>
			),
		},
		{
			title: 'Status',
			key: USER_TABLE_COLUMNS.VERIFICATION,
			width: 120,
			render: (user: User) => (
				<div className='flex flex-col gap-1.5'>
					<div className='flex items-center gap-1.5'>
						{user.isEmailVerified ? (
							<CheckCircleOutlined className='text-green-600 text-xs' />
						) : (
							<CloseCircleOutlined className='text-red-500 text-xs' />
						)}
						<span className='text-xs text-gray-600'>
							{user.isEmailVerified ? 'Verified' : 'Unverified'}
						</span>
					</div>
					{onToggleActive && (
						<div className='flex items-center gap-1.5'>
							<Switch
								size='small'
								checked={!!user.isActive}
								onChange={checked => onToggleActive(user, checked)}
							/>
							<span className='text-xs text-gray-600'>{user.isActive ? 'Active' : 'Inactive'}</span>
						</div>
					)}
				</div>
			),
		},
		{
			title: 'Location',
			key: USER_TABLE_COLUMNS.LOCATION,
			width: 140,
			render: (user: User) => (
				<div className='text-xs text-gray-600'>
					{user.city && user.country ? (
						<span>
							{user.city}, {user.country}
						</span>
					) : (
						<span className='text-gray-400'>Not specified</span>
					)}
				</div>
			),
		},
		{
			title: 'Actions',
			key: USER_TABLE_COLUMNS.ACTIONS,
			width: 80,
			align: 'center' as const,
			render: (user: User) => (
				<div className='flex items-center justify-center gap-4'>
					<Tooltip title='Edit'>
						<EditOutlined
							className='text-blue-600 cursor-pointer hover:text-blue-700 text-sm'
							onClick={() => onEditUser(user)}
						/>
					</Tooltip>
					<Tooltip title='Delete'>
						<DeleteOutlined
							className='text-red-500 cursor-pointer hover:text-red-600 text-sm'
							onClick={() => onDeleteUser(user.id)}
						/>
					</Tooltip>
				</div>
			),
		},
	];

	const handleShowTotal = (total: number, range: [number, number]) => {
		return `${range[0]}-${range[1]} of ${total} users`;
	};

	return (
		<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
			<Table
				columns={columns}
				dataSource={users}
				rowKey='id'
				loading={loading}
				rowSelection={
					onRowSelectionChange
						? {
							selectedRowKeys,
							onChange: onRowSelectionChange as any,
						}
						: undefined
				}
				pagination={{
					current: currentPage,
					pageSize,
					total,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: handleShowTotal,
					pageSizeOptions: TABLE_PAGE_SIZES.map(String),
					position: ['bottomCenter'],
					className: 'px-4 py-3',
					size: 'small',
				}}
				onChange={onTableChange}
				size='small'
				rowClassName='hover:bg-gray-50 transition-colors cursor-pointer'
				className='compact-table'
				locale={{
					emptyText: loading ? null : (
						<div className='text-center py-12'>
							<UserOutlined className='text-4xl text-gray-300 mb-2' />
							<div className='text-sm text-gray-500'>No users found</div>
						</div>
					),
				}}
			/>
		</div>
	);
};

export { UserTable };
export default UserTable;
