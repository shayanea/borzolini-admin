import { Button, Popconfirm } from 'antd';
import React from 'react';

interface TrainingBulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  loading: boolean;
}

export const TrainingBulkActions: React.FC<TrainingBulkActionsProps> = ({
  selectedCount,
  onBulkDelete,
  loading,
}) => {
  if (selectedCount === 0) return null;

  return (
    <Popconfirm
      title={`Delete ${selectedCount} training activities`}
      description='Are you sure you want to delete the selected training activities?'
      onConfirm={onBulkDelete}
      okText='Yes'
      cancelText='No'
    >
      <Button danger disabled={loading}>
        Delete Selected ({selectedCount})
      </Button>
    </Popconfirm>
  );
};

