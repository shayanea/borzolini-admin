import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { ClearOutlined, FilterOutlined } from '@ant-design/icons';

import type { ReviewsFilters as ReviewsFiltersType } from '@/types/reviews';

const { RangePicker } = DatePicker;
const { Option } = Select;

export interface ReviewsFiltersProps {
  filters: ReviewsFiltersType;
  onFiltersChange: (filters: Partial<ReviewsFiltersType>) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const ReviewsFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading,
}: ReviewsFiltersProps) => {
  const [form] = Form.useForm();

  const handleValuesChange = (changedValues: Partial<ReviewsFiltersType>) => {
    // Convert date range to proper format
    if (changedValues.dateRange && changedValues.dateRange.length === 2) {
      const [startDate, endDate] = changedValues.dateRange;
      onFiltersChange({
        ...changedValues,
        dateFrom: startDate ? startDate.toISOString() : undefined,
        dateTo: endDate ? endDate.toISOString() : undefined,
        dateRange: changedValues.dateRange,
      });
    } else {
      onFiltersChange(changedValues);
    }
  };

  const handleClearFilters = () => {
    form.resetFields();
    onClearFilters();
  };

  return (
    <Card className='admin-card mb-6'>
      <Form
        form={form}
        layout='vertical'
        onValuesChange={handleValuesChange}
        initialValues={filters}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label='Search' name='search'>
              <Input
                placeholder='Search reviews, users, or clinics...'
                allowClear
                disabled={loading}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item label='Rating' name='rating'>
              <Select placeholder='All ratings' allowClear disabled={loading}>
                <Option value={1}>1 Star</Option>
                <Option value={2}>2 Stars</Option>
                <Option value={3}>3 Stars</Option>
                <Option value={4}>4 Stars</Option>
                <Option value={5}>5 Stars</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item label='Status' name='isPublished'>
              <Select placeholder='All statuses' allowClear disabled={loading}>
                <Option value={true}>Published</Option>
                <Option value={false}>Unpublished</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item label='Verified' name='isVerified'>
              <Select placeholder='All reviews' allowClear disabled={loading}>
                <Option value={true}>Verified</Option>
                <Option value={false}>Unverified</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label='Date Range' name='dateRange'>
              <RangePicker
                className='w-full'
                disabled={loading}
                placeholder={['Start date', 'End date']}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label='Flagged' name='flagged'>
              <Select placeholder='All reviews' allowClear disabled={loading}>
                <Option value={true}>Flagged only</Option>
                <Option value={false}>Not flagged</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label='Moderation' name='requiresModeration'>
              <Select placeholder='All reviews' allowClear disabled={loading}>
                <Option value={true}>Needs moderation</Option>
                <Option value={false}>No moderation needed</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label='Sort By' name='sortBy'>
              <Select placeholder='Sort by' allowClear disabled={loading}>
                <Option value='createdAt'>Date Created</Option>
                <Option value='rating'>Rating</Option>
                <Option value='helpfulVotes'>Helpful Votes</Option>
                <Option value='updatedAt'>Last Updated</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label='Sort Order' name='sortOrder'>
              <Select placeholder='Sort order' allowClear disabled={loading}>
                <Option value='asc'>Ascending</Option>
                <Option value='desc'>Descending</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Space className='flex justify-end'>
              <Button icon={<ClearOutlined />} onClick={handleClearFilters} disabled={loading}>
                Clear Filters
              </Button>
              <Button type='primary' icon={<FilterOutlined />} disabled={loading}>
                Apply Filters
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ReviewsFilters;
