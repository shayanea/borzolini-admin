import { ACCOUNT_STATUSES, USER_ROLES } from '@/constants/user-management';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Input, Row, Select } from 'antd';

import type { UserFiltersProps } from '@/types/user-management';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserFilters = ({
  searchText,
  selectedRole,
  selectedStatus,
  dateRange,
  onSearch,
  onRoleFilter,
  onStatusFilter,
  onDateRangeChange,
  onClearFilters,
}: UserFiltersProps) => {
  console.log(selectedRole);
  console.log(selectedStatus);
  return (
    <Card className='admin-card admin-filters'>
      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} sm={12} md={6}>
          <Search
            placeholder='Search users...'
            allowClear
            value={searchText}
            onSearch={onSearch}
            prefix={<SearchOutlined />}
            className='w-full'
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder='Role'
            allowClear
            value={selectedRole}
            onChange={onRoleFilter}
            className='w-full'
          >
            <Option value={USER_ROLES.ADMIN}>Admin</Option>
            <Option value={USER_ROLES.VETERINARIAN}>Veterinarian</Option>
            <Option value={USER_ROLES.STAFF}>Staff</Option>
            <Option value={USER_ROLES.PATIENT}>Patient</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder='Status'
            allowClear
            value={selectedStatus}
            onChange={onStatusFilter}
            className='w-full'
          >
            <Option value={ACCOUNT_STATUSES.ACTIVE}>Active</Option>
            <Option value={ACCOUNT_STATUSES.INACTIVE}>Inactive</Option>
            <Option value={ACCOUNT_STATUSES.SUSPENDED}>Suspended</Option>
            <Option value={ACCOUNT_STATUSES.PENDING}>Pending</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <RangePicker
            placeholder={['Start Date', 'End Date']}
            value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
            onChange={onDateRangeChange}
            className='w-full'
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Button icon={<FilterOutlined />} onClick={onClearFilters} className='w-full'>
            Clear Filters
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilters;
