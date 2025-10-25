import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DashboardHeaderProps } from '@/types/dashboard';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardHeader = ({
  onDateRangeChange,
  onClearFilters,
  onRefresh,
  loading,
}: DashboardHeaderProps) => {
  const { t } = useTranslation('pages');

  return (
    <div className='space-y-6'>
      {/* Title and Welcome Message */}
      <div className='space-y-2'>
        <Title level={1} className='!mb-0 !text-3xl !font-semibold !text-text-primary'>
          {t('dashboard.title')}
        </Title>
        <Text className='text-lg text-text-light'>{t('dashboard.welcomeMessage')}</Text>
      </div>

      {/* Date Filters and Actions */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-text-primary'>
              {t('dashboard.dateRange')}:
            </span>
            <RangePicker
              onChange={onDateRangeChange}
              placeholder={[t('dashboard.startDate'), t('dashboard.endDate')]}
              className='w-64'
              format='YYYY-MM-DD'
            />
          </div>
        </div>

        <Space>
          <Button
            icon={<FilterOutlined />}
            onClick={onClearFilters}
            className='h-9 px-4 border-gray-300 text-text-primary hover:border-primary-navy hover:text-primary-navy hover:shadow-sm transition-all'
          >
            {t('dashboard.clearFilters')}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            className='h-9 px-4 border-gray-300 text-text-primary hover:border-primary-navy hover:text-primary-navy hover:shadow-sm transition-all'
          >
            {t('dashboard.refresh')}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default DashboardHeader;
