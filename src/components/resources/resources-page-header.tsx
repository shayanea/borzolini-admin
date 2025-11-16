import { Button, Popconfirm, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;

interface ResourcesPageHeaderProps {
  onCreate: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  loading: boolean;
}

export const ResourcesPageHeader: React.FC<ResourcesPageHeaderProps> = ({
  onCreate,
  selectedCount,
  onBulkDelete,
  loading,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <Title level={2}>Resources Management</Title>
        <Text type="secondary">
          Manage educational resources for pet owners
        </Text>
      </div>
      <Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreate}
        >
          Add Resource
        </Button>
        {selectedCount > 0 && (
          <Popconfirm
            title={`Delete ${selectedCount} resources`}
            description="Are you sure you want to delete the selected resources?"
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
};

