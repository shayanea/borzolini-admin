import { APPOINTMENT_STATUSES } from '@/constants';
import type { AppointmentsHeaderProps } from '@/types';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

const AppointmentsHeader = ({
	onNewAppointment,
	onRefresh,
	loading = false,
	stats,
	onQuickStatusFilter,
}: AppointmentsHeaderProps) => {
	const { t } = useTranslation('pages');

	return (
		<div className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
			<div className='flex items-center justify-between gap-4 mb-3'>
				<div>
					<h1 className='text-xl font-bold text-gray-900 mb-0.5'>
						{t('appointments.title')}
					</h1>
					<p className='text-sm text-gray-500'>
						{t('appointments.subtitle')}
					</p>
				</div>

				<div className='flex items-center gap-2'>
					<Tooltip title={t('common.refresh')}>
						<Button
							type='text'
							icon={<ReloadOutlined />}
							onClick={onRefresh}
							loading={loading}
							className='text-gray-600'
						>
							{t('common.refresh')}
						</Button>
					</Tooltip>

					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={onNewAppointment}
						className=''
					>
						{t('appointments.newAppointment')}
					</Button>
				</div>
			</div>

			{stats && (
				<div className='flex flex-wrap items-center gap-2'>
					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(null)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
					>
						All <span className='ml-1 font-semibold'>{stats.total}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(APPOINTMENT_STATUSES.PENDING)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors'
					>
						Pending <span className='ml-1 font-semibold'>{stats.pending}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(APPOINTMENT_STATUSES.CONFIRMED)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors'
					>
						Confirmed <span className='ml-1 font-semibold'>{stats.confirmed}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(APPOINTMENT_STATUSES.IN_PROGRESS)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors'
					>
						In Progress <span className='ml-1 font-semibold'>{stats.inProgress}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(APPOINTMENT_STATUSES.COMPLETED)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors'
					>
						Completed <span className='ml-1 font-semibold'>{stats.completed}</span>
					</button>

					<button
						type='button'
						onClick={() => onQuickStatusFilter?.(APPOINTMENT_STATUSES.CANCELLED)}
						className='px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors'
					>
						Cancelled <span className='ml-1 font-semibold'>{stats.cancelled}</span>
					</button>
				</div>
			)}
		</div>
	);
};

export { AppointmentsHeader };
export default AppointmentsHeader;
