import { ExportOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Input, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';

import type { ContactFilters as ContactFiltersType } from '@/types';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ContactFiltersProps {
  filters: ContactFiltersType;
  onFiltersChange: (filters: ContactFiltersType) => void;
  onExport: () => void;
  onReset: () => void;
}

export const ContactFilters = ({
  filters,
  onFiltersChange,
  onExport,
  onReset,
}: ContactFiltersProps) => {
  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status as ContactFiltersType['status'],
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    onFiltersChange({
      ...filters,
      dateFrom: dates?.[0]?.format('YYYY-MM-DD'),
      dateTo: dates?.[1]?.format('YYYY-MM-DD'),
    });
  };

  return (
    <Card className='mb-4'>
      <Row gutter={[16, 16]} align='middle'>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder='Filter by status'
            value={filters.status}
            onChange={handleStatusChange}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value='pending'>Pending</Option>
            <Option value='in_progress'>In Progress</Option>
            <Option value='resolved'>Resolved</Option>
            <Option value='closed'>Closed</Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder='Search contacts...'
            value={filters.search}
            onChange={handleSearchChange}
            prefix={<SearchOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <RangePicker
            placeholder={['From Date', 'To Date']}
            onChange={handleDateRangeChange}
            style={{ width: '100%' }}
          />
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Space>
            <Button
              type='primary'
              icon={<SearchOutlined />}
              onClick={() => onFiltersChange(filters)}
            >
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              Reset
            </Button>
            <Button icon={<ExportOutlined />} onClick={onExport}>
              Export
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
