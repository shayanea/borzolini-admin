import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface Appointment {
	id: string;
	time: string;
	patientName: string;
	petName: string;
	serviceType: string;
	status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
	priority?: 'low' | 'normal' | 'high' | 'urgent';
}

interface TodaysAppointmentsProps {
	appointments?: Appointment[];
	loading?: boolean;
}

const TodaysAppointments = ({ appointments = [], loading = false }: TodaysAppointmentsProps) => {
	useTranslation('components');
	const navigate = useNavigate();

	const getStatusColor = (status: string) => {
		const colors = {
			pending: 'orange',
			confirmed: 'blue',
			in_progress: 'cyan',
			completed: 'green',
			cancelled: 'red',
		};
		return colors[status as keyof typeof colors] || 'default';
	};

	const getPriorityColor = (priority?: string) => {
		const colors = {
			low: 'default',
			normal: 'blue',
			high: 'orange',
			urgent: 'red',
		};
		return colors[priority as keyof typeof colors] || 'default';
	};

	const columns: ColumnsType<Appointment> = [
		{
			title: 'Time',
			dataIndex: 'time',
			key: 'time',
			width: 100,
			render: (time: string) => (
				<div className='flex items-center gap-2'>
					<ClockCircleOutlined className='text-slate-400' />
					<Text className='font-medium'>{dayjs(time).format('HH:mm')}</Text>
				</div>
			),
		},
		{
			title: 'Patient',
			key: 'patient',
			render: (_, record) => (
				<div>
					<div className='font-medium text-slate-700'>{record.patientName}</div>
					<div className='text-xs text-slate-400'>{record.petName}</div>
				</div>
			),
		},
		{
			title: 'Service',
			dataIndex: 'serviceType',
			key: 'serviceType',
			render: (service: string) => (
				<Text className='text-sm text-slate-600'>{service}</Text>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: string) => (
				<Tag color={getStatusColor(status)} className='capitalize'>
					{status.replace('_', ' ')}
				</Tag>
			),
		},
		{
			title: 'Priority',
			dataIndex: 'priority',
			key: 'priority',
			width: 100,
			render: (priority?: string) =>
				priority && priority !== 'normal' ? (
					<Tag color={getPriorityColor(priority)} className='capitalize'>
						{priority}
					</Tag>
				) : null,
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 80,
			render: (_, record) => (
				<div className='flex gap-1'>
					<Tooltip title="View Details">
						<Button
							type="text"
							size="small"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/appointments/${record.id}`)}
						/>
					</Tooltip>
					{record.status === 'confirmed' && (
						<Tooltip title="Start">
							<Button
								type="text"
								size="small"
								icon={<CheckCircleOutlined />}
								className='text-green-600'
							/>
						</Tooltip>
					)}
				</div>
			),
		},
	];

	return (
		<Card
			title={
				<div className='flex items-center gap-2'>
					<CalendarOutlined className='text-indigo-600' />
					<span className='font-semibold text-slate-700'>Today's Schedule</span>
				</div>
			}
			className='h-full border border-slate-100 shadow-sm rounded-xl'
			bodyStyle={{ padding: 0 }}
			extra={
				<Button
					type="link"
					onClick={() => navigate('/appointments')}
					className='text-indigo-600'
				>
					View All
				</Button>
			}
		>
			{loading || appointments.length > 0 ? (
				<Table
					columns={columns}
					dataSource={appointments}
					rowKey="id"
					loading={loading}
					pagination={false}
					size="small"
					className='compact-table'
					locale={{ emptyText: loading ? null : undefined }}
				/>
			) : (
				<div className='py-12'>
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description="No appointments scheduled for today"
					/>
				</div>
			)}
		</Card>
	);
};

export { TodaysAppointments };
export default TodaysAppointments;
