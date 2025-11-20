import { Button, Card, Col, Input, Row, Select, Space, Switch, TimePicker } from 'antd';
import {
  ClearOutlined,
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

import type { CalendarFilters } from '@/types/calendar';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

// Constants for filter options
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
  { value: 'emergency', label: 'Emergency', color: 'red' },
];

const APPOINTMENT_TYPE_OPTIONS = [
  { value: 'consultation', label: 'General Consultation' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'wellness_exam', label: 'Wellness Exam' },
  { value: 'dental_cleaning', label: 'Dental Cleaning' },
  { value: 'laboratory_test', label: 'Laboratory Test' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'therapy', label: 'Therapy' },
];

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
];

const SORT_OPTIONS = [
  { value: 'startTime', label: 'Start Time' },
  { value: 'clientName', label: 'Client Name' },
  { value: 'petName', label: 'Pet Name' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

interface CalendarFiltersComponentProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: Partial<CalendarFilters>) => void;
  onClearFilters: () => void;
  onSearch: (search: string) => void;
  searchText: string;
  loading?: boolean;
}

function CalendarFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  onSearch,
  searchText,
  loading = false,
}: CalendarFiltersComponentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof CalendarFilters, value: any) => {
    onFiltersChange({ [key]: value });
  };

  const handleSearch = (value: string) => {
    onSearch(value);
    handleFilterChange('search', value);
  };

  const clearAllFilters = () => {
    onClearFilters();
    onSearch('');
  };

  return (
    <Card className='admin-card mb-6'>
      <div className='space-y-4'>
        {/* Search and Basic Filters Row */}
        <Row gutter={[16, 16]} align='middle'>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder='Search appointments...'
              allowClear
              value={searchText}
              onSearch={handleSearch}
              onChange={e => onSearch(e.target.value)}
              prefix={<SearchOutlined />}
              loading={loading}
            />
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder='All Priorities'
              allowClear
              value={filters.priority}
              onChange={value => handleFilterChange('priority', value)}
              className='w-full'
            >
              {PRIORITY_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  <span className={`text-${option.color}-600 font-medium`}>{option.label}</span>
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder='All Types'
              allowClear
              value={filters.appointmentType}
              onChange={value => handleFilterChange('appointmentType', value)}
              className='w-full'
            >
              {APPOINTMENT_TYPE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setIsExpanded(!isExpanded)}
                type={isExpanded ? 'primary' : 'default'}
                size='small'
              >
                {isExpanded ? 'Hide' : 'Show'} Advanced
              </Button>
              <Button icon={<ClearOutlined />} onClick={clearAllFilters} size='small' danger>
                Clear All
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Advanced Filters (Expandable) */}
        {isExpanded && (
          <div className='border-t pt-4 space-y-4'>
            <Row gutter={[16, 16]}>
              {/* Status Filter */}
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Status</label>
                  <Select
                    placeholder='All Statuses'
                    allowClear
                    value={filters.status}
                    onChange={value => handleFilterChange('status', value)}
                    className='w-full'
                  >
                    {STATUS_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              {/* Time Range Filter */}
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Time Range</label>
                  <div className='flex space-x-2'>
                    <TimePicker
                      placeholder='From'
                      format='HH:mm'
                      value={filters.timeFrom ? dayjs(filters.timeFrom, 'HH:mm') : null}
                      onChange={time => handleFilterChange('timeFrom', time?.format('HH:mm'))}
                      className='flex-1'
                    />
                    <TimePicker
                      placeholder='To'
                      format='HH:mm'
                      value={filters.timeTo ? dayjs(filters.timeTo, 'HH:mm') : null}
                      onChange={time => handleFilterChange('timeTo', time?.format('HH:mm'))}
                      className='flex-1'
                    />
                  </div>
                </div>
              </Col>

              {/* Visit Type Filters */}
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Visit Type</label>
                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        checked={filters.isTelemedicine || false}
                        onChange={checked => handleFilterChange('isTelemedicine', checked)}
                        size='small'
                      />
                      <span className='text-sm'>Telemedicine</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        checked={filters.isHomeVisit || false}
                        onChange={checked => handleFilterChange('isHomeVisit', checked)}
                        size='small'
                      />
                      <span className='text-sm'>Home Visit</span>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Sorting Options */}
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>Sort By</label>
                  <div className='flex space-x-2'>
                    <Select
                      placeholder='Sort by'
                      allowClear
                      value={filters.sortBy}
                      onChange={value => handleFilterChange('sortBy', value)}
                      className='flex-1'
                    >
                      {SORT_OPTIONS.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      placeholder='Order'
                      value={filters.sortOrder || 'asc'}
                      onChange={value => handleFilterChange('sortOrder', value)}
                      className='w-20'
                    >
                      <Option value='asc'>
                        <SortAscendingOutlined />
                      </Option>
                      <Option value='desc'>
                        <SortAscendingOutlined style={{ transform: 'scaleY(-1)' }} />
                      </Option>
                    </Select>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Additional Options */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className='flex items-center space-x-2'>
                  <Switch
                    checked={filters.includeCancelled || false}
                    onChange={checked => handleFilterChange('includeCancelled', checked)}
                  />
                  <span className='text-sm'>Include Cancelled Appointments</span>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Card>
  );
}

export { CalendarFiltersComponent };
export default CalendarFiltersComponent;
