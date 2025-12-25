import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { ExportButton } from '@/components/common';
import type { UserPageHeaderProps } from '@/types/user-management';

interface UserPageHeaderPropsWithTitle extends UserPageHeaderProps {
	title?: string;
	subtitle?: string;
}

const UserPageHeader = ({
	onRefresh,
	onExportCSV,
	onExportExcel,
	onAddUser,
	loading,
	title = 'Users',
	subtitle = 'Manage clinic users and staff members',
	filters = {},
	estimatedRecordCount = 0,
	stats,
	onQuickStatusFilter,
}: UserPageHeaderPropsWithTitle) => {

	return (
		<div className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
			<div className='flex items-center justify-between gap-4 mb-3'>
				<div>
					<h1 className='text-xl font-bold text-gray-900 mb-0.5'>{title}</h1>
					<p className='text-sm text-gray-500'>{subtitle}</p>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						type='text'
						icon={<ReloadOutlined />}
						onClick={onRefresh}
						loading={loading}
						className='text-gray-600'
					>
						Refresh
					</Button>

					<ExportButton
						entityType={title === 'Veterinarians' ? 'veterinarians' : 'users'}
						exportCSV={onExportCSV}
						exportExcel={onExportExcel}
						filters={filters}
						estimatedRecordCount={estimatedRecordCount}
						disabled={loading}
					/>

					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={onAddUser}
						className=''
					>
						Add User
					</Button>
				</div>
			</div>

			{stats && (
				<div className='flex flex-wrap items-center gap-2'>
					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(null)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors'
					>
						All <span className='ml-1 font-semibold'>{stats.total}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(true)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors'
					>
						Active <span className='ml-1 font-semibold'>{stats.activeCount}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(false)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
					>
						Inactive <span className='ml-1 font-semibold'>{stats.inactiveCount}</span>
					</button>


				</div>
			)}
		</div>
	);
};

export { UserPageHeader };
export default UserPageHeader;
