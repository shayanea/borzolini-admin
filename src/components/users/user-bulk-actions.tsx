import { Button, Space, Typography } from 'antd';

import type { UserBulkActionsProps } from '@/types/user-management';

const { Text } = Typography;


const UserBulkActions = ({ selectedCount, loading, onBulkDelete }: UserBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
      <Space>
        <Text className='text-blue-700'>{selectedCount} user(s) selected</Text>
        <Button danger loading={loading} onClick={onBulkDelete}>
          Delete Selected
        </Button>
      </Space>
    </div>
  );
};

export default UserBulkActions;
