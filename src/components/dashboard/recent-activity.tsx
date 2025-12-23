import {
	CalendarOutlined,
	ClockCircleOutlined,
	FolderOutlined,
	HomeOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Card, List, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardStats } from '@/types';

const { Text } = Typography;

interface RecentActivityProps {
	stats: DashboardStats;
}

interface ActivityStyle {
	icon: React.ReactNode;
	gradient: string;
	textColor: string;
}

const RecentActivity = ({ stats }: RecentActivityProps) => {
	const { t } = useTranslation('components');

	const getActivityStyle = (type: string): ActivityStyle => {
		switch (type) {
			case 'user_registration':
				return {
					icon: <UserOutlined />,
					gradient: '#667eea',
					textColor: '#667eea',
				};
			case 'clinic_registration':
				return {
					icon: <HomeOutlined />,
					gradient: '#06b6d4',
					textColor: '#06b6d4',
				};
			case 'appointment_created':
				return {
					icon: <CalendarOutlined />,
					gradient: '#ec4899',
					textColor: '#ec4899',
				};
			default:
				return {
					icon: <ClockCircleOutlined />,
					gradient: '#10b981',
					textColor: '#10b981',
				};
		}
	};

	function renderActivityItem(item: any) {
		const style = getActivityStyle(item.type);

		return (
			<List.Item className='!px-0 !py-3 !border-b-slate-50 last:!border-b-0'>
				<div className='flex items-start gap-3 w-full'>
					{/* Icon */}
					<div
						className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm'
						style={{ backgroundColor: style.gradient }}
					>
						{style.icon}
					</div>

					{/* Content */}
					<div className='flex-1 min-w-0'>
						<div className='flex justify-between items-start'>
							<span className='font-medium text-slate-700 text-sm'>
								{item.description}
							</span>
							<span className='text-xs text-slate-400 whitespace-nowrap ml-2'>
								{new Date(item.timestamp).toLocaleDateString()}
							</span>
						</div>

						<div className='mt-1'>
							{item.userName && (
								<div
									className='text-xs font-medium'
									style={{ color: style.textColor }}
								>
									{item.userName}
								</div>
							)}
							{/* Clinic name if relevant, simplified */}
						</div>
					</div>
				</div>
			</List.Item>
		);
	}

	const hasActivity = stats.recentActivity && stats.recentActivity.length > 0;

	return (
		<Card
			title={
				<span className='font-semibold text-slate-700'>
					{t('dashboard.recentActivity.title')}
				</span>
			}
			className='h-full border border-slate-100 shadow-sm rounded-xl'
			bodyStyle={{ padding: '0 16px 16px' }}
			headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '0 16px' }}
		>
			{hasActivity ? (
				<List
					itemLayout='horizontal'
					dataSource={stats.recentActivity}
					rowKey='id'
					renderItem={renderActivityItem}
					className='w-full'
				/>
			) : (
				<div className='py-8 text-center'>
					<FolderOutlined className='text-2xl text-slate-300 mb-2' />
					<Text className='text-sm text-slate-400 block'>
						{t('dashboard.recentActivity.noData')}
					</Text>
				</div>
			)}
		</Card>
	);
};

export { RecentActivity };
export default RecentActivity;
