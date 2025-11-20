import {
  CASE_PRIORITY_LABELS,
  CASE_STATUS_LABELS,
  CASE_TYPE_LABELS,
} from '../../../types/pet-cases';
// Select Filters Component
import { Form, Select } from 'antd';


const { Option } = Select;

interface SelectFiltersProps {
  loading: boolean;
}

function SelectFilters({ loading }: SelectFiltersProps) {
  return (
    <>
      {/* Status Filter */}
      <Form.Item
        label={<span className='text-sm font-medium text-gray-700'>Status</span>}
        name='status'
        className='mb-0'
      >
        <Select
          mode='multiple'
          placeholder='Select statuses'
          allowClear
          loading={loading}
          className='w-full'
          size='middle'
        >
          {Object.entries(CASE_STATUS_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Priority Filter */}
      <Form.Item
        label={<span className='text-sm font-medium text-gray-700'>Priority</span>}
        name='priority'
        className='mb-0'
      >
        <Select
          mode='multiple'
          placeholder='Select priorities'
          allowClear
          loading={loading}
          className='w-full'
          size='middle'
        >
          {Object.entries(CASE_PRIORITY_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Case Type Filter */}
      <Form.Item
        label={<span className='text-sm font-medium text-gray-700'>Case Type</span>}
        name='case_type'
        className='mb-0'
      >
        <Select
          mode='multiple'
          placeholder='Select case types'
          allowClear
          loading={loading}
          className='w-full'
          size='middle'
        >
          {Object.entries(CASE_TYPE_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
}

export { SelectFilters };
export default SelectFilters;
