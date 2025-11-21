import { Button, Popconfirm, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface BreedsPageHeaderProps {
  onCreate: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  loading: boolean;
}

export function BreedsPageHeader({
  onCreate,
  selectedCount,
  onBulkDelete,
  loading,
}: BreedsPageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <Title level={2}>Breeds Management</Title>
        <Text type="secondary">
          Manage pet breeds and their information
        </Text>
      </div>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreate}
        >
          Add Breed
        </Button>
        {selectedCount > 0 && (
          <Popconfirm
            title={`Delete ${selectedCount} breeds`}
            description="Are you sure you want to delete the selected breeds?"
            onConfirm={onBulkDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger
              disabled={loading}
            >
              Delete Selected ({selectedCount})
            </Button>
          </Popconfirm>
        )}
      </Space>
    </div>
  );
}

