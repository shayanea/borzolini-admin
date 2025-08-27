import {
  APPOINTMENT_PRIORITIES,
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
} from '@/constants/appointments';
import type { AppointmentPriority, AppointmentStatus, AppointmentType } from '@/types';
import {
  AppointmentsFiltersProps,
  AppointmentsFilters as AppointmentsFiltersType,
} from '@/types/appointments';
import { Button, Card, DatePicker, Input, Select, Space } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

import { useState } from 'react';

const { Search } = Input;
const { RangePicker } = DatePicker;

const AppointmentsFilters = ({
  searchText,
  onSearch,
  onFilters,
  onExport,
}: AppointmentsFiltersProps) => {
  const [filters, setFilters] = useState({
    status: undefined,
    type: undefined,
    priority: undefined,
    dateRange: undefined,
  });

  const handleFilterChange = (
    key: keyof AppointmentsFiltersType,
    value: AppointmentStatus | AppointmentType | AppointmentPriority | [string, string] | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      status: undefined,
      type: undefined,
      priority: undefined,
      dateRange: undefined,
    });
    onFilters({});
  };

  const formatOptionLabel = (value: string) => {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className='admin-card'>
      <div className='space-y-4'>
        {/* Search Bar */}
        <div className='flex items-center justify-between'>
          <Search
            placeholder='Search appointments...'
            allowClear
            value={searchText}
            onSearch={onSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Space>
            <Button onClick={onExport}>Export</Button>
          </Space>
        </div>

        {/* Filters */}
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Status:</span>
            <Select
              placeholder='All Statuses'
              style={{ width: 150 }}
              value={filters.status}
              onChange={value => handleFilterChange('status', value)}
              allowClear
            >
              {Object.entries(APPOINTMENT_STATUSES).map(([, value]) => (
                <Select.Option key={value} value={value}>
                  {formatOptionLabel(value)}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Type:</span>
            <Select
              placeholder='All Types'
              style={{ width: 150 }}
              value={filters.type}
              onChange={value => handleFilterChange('type', value)}
              allowClear
            >
              {Object.entries(APPOINTMENT_TYPES).map(([, value]) => (
                <Select.Option key={value} value={value}>
                  {formatOptionLabel(value)}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Priority:</span>
            <Select
              placeholder='All Priorities'
              style={{ width: 150 }}
              value={filters.priority}
              onChange={value => handleFilterChange('priority', value)}
              allowClear
            >
              {Object.entries(APPOINTMENT_PRIORITIES).map(([, value]) => (
                <Select.Option key={value} value={value}>
                  {formatOptionLabel(value)}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>Date Range:</span>
            <RangePicker
              value={filters.dateRange}
              onChange={dates => {
                if (dates && dates.length === 2) {
                  const dateRange: [string, string] = [
                    dates[0]?.toISOString() || '',
                    dates[1]?.toISOString() || '',
                  ];
                  handleFilterChange('dateRange', dateRange);
                } else {
                  handleFilterChange('dateRange', undefined);
                }
              }}
              placeholder={['Start Date', 'End Date']}
            />
          </div>

          <Button icon={<FilterOutlined />} onClick={clearFilters} size='small'>
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentsFilters;
