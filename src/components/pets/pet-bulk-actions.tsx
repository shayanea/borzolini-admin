import { Button, Space } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import type { PetBulkActionsProps } from '@/types';
import { useMessage } from '@/hooks/common';

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
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
      <div className='flex justify-between items-center'>
        <div className='text-blue-700'>
          <strong>{selectedCount}</strong> pet{selectedCount > 1 ? 's' : ''} selected
        </div>
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleBulkDelete}
            loading={loading}
            size='small'
          >
            Delete
          </Button>
        </Space>
      </div>
    </div>
  );
};

export { PetBulkActions };
export default PetBulkActions;
