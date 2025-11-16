import { Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;

interface TrainingPageHeaderProps {
  onCreate: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  loading: boolean;
}

export const TrainingPageHeader: React.FC<TrainingPageHeaderProps> = ({
  onCreate,
  selectedCount,
  onBulkDelete,
  loading,
}) => {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <Title level={2}>Training Management</Title>
        <Text type='secondary'>Manage training activities and assignments for pet owners</Text>
      </div>
      <Space>
        <Button type='primary' icon={<PlusOutlined />} onClick={onCreate}>
          Create Training Activity
        </Button>
        {selectedCount > 0 && (
          <Button danger disabled={loading} onClick={onBulkDelete}>
            Delete Selected ({selectedCount})
          </Button>
        )}
      </Space>
    </div>
  );
};

