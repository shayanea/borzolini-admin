import {
	FAQBulkActions,
	FAQFilters,
	FAQFormModal,
	FAQPageHeader,
	FAQTable,
} from '@/components/faq';
import { useFAQManagement } from '@/hooks/use-faq-management';
import type { CreateFAQDto, FAQ, UpdateFAQDto } from '@/types';
import { Card } from 'antd';
import { useCallback, useState } from 'react';

const FAQPage = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
	const [modalLoading, setModalLoading] = useState(false);

	const {
		// State
		faqs,
		loading,
		total,
		currentPage,
		pageSize,
		searchText,
		selectedCategory,
		selectedStatus,
		sortBy,
		sortOrder,
		selectedRowKeys,
		bulkLoading,

		// Actions
		handleSearch,
		handleCategoryFilter,
		handleStatusFilter,
		clearFilters,
		handleTableChange,
		handleCreateFAQ,
		handleUpdateFAQ,
		handleDeleteFAQ,
		handleBulkDelete,
		setSelectedRowKeys,

		// Utils
		refetch,
	} = useFAQManagement();

	const handleAddFAQ = useCallback(() => {
		setSelectedFAQ(null);
		setIsModalVisible(true);
	}, []);

	const handleEditFAQ = useCallback((faq: FAQ) => {
		setSelectedFAQ(faq);
		setIsModalVisible(true);
	}, []);

	const handleModalSubmit = useCallback(
		async (data: CreateFAQDto | UpdateFAQDto) => {
			setModalLoading(true);
			try {
				if (selectedFAQ) {
					await handleUpdateFAQ(selectedFAQ.id, data as UpdateFAQDto);
				} else {
					await handleCreateFAQ(data as CreateFAQDto);
				}
				setIsModalVisible(false);
				setSelectedFAQ(null);
			} catch (error) {
				// Error is already handled in the hook
			} finally {
				setModalLoading(false);
			}
		},
		[selectedFAQ, handleCreateFAQ, handleUpdateFAQ]
	);

	const handleModalCancel = useCallback(() => {
		setIsModalVisible(false);
		setSelectedFAQ(null);
	}, []);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<FAQPageHeader
				onRefresh={refetch}
				onAddFAQ={handleAddFAQ}
				loading={loading}
				title="FAQs"
				subtitle="Manage frequently asked questions"
				estimatedRecordCount={total}
			/>

			{/* Filters */}
			<FAQFilters
				searchText={searchText}
				selectedCategory={selectedCategory}
				selectedStatus={selectedStatus}
				onSearch={handleSearch}
				onCategoryFilter={handleCategoryFilter}
				onStatusFilter={handleStatusFilter}
				onClearFilters={clearFilters}
			/>

			{/* Bulk Actions */}
			<FAQBulkActions
				selectedCount={selectedRowKeys.length}
				loading={bulkLoading}
				onBulkDelete={handleBulkDelete}
			/>

			{/* FAQ Table */}
			<Card className="admin-card">
				<FAQTable
					faqs={faqs}
					loading={loading}
					pagination={{
						current: currentPage,
						pageSize,
						total,
						showSizeChanger: true,
						showQuickJumper: false,
						showTotal: (total: number, range: [number, number]) =>
							`${range[0]}-${range[1]} of ${total} FAQs`,
						position: ['topCenter', 'bottomCenter'],
						size: 'default',
					}}
					rowSelection={{
						selectedRowKeys,
						onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
					}}
					onChange={handleTableChange}
					onEdit={handleEditFAQ}
					onDelete={handleDeleteFAQ}
					sortBy={sortBy}
					sortOrder={sortOrder}
				/>
			</Card>

			{/* FAQ Form Modal */}
			<FAQFormModal
				visible={isModalVisible}
				faq={selectedFAQ}
				onSubmit={handleModalSubmit}
				onCancel={handleModalCancel}
				loading={modalLoading}
			/>
		</div>
	);
};

export { FAQPage };
export default FAQPage;
