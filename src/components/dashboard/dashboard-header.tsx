import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardHeaderProps } from '@/types/dashboard';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardHeader = ({
	onDateRangeChange,
	onClearFilters,
	onRefresh,
	loading,
}: DashboardHeaderProps) => {
	const { t } = useTranslation('pages');

	return (
		<div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-6'>
			{/* Title */}
			<div>
				<Title level={2} className='!mb-0 !font-bold !text-slate-800 tracking-tight'>
					{t('dashboard.title')}
				</Title>
				<Text className='text-slate-500'>
					{t('dashboard.welcomeMessage')}
				</Text>
			</div>

			{/* Actions */}
			<div className='flex items-center gap-3'>
				<RangePicker
					onChange={onDateRangeChange}
					className='w-64 border-slate-200 shadow-sm rounded-lg hover:border-indigo-400 focus:border-indigo-400'
					format='YYYY-MM-DD'
				/>

				<Button
					icon={<FilterOutlined />}
					onClick={onClearFilters}
					className='rounded-lg text-slate-600 hover:text-indigo-600 border-slate-200'
				/>

				<Button
					icon={<ReloadOutlined />}
					onClick={onRefresh}
					loading={loading}
					type="primary"
					className='rounded-lg bg-indigo-600 hover:bg-indigo-500 border-none shadow-sm'
				/>
			</div>
		</div>
	);
};

export { DashboardHeader };
export default DashboardHeader;
