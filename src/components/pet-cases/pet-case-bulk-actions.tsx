import { Button, Dropdown, Space } from 'antd';
// Pet Case Bulk Actions Component
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { useMessage } from '../../hooks/use-message';
import { useTranslation } from 'react-i18next';

interface PetCaseBulkActionsProps {
  selectedCaseIds: string[];
  onBulkUpdate: (caseIds: string[], action: string) => void;
  onClearSelection: () => void;
  loading?: boolean;
}

function PetCaseBulkActions({
  selectedCaseIds,
  onBulkUpdate,
  onClearSelection,
  loading = false,
}: PetCaseBulkActionsProps) {
  const { t } = useTranslation('components');
  const { success, error, warning, info } = useMessage();
  const handleBulkAction = (action: string) => {
    if (selectedCaseIds.length === 0) {
      warning(t('petCaseBulkActions.pleaseSelectCases'));
      return;
    }

    switch (action) {
      case 'mark_resolved':
        onBulkUpdate(selectedCaseIds, 'resolved');
        success(t('petCaseBulkActions.markedAsResolved', { count: selectedCaseIds.length }));
        break;
      case 'mark_pending':
        onBulkUpdate(selectedCaseIds, 'pending_consultation');
        success(t('petCaseBulkActions.markedAsPending', { count: selectedCaseIds.length }));
        break;
      case 'mark_urgent':
        onBulkUpdate(selectedCaseIds, 'urgent');
        success(t('petCaseBulkActions.markedAsUrgent', { count: selectedCaseIds.length }));
        break;
      case 'delete':
        // TODO: Implement delete confirmation modal
        info(t('petCaseBulkActions.deleteComingSoon'));
        break;
      default:
        error(t('petCaseBulkActions.unknownAction'));
    }
  };

  const bulkActionItems = [
    {
      key: 'mark_resolved',
      label: t('petCaseBulkActions.markAsResolved'),
      icon: <CheckCircleOutlined />,
      onClick: () => handleBulkAction('mark_resolved'),
    },
    {
      key: 'mark_pending',
      label: t('petCaseBulkActions.markAsPending'),
      icon: <ClockCircleOutlined />,
      onClick: () => handleBulkAction('mark_pending'),
    },
    {
      key: 'mark_urgent',
      label: t('petCaseBulkActions.markAsUrgent'),
      icon: <ExclamationCircleOutlined />,
      onClick: () => handleBulkAction('mark_urgent'),
    },
    {
      key: 'divider',
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: t('petCaseBulkActions.deleteCases'),
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
        {selectedCaseIds.length === 1
          ? t('petCaseBulkActions.casesSelected', { count: selectedCaseIds.length })
          : t('petCaseBulkActions.casesSelectedPlural', { count: selectedCaseIds.length })}
      </span>

      <Space size='small'>
        <Dropdown menu={{ items: bulkActionItems }} trigger={['click']} disabled={loading}>
          <Button size='small' loading={loading}>
            <MoreOutlined />
            {t('petCaseBulkActions.bulkActions')}
          </Button>
        </Dropdown>

        <Button size='small' onClick={onClearSelection} disabled={loading}>
          {t('petCaseBulkActions.clearSelection')}
        </Button>
      </Space>
    </div>
  );
}

export { PetCaseBulkActions };
export default PetCaseBulkActions;
