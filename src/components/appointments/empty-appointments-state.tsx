
import { CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';

const { Title, Text } = Typography;

interface EmptyAppointmentsStateProps {
	onCreate: () => void;
}

const EmptyAppointmentsState = ({ onCreate }: EmptyAppointmentsStateProps) => {
	// const { t } = useTranslation('components'); // Assuming translations exist or using hardcoded for now as per design

	return (
		<Card className="text-center py-12 my-12 border border-dashed border-slate-300 shadow-sm rounded-xl bg-slate-50/50">
			<div className="flex flex-col items-center justify-center max-w-md mx-auto">
				<div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
					<CalendarOutlined className="text-3xl text-[#D5992A]" />
				</div>

				<Title level={3} className="!mb-2 !text-slate-800">
					No appointments yet
				</Title>

				<Text className="text-slate-500 mb-8 max-w-xs mx-auto block">
					Your appointment schedule is empty. Get started by creating your first appointment.
				</Text>

				<Space direction="vertical" size="middle" className="w-full max-w-xs">
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="large"
						block
						onClick={onCreate}
						className="h-11 font-medium shadow-md hover:shadow-lg transition-all"
					>
						Create First Appointment
					</Button>
				</Space>
			</div>
		</Card>
	);
};

export default EmptyAppointmentsState;
