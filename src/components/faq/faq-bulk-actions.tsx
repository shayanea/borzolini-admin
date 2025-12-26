import { DeleteOutlined } from '@ant-design/icons';
import { Alert, Button, Space } from 'antd';

interface FAQBulkActionsProps {
	selectedCount: number;
	loading: boolean;
	onBulkDelete: () => void;
}

export const FAQBulkActions = ({ selectedCount, loading, onBulkDelete }: FAQBulkActionsProps) => {
	if (selectedCount === 0) return null;

	return (
		<Alert
			message={
				<Space className="w-full justify-between items-center">
					<span>
						<strong>{selectedCount}</strong> FAQ{selectedCount > 1 ? 's' : ''} selected
					</span>
					<Space>
						<Button
							danger
							icon={<DeleteOutlined />}
							onClick={onBulkDelete}
							loading={loading}
						>
							Delete Selected
						</Button>
					</Space>
				</Space>
			}
			type="info"
			className="mb-4"
		/>
	);
};

export default FAQBulkActions;
