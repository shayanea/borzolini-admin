import {
	CalendarOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	ExclamationCircleOutlined,
	HomeOutlined,
	RiseOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardStats } from '@/types';

interface StatisticsCardsProps {
	stats: DashboardStats;
}
const { Text } = Typography;

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: React.ReactNode;
	icon?: React.ReactNode;
	trend?: { value: number; label: string };
	loading?: boolean;
}

const StatCard = ({ title, value, subtitle, icon, trend }: StatCardProps) => {
	return (
		<Card className='h-full border border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300'>
			<div className='flex justify-between items-start mb-2'>
				<Text className='text-slate-500 font-medium text-sm'>{title}</Text>
				{icon && <div className='p-2 bg-slate-50 rounded-lg text-slate-400'>{icon}</div>}
			</div>

			<div className='space-y-1'>
				<div className='text-2xl font-bold text-slate-800 tracking-tight'>{value}</div>

				<div className='flex items-center gap-2 text-xs'>
					{trend && (
						<span className={`flex items-center font-medium ${trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
							{trend.value >= 0 ? <RiseOutlined className="mr-1" /> : <RiseOutlined className="mr-1 rotate-180" />}
							{Math.abs(trend.value)}%
						</span>
					)}
					{subtitle && <span className='text-slate-400'>{subtitle}</span>}
				</div>
			</div>
		</Card>
	);
};

const StatisticsCards = ({ stats }: StatisticsCardsProps) => {
	const { t } = useTranslation('components');

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title={t('dashboard.stats.totalUsers')}
					value={stats.totalUsers}
					trend={{ value: 12, label: 'vs last month' }}
					icon={<UserOutlined />}
					subtitle={`+${stats.newUsersThisWeek} this week`}
				/>
			</Col>

			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title={t('dashboard.stats.appointmentsToday')}
					value={stats.appointmentsToday}
					icon={<CalendarOutlined />}
					subtitle={`${stats.pendingAppointments} pending`}
				/>
			</Col>

			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title={t('dashboard.stats.veterinarians')}
					value={stats.totalVeterinarians}
					icon={<TeamOutlined />}
					subtitle={`${stats.totalClinics} clinics`}
				/>
			</Col>

			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title={t('dashboard.stats.monthlyRevenue')}
					value="0 USD"
					trend={{ value: 0, label: 'vs last month' }}
					icon={<DollarOutlined />}
				/>
			</Col>

			{/* Second Row compact */}
			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title={t('dashboard.stats.totalClinics')}
					value={stats.totalClinics}
					icon={<HomeOutlined />}
					subtitle={`+${stats.newClinicsThisMonth} new`}
				/>
			</Col>

			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title={t('dashboard.stats.urgentCases')}
					value={stats.urgentAppointments}
					icon={<ExclamationCircleOutlined className="text-rose-500" />}
					subtitle="Require attention"
				/>
			</Col>

			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title="Avg Duration"
					value={`${stats.averageAppointmentDuration} min`}
					icon={<ClockCircleOutlined />}
					subtitle="Per appointment"
				/>
			</Col>

			<Col xs={24} sm={12} lg={6}>
				<StatCard
					title={t('dashboard.stats.activePatients')}
					value={stats.totalPatients} // active patients count usually subset, but using total for now as placeholder or mapping correctly
					icon={<UserOutlined />}
				/>
			</Col>
		</Row>
	);
};

export { StatisticsCards };
export default StatisticsCards;
