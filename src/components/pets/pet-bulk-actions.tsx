import { Button, Space, message } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

import type { PetBulkActionsProps } from '@/types';

const PetBulkActions = ({
  selectedRowKeys,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  loading = false,
}: PetBulkActionsProps) => {
  const selectedCount = selectedRowKeys.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleBulkDelete = () => {
    message.warning('Bulk delete functionality will be implemented');
    onBulkDelete();
  };

  const handleBulkActivate = () => {
    message.success(`Activated ${selectedCount} pets`);
    onBulkActivate();
  };

  const handleBulkDeactivate = () => {
    message.success(`Deactivated ${selectedCount} pets`);
    onBulkDeactivate();
  };

  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
      <div className='flex justify-between items-center'>
        <div className='text-blue-700'>
          <strong>{selectedCount}</strong> pet{selectedCount > 1 ? 's' : ''} selected
        </div>
        <Space>
          <Button
            icon={<CheckOutlined />}
            onClick={handleBulkActivate}
            loading={loading}
            size='small'
          >
            Activate
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={handleBulkDeactivate}
            loading={loading}
            size='small'
          >
            Deactivate
          </Button>
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

export default PetBulkActions;
