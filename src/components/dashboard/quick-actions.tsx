import {
	CalendarOutlined,
	PlusOutlined,
	TeamOutlined,
	UserAddOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';

const QuickActions = () => {
	useTranslation('components');
	const navigate = useNavigate();

	const actions = [
		{
			key: 'new-appointment',
			label: 'New Appointment',
			icon: CalendarOutlined,
			onClick: () => navigate(ROUTES.APPOINTMENTS_CREATE),
			type: 'primary' as const,
			tooltip: 'Schedule a new appointment',
		},
		{
			key: 'new-patient',
			label: 'New Patient',
			icon: UserAddOutlined,
			onClick: () => navigate(ROUTES.PATIENTS_CREATE),
			type: 'default' as const,
			tooltip: 'Register a new patient',
		},
		{
			key: 'view-schedule',
			label: 'Schedule',
			icon: CalendarOutlined,
			onClick: () => navigate(ROUTES.CALENDAR),
			type: 'default' as const,
			tooltip: "View today's schedule",
		},
		{
			key: 'manage-staff',
			label: 'Staff',
			icon: TeamOutlined,
			onClick: () => navigate(ROUTES.STAFF),
			type: 'default' as const,
			tooltip: 'Manage clinic staff',
		},
	];

	return (
		<Card
			title={
				<div className='flex items-center gap-2'>
					<PlusOutlined className='text-indigo-600' />
					<span className='font-semibold text-slate-700'>Quick Actions</span>
				</div>
			}
			className='h-full border border-slate-100 shadow-sm rounded-xl'
			bodyStyle={{ padding: '16px' }}
		>
			<Row gutter={[12, 12]}>
				{actions.map((action) => {
					const IconComponent = action.icon;
					return (
						<Col span={12} key={action.key}>
							<Tooltip title={action.tooltip} placement="top">
								<Button
									onClick={action.onClick}
									block
									size="large"
									className={`
										h-auto py-4 rounded-lg font-medium transition-all
										${action.type === 'primary'
											? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-600 hover:border-indigo-500'
											: 'bg-white border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-700'
										}
									`}
								>
									<div className='flex flex-col items-center gap-2'>
										<IconComponent className='text-xl' />
										<span className='text-xs font-medium'>{action.label}</span>
									</div>
								</Button>
							</Tooltip>
						</Col>
					);
				})}
			</Row>

			{/* Additional Quick Links */}
			<div className='mt-4 pt-4 border-t border-slate-100'>
				<div className='flex gap-2'>
					<Button
						type="text"
						size="small"
						onClick={() => navigate(ROUTES.REPORTS)}
						className='text-slate-500 hover:text-indigo-600 text-xs'
					>
						Reports
					</Button>
					<Button
						type="text"
						size="small"
						onClick={() => navigate(ROUTES.SETTINGS)}
						className='text-slate-500 hover:text-indigo-600 text-xs'
					>
						Settings
					</Button>
				</div>
			</div>
		</Card>
	);
};

export { QuickActions };
export default QuickActions;
