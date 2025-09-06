// Input Filters Component
import { DatePicker, Form, Input } from 'antd';

import React from 'react';

const { RangePicker } = DatePicker;

const InputFilters: React.FC = () => {
  return (
    <>
      {/* Date Range Filter */}
      <Form.Item
        label={<span className='text-sm font-medium text-gray-700'>Date Range</span>}
        name='dateRange'
        className='mb-0'
      >
        <RangePicker
          className='w-full'
          format='YYYY-MM-DD'
          placeholder={['Start Date', 'End Date']}
          size='middle'
        />
      </Form.Item>

      {/* Pet ID Filter */}
      <Form.Item
        label={<span className='text-sm font-medium text-gray-700'>Pet ID</span>}
        name='pet_id'
        className='mb-0'
      >
        <Input placeholder='Enter pet ID' allowClear size='middle' />
      </Form.Item>

      {/* Owner ID Filter */}
      <Form.Item
        label={<span className='text-sm font-medium text-gray-700'>Owner ID</span>}
        name='owner_id'
        className='mb-0'
      >
        <Input placeholder='Enter owner ID' allowClear size='middle' />
      </Form.Item>

      {/* Vet ID Filter */}
      <Form.Item
        label={<span className='text-sm font-medium text-gray-700'>Vet ID</span>}
        name='vet_id'
        className='mb-0'
      >
        <Input placeholder='Enter vet ID' allowClear size='middle' />
      </Form.Item>
    </>
  );
};

export default InputFilters;
