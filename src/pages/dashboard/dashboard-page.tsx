import { ErrorState, LoadingState } from '@/components/common';
import {
	QuickActions,
	RecentActivity,
	TodaysAppointments,
	TodaysMetrics,
	UrgentNotifications,
} from '@/components/dashboard';
import { BarChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useDashboard } from '@/hooks/dashboard';

const { Title, Text } = Typography;

const Dashboard = () => {
	const { t } = useTranslation('pages');
	const navigate = useNavigate();
	const {
		stats,
		loading,
		error,
		handleRefresh,
		isRefreshing,
	} = useDashboard();

	if (loading && !stats) {
		return <LoadingState message={t('dashboard.loading')} fullScreen />;
	}

	if (error) {
		return (
			<ErrorState
				title={t('dashboard.errorTitle')}
				message={error}
				onRetry={handleRefresh}
				retryText={t('dashboard.retry')}
			/>
		);
	}

	if (!stats) {
		return (
			<ErrorState
				title={t('dashboard.noDataTitle')}
				message={t('dashboard.noDataMessage')}
				type='warning'
			/>
		);
	}

	// Mock data for today's appointments (in real app, fetch from API)
	const todaysAppointments = [
		{
			id: '1',
			time: dayjs().hour(9).minute(0).toISOString(),
			patientName: 'John Doe',
			petName: 'Max',
			serviceType: 'Checkup',
			status: 'confirmed' as const,
			priority: 'normal' as const,
		},
		{
			id: '2',
			time: dayjs().hour(10).minute(30).toISOString(),
			patientName: 'Jane Smith',
			petName: 'Bella',
			serviceType: 'Vaccination',
			status: 'in_progress' as const,
			priority: 'high' as const,
		},
		{
			id: '3',
			time: dayjs().hour(14).minute(0).toISOString(),
			patientName: 'Mike Johnson',
			petName: 'Charlie',
			serviceType: 'Surgery',
			status: 'pending' as const,
			priority: 'urgent' as const,
		},
	];

	// Mock urgent notifications
	const urgentNotifications = [
		{
			id: '1',
			type: 'emergency' as const,
			title: 'Emergency Case Incoming',
			description: 'Patient with severe injury arriving in 15 minutes',
			timestamp: dayjs().subtract(5, 'minute').toISOString(),
			priority: 'urgent' as const,
		},
		{
			id: '2',
			type: 'overdue' as const,
			title: 'Overdue Appointment',
			description: 'Mr. Brown has not arrived for 10:00 AM appointment',
			timestamp: dayjs().subtract(30, 'minute').toISOString(),
			priority: 'high' as const,
		},
		{
			id: '3',
			type: 'pending' as const,
			title: 'Pending Confirmation',
			description: '3 appointments need confirmation for tomorrow',
			timestamp: dayjs().subtract(1, 'hour').toISOString(),
			priority: 'medium' as const,
		},
	];

	return (
		<div className='space-y-4'>
			{/* Page Header */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
				<div>
					<Title level={2} className='!mb-1 !font-bold !text-slate-800'>
						{t('dashboard.title')}
					</Title>
					<Text className='text-slate-500'>
						{dayjs().format('dddd, MMMM D, YYYY')}
					</Text>
				</div>

				<div className='flex items-center gap-3'>
					<Button
						icon={<BarChartOutlined />}
						onClick={() => navigate('/analytics')}
						className='rounded-lg'
					>
						View Analytics
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

			{/* Today's Metrics */}
			<TodaysMetrics
				appointmentsToday={stats.appointmentsToday}
				pendingCount={stats.pendingAppointments}
				urgentCount={stats.urgentAppointments}
				activeStaff={stats.totalVeterinarians}
				loading={loading}
			/>

			{/* Main Content */}
			<Row gutter={[16, 16]}>
				{/* Today's Appointments - 70% width */}
				<Col xs={24} lg={16}>
					<TodaysAppointments
						appointments={todaysAppointments}
						loading={loading}
					/>
				</Col>

				{/* Sidebar - 30% width */}
				<Col xs={24} lg={8}>
					<div className='space-y-4'>
						{/* Quick Actions */}
						<QuickActions />

						{/* Urgent Notifications */}
						<UrgentNotifications
							notifications={urgentNotifications}
							loading={loading}
						/>
					</div>
				</Col>
			</Row>

			{/* Recent Activity - Compact */}
			<RecentActivity stats={stats} />
		</div>
	);
};

export { Dashboard };
export default Dashboard;
