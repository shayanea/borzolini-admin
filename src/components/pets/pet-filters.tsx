import { Button, Card, Col, Input, Row, Select } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

import type { PetFiltersProps } from '@/types';

const { Search } = Input;
const { Option } = Select;

const PetFilters = ({
  searchText,
  selectedType,
  selectedOwner,
  isActiveFilter,
  onSearch,
  onTypeFilter,
  onOwnerFilter,
  onActiveFilter,
  onClearFilters,
}: PetFiltersProps) => {
  // Common pet types
  const petTypes = [
    'dog',
    'cat',
    'bird',
    'fish',
    'rabbit',
    'hamster',
    'guinea_pig',
    'reptile',
    'other',
  ];

  return (
    <Card className='admin-card admin-filters'>
      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} sm={12} md={6}>
          <Search
            placeholder='Search pets...'
            allowClear
            value={searchText}
            onSearch={onSearch}
            prefix={<SearchOutlined />}
            className='w-full'
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder='Pet Type'
            allowClear
            value={selectedType}
            onChange={onTypeFilter}
            className='w-full'
          >
            {petTypes.map(type => (
              <Option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder='Owner'
            allowClear
            value={selectedOwner}
            onChange={onOwnerFilter}
            className='w-full'
          >
            {/* This would be populated with actual owner names from the data */}
            <Option value='all'>All Owners</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select
            placeholder='Status'
            allowClear
            value={isActiveFilter}
            onChange={onActiveFilter}
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

export default PetFilters;
