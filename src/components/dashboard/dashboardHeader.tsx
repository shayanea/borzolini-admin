import { Button, DatePicker, Space, Typography } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';

import type { DashboardHeaderProps } from '@/types/dashboard';
import React from 'react';

const { Title, Text } = Typography;

const DashboardHeader = ({
  onDateRangeChange,
  onClearFilters,
  onRefresh,
  loading,
}) => {
  return (
    <div className='space-y-6'>
      {/* Title and Welcome Message */}
      <div className='space-y-2'>
        <Title level={1} className='!mb-0 !text-3xl !font-semibold !text-text-primary'>
          Dashboard
        </Title>
        <Text className='text-lg text-text-light'>
          Welcome back! Here's what's happening with your clinic today.
        </Text>
      </div>

      {/* Date Filters and Actions */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-text-primary'>Start Date:</span>
            <DatePicker
              onChange={date => onDateRangeChange?.(date ? [date, null] : null)}
              placeholder='Start Date'
              className='w-40'
            />
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-text-primary'>End Date:</span>
            <DatePicker
              onChange={date => onDateRangeChange?.(date ? [null, date] : null)}
              placeholder='End Date'
              className='w-40'
            />
          </div>
        </div>

        <Space>
          <Button
            icon={<FilterOutlined />}
            onClick={onClearFilters}
            className='h-9 px-4 border-gray-300 text-text-primary hover:border-primary-navy hover:text-primary-navy hover:shadow-sm transition-all'
          >
            Clear Filters
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            className='h-9 px-4 border-gray-300 text-text-primary hover:border-primary-navy hover:text-primary-navy hover:shadow-sm transition-all'
          >
            Refresh
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default DashboardHeader;
