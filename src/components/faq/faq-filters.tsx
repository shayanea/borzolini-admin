import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Select, Space } from 'antd';

const { Option } = Select;

interface FAQFiltersProps {
	searchText: string;
	selectedCategory: string | undefined;
	selectedStatus: boolean | undefined;
	onSearch: (value: string) => void;
	onCategoryFilter: (value: string | undefined) => void;
	onStatusFilter: (value: boolean | undefined) => void;
	onClearFilters: () => void;
}

export const FAQFilters = ({
	searchText,
	selectedCategory,
	selectedStatus,
	onSearch,
	onCategoryFilter,
	onStatusFilter,
	onClearFilters,
}: FAQFiltersProps) => {
	const hasActiveFilters = searchText || selectedCategory !== undefined || selectedStatus !== undefined;

	return (
		<Card className="admin-card mb-6">
			<Space size="middle" wrap className="w-full">
				<Input
					placeholder="Search FAQs..."
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => onSearch(e.target.value)}
					style={{ width: 300 }}
					size="large"
					allowClear
				/>

				<Select
					placeholder="Filter by Category"
					value={selectedCategory}
					onChange={onCategoryFilter}
					style={{ width: 200 }}
					size="large"
					allowClear
				>
					<Option value="general_care">General Care</Option>
					<Option value="health_care">Health Care</Option>
					<Option value="feeding_nutrition">Feeding & Nutrition</Option>
					<Option value="training_behavior">Training & Behavior</Option>
					<Option value="housing_environment">Housing & Environment</Option>
					<Option value="exercise_activity">Exercise & Activity</Option>
				</Select>

				<Select
					placeholder="Filter by Status"
					value={selectedStatus}
					onChange={onStatusFilter}
					style={{ width: 150 }}
					size="large"
					allowClear
				>
					<Option value={true}>Active</Option>
					<Option value={false}>Inactive</Option>
				</Select>

				{hasActiveFilters && (
					<Button
						icon={<ClearOutlined />}
						onClick={onClearFilters}
						size="large"
					>
						Clear Filters
					</Button>
				)}
			</Space>
		</Card>
	);
};

export default FAQFilters;
