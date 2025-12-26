import type { FAQ } from '@/types';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

const formatDate = (date: Date | string) => {
	if (!date) return '-';
	const d = new Date(date);
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

interface FAQTableProps {
	faqs: FAQ[];
	loading: boolean;
	pagination: TablePaginationConfig;
	rowSelection?: any;
	onChange: (pagination: TablePaginationConfig, filters: any, sorter: any) => void;
	onEdit: (faq: FAQ) => void;
	onDelete: (id: string) => void;
	onView?: (faq: FAQ) => void;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export const FAQTable = ({
	faqs,
	loading,
	pagination,
	rowSelection,
	onChange,
	onEdit,
	onDelete,
	onView,
	sortBy,
	sortOrder,
}: FAQTableProps) => {
	const columns: ColumnsType<FAQ> = [
		{
			title: 'Question',
			dataIndex: 'question',
			key: 'question',
			width: 200,
			ellipsis: true,
			render: (question: string) => (
				<Tooltip title={question}>
					<span className="font-medium">{question}</span>
				</Tooltip>
			),
		},
		{
			title: 'Answer',
			dataIndex: 'answer',
			key: 'answer',
			ellipsis: true,
			render: (answer: string) => (
				<Tooltip title={answer}>
					<span className="text-gray-600">{answer}</span>
				</Tooltip>
			),
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
			width: 150,
			filters: [
				{ text: 'General Care', value: 'general_care' },
				{ text: 'Health Care', value: 'health_care' },
				{ text: 'Feeding & Nutrition', value: 'feeding_nutrition' },
				{ text: 'Training & Behavior', value: 'training_behavior' },
				{ text: 'Housing & Environment', value: 'housing_environment' },
				{ text: 'Exercise & Activity', value: 'exercise_activity' },
			],
			render: (category: string) => {
				const labels: Record<string, string> = {
					general_care: 'General Care',
					health_care: 'Health Care',
					feeding_nutrition: 'Feeding & Nutrition',
					training_behavior: 'Training & Behavior',
					housing_environment: 'Housing & Environment',
					exercise_activity: 'Exercise & Activity',
				};
				return category ? (
					<Tag color="blue">{labels[category] || category}</Tag>
				) : (
					<Tag color="default">Uncategorized</Tag>
				);
			},
		},
		{
			title: 'Status',
			dataIndex: 'is_active',
			key: 'is_active',
			width: 100,
			filters: [
				{ text: 'Active', value: true },
				{ text: 'Inactive', value: false },
			],
			render: (isActive: boolean) => (
				<Tag color={isActive ? 'success' : 'default'}>
					{isActive ? 'Active' : 'Inactive'}
				</Tag>
			),
		},
		{
			title: 'Created',
			dataIndex: 'created_at',
			key: 'created_at',
			width: 120,
			sorter: true,
			sortOrder: sortBy === 'created_at' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
			render: (date: Date) => formatDate(date),
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 150,
			fixed: 'right',
			render: (_, record) => (
				<Space size="small">
					{onView && (
						<Tooltip title="View">
							<Button
								type="text"
								icon={<EyeOutlined />}
								onClick={() => onView(record)}
								size="small"
							/>
						</Tooltip>
					)}
					<Tooltip title="Edit">
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => onEdit(record)}
							size="small"
						/>
					</Tooltip>
					<Popconfirm
						title="Delete FAQ"
						description="Are you sure you want to delete this FAQ?"
						onConfirm={() => onDelete(record.id)}
						okText="Yes"
						cancelText="No"
						okButtonProps={{ danger: true }}
					>
						<Tooltip title="Delete">
							<Button type="text" danger icon={<DeleteOutlined />} size="small" />
						</Tooltip>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Table<FAQ>
			columns={columns}
			dataSource={faqs}
			loading={loading}
			pagination={pagination}
			rowSelection={rowSelection}
			onChange={onChange}
			rowKey="id"
			scroll={{ x: 1200 }}
			className="faq-table"
		/>
	);
};

export default FAQTable;
