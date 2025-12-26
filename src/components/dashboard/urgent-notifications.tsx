import { BellOutlined, ClockCircleOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Badge, Card, Empty, List, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface Notification {
	id: string;
	type: 'overdue' | 'pending' | 'emergency' | 'system';
	title: string;
	description: string;
	timestamp: string;
	priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface UrgentNotificationsProps {
	notifications?: Notification[];
	loading?: boolean;
}

const UrgentNotifications = ({ notifications = [], loading = false }: UrgentNotificationsProps) => {
	const getIcon = (type: string) => {
		const icons = {
			overdue: <ClockCircleOutlined className='text-orange-500' />,
			pending: <BellOutlined className='text-blue-500' />,
			emergency: <ExclamationCircleOutlined className='text-red-500' />,
			system: <WarningOutlined className='text-yellow-500' />,
		};
		return icons[type as keyof typeof icons] || <BellOutlined />;
	};

	const getPriorityColor = (priority: string) => {
		const colors = {
			low: 'default',
			medium: 'blue',
			high: 'orange',
			urgent: 'red',
		};
		return colors[priority as keyof typeof colors] || 'default';
	};

	// Sort by priority (urgent first)
	const sortedNotifications = [...notifications].sort((a, b) => {
		const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
		return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
	}).slice(0, 5); // Show max 5

	return (
		<Card
			title={
				<div className='flex items-center justify-between'>
					<span className='font-semibold text-slate-700'>Urgent Notifications</span>
					{notifications.length > 0 && (
						<Badge count={notifications.length} showZero className='ml-2' />
					)}
				</div>
			}
			className='h-full border border-slate-100 shadow-sm rounded-xl'
			styles={{ body: { padding: '0 16px 16px' } }}
		>
			{sortedNotifications.length > 0 ? (
				<List
					itemLayout="horizontal"
					dataSource={sortedNotifications}
					loading={loading}
					renderItem={(item) => (
						<List.Item className='!px-0 !py-3 !border-b-slate-50'>
							<div className='flex items-start gap-3 w-full'>
								<div className='text-xl mt-1'>{getIcon(item.type)}</div>
								<div className='flex-1 min-w-0'>
									<div className='flex items-start justify-between gap-2'>
										<div className='flex-1'>
											<div className='font-medium text-slate-700 text-sm mb-1'>
												{item.title}
											</div>
											<Text className='text-xs text-slate-500 line-clamp-2'>
												{item.description}
											</Text>
										</div>
										{item.priority !== 'low' && (
											<Tag color={getPriorityColor(item.priority)} className='capitalize text-xs'>
												{item.priority}
											</Tag>
										)}
									</div>
									<div className='text-xs text-slate-400 mt-1'>
										{dayjs(item.timestamp).fromNow()}
									</div>
								</div>
							</div>
						</List.Item>
					)}
				/>
			) : (
				<div className='py-8 text-center'>
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description="No urgent notifications"
						className='text-slate-400'
					/>
				</div>
			)}
		</Card>
	);
};

export { UrgentNotifications };
export default UrgentNotifications;
