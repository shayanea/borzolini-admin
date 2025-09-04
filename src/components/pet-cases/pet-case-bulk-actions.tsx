// Pet Case Bulk Actions Component
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space, message } from 'antd';
import React from 'react';

interface PetCaseBulkActionsProps {
  selectedCaseIds: string[];
  onBulkUpdate: (caseIds: string[], action: string) => void;
  onClearSelection: () => void;
  loading?: boolean;
}

const PetCaseBulkActions: React.FC<PetCaseBulkActionsProps> = ({
  selectedCaseIds,
  onBulkUpdate,
  onClearSelection,
  loading = false,
}) => {
  const handleBulkAction = (action: string) => {
    if (selectedCaseIds.length === 0) {
      message.warning('Please select cases first');
      return;
    }

    switch (action) {
      case 'mark_resolved':
        onBulkUpdate(selectedCaseIds, 'resolved');
        message.success(`Marked ${selectedCaseIds.length} cases as resolved`);
        break;
      case 'mark_pending':
        onBulkUpdate(selectedCaseIds, 'pending_consultation');
        message.success(`Marked ${selectedCaseIds.length} cases as pending`);
        break;
      case 'mark_urgent':
        onBulkUpdate(selectedCaseIds, 'urgent');
        message.success(`Marked ${selectedCaseIds.length} cases as urgent`);
        break;
      case 'delete':
        // TODO: Implement delete confirmation modal
        message.info('Delete functionality coming soon');
        break;
      default:
        message.error('Unknown action');
    }
  };

  const bulkActionItems = [
    {
      key: 'mark_resolved',
      label: 'Mark as Resolved',
      icon: <CheckCircleOutlined />,
      onClick: () => handleBulkAction('mark_resolved'),
    },
    {
      key: 'mark_pending',
      label: 'Mark as Pending',
      icon: <ClockCircleOutlined />,
      onClick: () => handleBulkAction('mark_pending'),
    },
    {
      key: 'mark_urgent',
      label: 'Mark as Urgent',
      icon: <ExclamationCircleOutlined />,
      onClick: () => handleBulkAction('mark_urgent'),
    },
    {
      key: 'divider',
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: 'Delete Cases',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleBulkAction('delete'),
    },
  ];

  if (selectedCaseIds.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded'>
      <span className='text-sm text-blue-700'>
        {selectedCaseIds.length} case{selectedCaseIds.length > 1 ? 's' : ''} selected
      </span>

      <Space size='small'>
        <Dropdown menu={{ items: bulkActionItems }} trigger={['click']} disabled={loading}>
          <Button size='small' loading={loading}>
            <MoreOutlined />
            Bulk Actions
          </Button>
        </Dropdown>

        <Button size='small' onClick={onClearSelection} disabled={loading}>
          Clear Selection
        </Button>
      </Space>
    </div>
  );
};

export default PetCaseBulkActions;
