// Pet Cases Filters Component
import { ClearOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import {
  CASE_PRIORITY_LABELS,
  CASE_STATUS_LABELS,
  CASE_TYPE_LABELS,
  CaseFilters,
} from '../../types/pet-cases';

interface PetCasesFiltersProps {
  filters: CaseFilters;
  onFiltersChange: (filters: CaseFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const PetCasesFilters: React.FC<PetCasesFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleValuesChange = (_changedValues: any, allValues: any) => {
    const newFilters: CaseFilters = {
      ...filters,
      ...allValues,
      date_from: allValues.dateRange?.[0]?.toISOString(),
      date_to: allValues.dateRange?.[1]?.toISOString(),
    };

    // Remove undefined values
    Object.keys(newFilters).forEach(key => {
      const typedKey = key as keyof CaseFilters;
      if (newFilters[typedKey] === undefined || newFilters[typedKey] === null) {
        delete newFilters[typedKey];
      }
    });

    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <div className='bg-white p-4 rounded-lg border border-gray-200 mb-4'>
      <Form
        form={form}
        layout='vertical'
        onValuesChange={handleValuesChange}
        initialValues={{
          status: filters.status || [],
          priority: filters.priority || [],
          case_type: filters.case_type || [],
          pet_id: filters.pet_id || '',
          owner_id: filters.owner_id || '',
          vet_id: filters.vet_id || '',
          is_urgent: filters.is_urgent || false,
          is_resolved: filters.is_resolved || false,
          dateRange:
            filters.date_from && filters.date_to
              ? [dayjs(filters.date_from), dayjs(filters.date_to)]
              : undefined,
        }}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Status Filter */}
          <Form.Item label='Status' name='status'>
            <Select mode='multiple' placeholder='Select statuses' allowClear loading={loading}>
              {Object.entries(CASE_STATUS_LABELS).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Priority Filter */}
          <Form.Item label='Priority' name='priority'>
            <Select mode='multiple' placeholder='Select priorities' allowClear loading={loading}>
              {Object.entries(CASE_PRIORITY_LABELS).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Case Type Filter */}
          <Form.Item label='Case Type' name='case_type'>
            <Select mode='multiple' placeholder='Select case types' allowClear loading={loading}>
              {Object.entries(CASE_TYPE_LABELS).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Date Range Filter */}
          <Form.Item label='Date Range' name='dateRange'>
            <RangePicker
              className='w-full'
              format='YYYY-MM-DD'
              placeholder={['Start Date', 'End Date']}
            />
          </Form.Item>

          {/* Pet ID Filter */}
          <Form.Item label='Pet ID' name='pet_id'>
            <Input placeholder='Enter pet ID' allowClear />
          </Form.Item>

          {/* Owner ID Filter */}
          <Form.Item label='Owner ID' name='owner_id'>
            <Input placeholder='Enter owner ID' allowClear />
          </Form.Item>

          {/* Vet ID Filter */}
          <Form.Item label='Vet ID' name='vet_id'>
            <Input placeholder='Enter vet ID' allowClear />
          </Form.Item>

          {/* Quick Filters */}
          <Form.Item label='Quick Filters'>
            <Space direction='vertical' size='small'>
              <Form.Item name='is_urgent' valuePropName='checked' noStyle>
                <Checkbox>Urgent Cases Only</Checkbox>
              </Form.Item>
              <Form.Item name='is_resolved' valuePropName='checked' noStyle>
                <Checkbox>Resolved Cases Only</Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>

          {/* Actions */}
          <Form.Item label=' '>
            <Space>
              <Button type='primary' icon={<FilterOutlined />} loading={loading}>
                Apply Filters
              </Button>
              <Button icon={<ClearOutlined />} onClick={handleReset} disabled={loading}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default PetCasesFilters;
