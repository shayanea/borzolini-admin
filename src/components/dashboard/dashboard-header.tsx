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
    <div className='space-y-6 p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm'>
      {/* Title and Welcome Message */}
      <div className='space-y-2'>
        <Title level={1} className='!mb-0 !text-4xl !font-bold !text-slate-800 !tracking-tight'>
          {t('dashboard.title')}
        </Title>
        <Text className='text-base text-slate-600 font-medium'>
          {t('dashboard.welcomeMessage')}
        </Text>
      </div>

      {/* Date Filters and Actions */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm'>
            <span className='text-sm font-semibold text-slate-700'>
              {t('dashboard.dateRange')}:
            </span>
            <RangePicker
              onChange={onDateRangeChange}
              placeholder={[t('dashboard.startDate'), t('dashboard.endDate')]}
              className='border-0 shadow-none'
              format='YYYY-MM-DD'
            />
          </div>
        </div>

        <Space size='middle'>
          <Button
            icon={<FilterOutlined />}
            onClick={onClearFilters}
            className='h-10 px-5 rounded-xl font-medium border-slate-200 text-slate-700 bg-white hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all duration-300'
          >
            {t('dashboard.clearFilters')}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            className='h-10 px-5 rounded-xl font-medium text-white shadow-md hover:shadow-lg transition-all duration-300'
            style={{
              backgroundColor: '#667eea',
              border: 'none',
            }}
          >
            {t('dashboard.refresh')}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default DashboardHeader;
