import { CalendarOutlined, ClockCircleOutlined, ExclamationCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

interface TodaysMetricsProps {
	appointmentsToday: number;
	pendingCount: number;
	urgentCount: number;
	activeStaff: number;
	loading?: boolean;
}

const TodaysMetrics = ({
	appointmentsToday,
	pendingCount,
	urgentCount,
	activeStaff,
	loading = false,
}: TodaysMetricsProps) => {
	const metrics = [
		{
			title: "Today's Appointments",
			value: appointmentsToday,
			icon: <CalendarOutlined className='text-blue-500' />,
			color: 'blue',
		},
		{
			title: 'Pending Tasks',
			value: pendingCount,
			icon: <ClockCircleOutlined className='text-orange-500' />,
			color: 'orange',
		},
		{
			title: 'Urgent Cases',
			value: urgentCount,
			icon: <ExclamationCircleOutlined className='text-red-500' />,
			color: 'red',
		},
		{
			title: 'Active Staff',
			value: activeStaff,
			icon: <TeamOutlined className='text-green-500' />,
			color: 'green',
		},
	];

	return (
		<Row gutter={[16, 16]}>
			{metrics.map((metric, index) => (
				<Col xs={12} sm={6} key={index}>
					<Card
						className='border border-slate-100 shadow-sm rounded-lg hover:shadow-md transition-shadow'
						styles={{ body: { padding: '16px' } }}
						loading={loading}
					>
						<div className='flex items-center justify-between'>
							<div>
								<div className='text-xs text-slate-500 mb-1'>{metric.title}</div>
								<Statistic
									value={metric.value}
									valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}
								/>
							</div>
							<div className='text-2xl'>{metric.icon}</div>
						</div>
					</Card>
				</Col>
			))}
		</Row>
	);
};

export { TodaysMetrics };
export default TodaysMetrics;
