import { Button, Col, Input, Row, Select, Space } from 'antd';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface ClinicFiltersProps {
  searchText: string;
  selectedCity: string | null;
  selectedStatus: boolean | null;
  onSearch: (value: string) => void;
  onCityFilter: (value: string | null) => void;
  onStatusFilter: (value: boolean | null) => void;
  onClearFilters: () => void;
}

const ClinicFilters = ({
  searchText,
  selectedCity,
  selectedStatus,
  onSearch,
  onCityFilter,
  onStatusFilter,
  onClearFilters,
}: ClinicFiltersProps) => {
  const hasActiveFilters = searchText || selectedCity || selectedStatus !== null;

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
      <Row gutter={[16, 16]} align='middle'>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder='Search clinics...'
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
            onSearch={onSearch}
            prefix={<SearchOutlined />}
            allowClear
            className='w-full'
          />
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder='Filter by city'
            value={selectedCity}
            onChange={onCityFilter}
            allowClear
            className='w-full'
          >
            <Option value='New York'>New York</Option>
            <Option value='Los Angeles'>Los Angeles</Option>
            <Option value='Chicago'>Chicago</Option>
            <Option value='Houston'>Houston</Option>
            <Option value='Phoenix'>Phoenix</Option>
            <Option value='Philadelphia'>Philadelphia</Option>
            <Option value='San Antonio'>San Antonio</Option>
            <Option value='San Diego'>San Diego</Option>
            <Option value='Dallas'>Dallas</Option>
            <Option value='San Jose'>San Jose</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder='Filter by status'
            value={selectedStatus}
            onChange={onStatusFilter}
            allowClear
            className='w-full'
          >
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Space>
            {hasActiveFilters && (
              <Button
                icon={<ClearOutlined />}
                onClick={onClearFilters}
                className='flex items-center'
              >
                Clear Filters
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ClinicFilters;
