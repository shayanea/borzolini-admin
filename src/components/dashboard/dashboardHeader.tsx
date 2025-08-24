import React from 'react';
import { Typography, Space, Button, DatePicker } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { DashboardHeaderProps } from '@/types/dashboard';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onDateRangeChange,
  onClearFilters,
  onRefresh,
  loading,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Title level={2} className="!mb-2">
          Dashboard
        </Title>
        <Text className="text-text-light">
          Welcome back! Here's what's happening with your clinic today.
        </Text>
      </div>
      
      <Space>
        <RangePicker
          onChange={onDateRangeChange}
          placeholder={['Start Date', 'End Date']}
          className="w-64"
        />
        <Button
          icon={<FilterOutlined />}
          onClick={onClearFilters}
          className="border-gray-300 text-text-primary hover:border-primary-navy hover:text-primary-navy"
        >
          Clear Filters
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          className="border-gray-300 text-text-primary hover:border-primary-navy hover:text-primary-navy"
        >
          Refresh
        </Button>
      </Space>
    </div>
  );
};

export default DashboardHeader;
