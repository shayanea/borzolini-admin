import { Button, Card, Col, Input, Row, Select } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

import { USER_ROLES } from '@/constants/user-management';
import type { UserFiltersProps } from '@/types/user-management';

const { Search } = Input;
const { Option } = Select;

const UserFilters = ({
  searchText,
  selectedRole,
  selectedIsActive,
  onSearch,
  onRoleFilter,
  onIsActiveFilter,
  onClearFilters,
}: UserFiltersProps) => {
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
            value={selectedIsActive}
            onChange={onIsActiveFilter}
            className='w-full'
          >
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
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
