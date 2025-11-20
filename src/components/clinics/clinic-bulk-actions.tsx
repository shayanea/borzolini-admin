import { Button, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ClinicBulkActionsProps {
  selectedCount: number;
  loading?: boolean;
  onBulkDelete: () => void;
}

const ClinicBulkActions = ({
  selectedCount,
  loading = false,
  onBulkDelete,
}: ClinicBulkActionsProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
      <div className='flex items-center justify-between'>
        <Text className='text-text-secondary'>
          {selectedCount} clinic{selectedCount !== 1 ? 's' : ''} selected
        </Text>

        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onBulkDelete}
            loading={loading}
            className='flex items-center'
          >
            Delete Selected
          </Button>
        </Space>
      </div>
    </div>
  );
};

export { ClinicBulkActions };
export default ClinicBulkActions;
