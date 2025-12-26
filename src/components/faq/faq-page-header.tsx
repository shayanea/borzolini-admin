import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

interface FAQPageHeaderProps {
	onRefresh: () => void;
	onAddFAQ: () => void;
	loading: boolean;
	title?: string;
	subtitle?: string;
	estimatedRecordCount?: number;
}

export const FAQPageHeader = ({
	onRefresh,
	onAddFAQ,
	loading,
	title = 'FAQs',
	subtitle = 'Manage frequently asked questions',
	estimatedRecordCount = 0,
}: FAQPageHeaderProps) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
			<div className="flex items-center justify-between gap-4 mb-3">
				<div>
					<h1 className="text-xl font-bold text-gray-900 mb-0.5">{title}</h1>
					<p className="text-sm text-gray-500">{subtitle}</p>
				</div>

				<Space>
					<Button
						type="text"
						icon={<ReloadOutlined />}
						onClick={onRefresh}
						loading={loading}
						className="text-gray-600"
					>
						Refresh
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={onAddFAQ}
					>
						Add FAQ
					</Button>
				</Space>
			</div>

			{estimatedRecordCount > 0 && (
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						className="px-3 py-1 rounded-md text-xs font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors"
					>
						Total <span className="ml-1 font-semibold">{estimatedRecordCount}</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default FAQPageHeader;
