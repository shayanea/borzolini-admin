import { useMessage } from '@/hooks/common';
import type { PetBulkActionsProps } from '@/types';

const PetBulkActions = ({
	selectedRowKeys,
	onBulkDelete,
	loading = false,
}: PetBulkActionsProps) => {
	const { warning } = useMessage();
	const selectedCount = selectedRowKeys.length;

	if (selectedCount === 0) {
		return null;
	}

	const handleBulkDelete = () => {
		warning('Bulk delete functionality will be implemented');
		onBulkDelete();
	};

	return (
		<div className='bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 flex items-center justify-between'>
			<span className='text-xs font-medium text-blue-700'>
				{selectedCount} selected
			</span>
			<button
				type='button'
				className='px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700'
				onClick={handleBulkDelete}
				disabled={loading}
			>
				Delete
			</button>
		</div>
	);
};

export { PetBulkActions };
export default PetBulkActions;
