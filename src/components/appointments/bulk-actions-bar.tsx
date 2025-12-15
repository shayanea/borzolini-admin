
import {
    CalendarOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    DownloadOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onConfirm: () => void;
  onRemind: () => void;
  onReschedule: () => void;
  onExport: () => void;
}

const BulkActionsBar = ({
  selectedCount,
  onClear,
  onConfirm,
  onRemind,
  onReschedule,
  onExport,
}: BulkActionsBarProps) => {
  const { t } = useTranslation('components');

  if (selectedCount === 0) return null;

  return (
    <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up'>
      <Card
        className='shadow-2xl border-0 bg-gray-900/90 backdrop-blur-md text-white rounded-2xl overflow-hidden'
        bodyStyle={{ padding: '12px 24px' }}
      >
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-3 border-r border-gray-700 pr-6'>
            <span className='font-semibold text-lg'>{selectedCount}</span>
            <span className='text-gray-300 text-sm'>
              {t('common.selected', 'selected')}
            </span>
            <Button
              type='text'
              icon={<CloseOutlined />}
              onClick={onClear}
              className='text-gray-400 hover:text-white hover:bg-gray-800'
              size='small'
            />
          </div>

          <Space size='middle'>
            <Tooltip title='Mark selected as Confirmed'>
              <Button
                type='primary'
                icon={<CheckCircleOutlined />}
                onClick={onConfirm}
                className='bg-green-600 hover:bg-green-500 border-none'
              >
                Confirm All
              </Button>
            </Tooltip>

            <Tooltip title='Send reminder to patients'>
              <Button
                icon={<MessageOutlined />}
                onClick={onRemind}
                className='text-white bg-transparent border-gray-600 hover:border-gray-400 hover:text-blue-300'
              >
                Remind
              </Button>
            </Tooltip>

            <Tooltip title='Bulk Reschedule (Mock)'>
              <Button
                icon={<CalendarOutlined />}
                onClick={onReschedule}
                className='text-white bg-transparent border-gray-600 hover:border-gray-400 hover:text-orange-300'
              >
                Reschedule
              </Button>
            </Tooltip>
            
            <Tooltip title='Export selected'>
              <Button
                icon={<DownloadOutlined />}
                onClick={onExport}
                className='text-white bg-transparent border-gray-600 hover:border-gray-400 hover:text-green-300'
              >
                Export
              </Button>
            </Tooltip>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default BulkActionsBar;
