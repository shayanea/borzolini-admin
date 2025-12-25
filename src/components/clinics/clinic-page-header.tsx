import { ExportButton } from '@/components/common';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface ClinicPageHeaderProps {
	title: string;
	subtitle: string;
	loading?: boolean;
	onRefresh: () => void;
	onExportCSV: () => Promise<Blob>;
	onExportExcel: () => Promise<Blob>;
	onAddClinic: () => void;
	filters?: Record<string, any>;
	estimatedRecordCount?: number;
}

const ClinicPageHeader = ({
	title,
	subtitle,
	loading = false,
	onRefresh,
	onExportCSV,
	onExportExcel,
	onAddClinic,
	filters = {},
	estimatedRecordCount = 0,
}: ClinicPageHeaderProps) => {
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
						entityType='clinics'
						exportCSV={onExportCSV}
						exportExcel={onExportExcel}
						filters={filters}
						estimatedRecordCount={estimatedRecordCount}
						disabled={loading}
					/>

					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={onAddClinic}
						className=''
					>
						Add Clinic
					</Button>
				</div>
			</div>

			{/* Filters Summary */}
			{Object.keys(filters).some(key => filters[key]) && (
				<div className='flex flex-wrap items-center gap-2'>
					<button
						type='button'
						className='px-3 py-1 rounded-md text-xs font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors'
					>
						All <span className='ml-1 font-semibold'>{estimatedRecordCount}</span>
					</button>

					{filters.search && (
						<span className='px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200'>
							Search: <span className='font-semibold'>{filters.search}</span>
						</span>
					)}

					{filters.city && (
						<span className='px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200'>
							City: <span className='font-semibold'>{filters.city}</span>
						</span>
					)}

					{filters.isActive !== undefined && (
						<span className='px-3 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200'>
							Status: <span className='font-semibold'>{filters.isActive ? 'Active' : 'Inactive'}</span>
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export { ClinicPageHeader };
export default ClinicPageHeader;
