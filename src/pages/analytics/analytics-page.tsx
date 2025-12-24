import { ErrorState, LoadingState } from '@/components/common';
import {
	PetCasesWidget,
	StatisticsCards,
	TopPerformingClinics,
} from '@/components/dashboard';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { useDashboard } from '@/hooks/dashboard';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Analytics = () => {
	const { t } = useTranslation('pages');
	const {
		stats,
		loading,
		error,
		handleDateRangeChange,
		handleClearFilters,
		handleRefresh,
		isRefreshing,
	} = useDashboard();

	if (loading && !stats) {
		return <LoadingState message="Loading analytics..." fullScreen />;
	}

	if (error) {
		return (
			<ErrorState
				title="Error Loading Analytics"
				message={error}
				onRetry={handleRefresh}
				retryText={t('dashboard.retry')}
			/>
		);
	}

	if (!stats) {
		return (
			<ErrorState
				title="No Data Available"
				message="Unable to load analytics data."
				type='warning'
			/>
		);
	}

	return (
		<div className='space-y-4'>
			{/* Page Header */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div>
					<Title level={2} className='!mb-1 !font-bold !text-slate-800'>
						Analytics
					</Title>
					<p className='text-slate-500 text-sm'>
						Comprehensive statistics and performance metrics
					</p>
				</div>

				{/* Filters */}
				<div className='flex items-center gap-3'>
					<RangePicker
						onChange={handleDateRangeChange}
						className='w-64 border-slate-200 shadow-sm rounded-lg'
						format='YYYY-MM-DD'
					/>

					<Button
						icon={<FilterOutlined />}
						onClick={handleClearFilters}
						className='rounded-lg'
					>
						Clear
					</Button>

					<Button
						icon={<ReloadOutlined />}
						onClick={handleRefresh}
						loading={loading || isRefreshing}
						type="primary"
						className='rounded-lg bg-indigo-600 hover:bg-indigo-500'
					>
						Refresh
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<StatisticsCards stats={stats} />

			{/* Charts and Widgets */}
			<Row gutter={[16, 16]}>
				{/* Top Performing Clinics */}
				<Col xs={24} lg={12}>
					<TopPerformingClinics stats={stats} />
				</Col>

				{/* Pet Cases Widget */}
				{stats.petCases && (
					<Col xs={24} lg={12}>
						<PetCasesWidget stats={stats} loading={loading} />
					</Col>
				)}
			</Row>
		</div>
	);
};

export { Analytics };
export default Analytics;
