import { APPOINTMENT_PRIORITIES, APPOINTMENT_STATUSES, APPOINTMENT_TYPES } from '@/constants';
import type {
  AppointmentPriority,
  AppointmentStatus,
  AppointmentType,
  AppointmentsFiltersProps,
  AppointmentsFilters as AppointmentsFiltersType,
} from '@/types';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';

const { Search } = Input;
const { RangePicker } = DatePicker;

const AppointmentsFilters = ({
  searchText,
  onSearch,
  onFilters,
  onExport,
}: AppointmentsFiltersProps) => {
  const { t } = useTranslation('components');
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
        <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
          <Search
            placeholder={t('appointments.searchPlaceholder')}
            allowClear
            value={searchText}
            onSearch={onSearch}
            className='w-full sm:w-80'
            prefix={<SearchOutlined />}
          />
          <Space>
            <div className='relative'>
              <Button onClick={onExport}>{t('appointments.export')}</Button>
              <span className='absolute -top-4 -right-4 text-xs bg-orange-100 text-orange-600 p-1 rounded-md'>
                {t('appointments.soon')}
              </span>
            </div>
          </Space>
        </div>

        {/* Filters */}
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>{t('appointments.status')}:</span>
            <Select
              placeholder={t('appointments.allStatuses')}
              className='w-40'
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
            <span className='text-sm font-medium'>{t('appointments.type')}:</span>
            <Select
              placeholder={t('appointments.allTypes')}
              className='w-40'
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
            <span className='text-sm font-medium'>{t('appointments.priority')}:</span>
            <Select
              placeholder={t('appointments.allPriorities')}
              className='w-40'
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
            <span className='text-sm font-medium'>{t('appointments.dateRange')}:</span>
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
              placeholder={[t('appointments.startDate'), t('appointments.endDate')]}
              className='w-full sm:w-auto'
            />
          </div>

          <Button icon={<FilterOutlined />} onClick={clearFilters} size='small'>
            {t('appointments.clearFilters')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export { AppointmentsFilters };
export default AppointmentsFilters;
