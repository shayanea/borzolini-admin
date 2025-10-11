import { DatePicker, Form, InputNumber, Select, TimePicker } from 'antd';
import { FC } from 'react';
import dayjs from 'dayjs';

import { SchedulingSectionProps } from './types';

const { Option } = Select;

export const SchedulingSection: FC<SchedulingSectionProps> = ({ 
  form, 
  priorities, 
  statuses, 
  currentDate = dayjs() 
}) => {
  return (
    <div className='space-y-4'>
      <Form.Item
        label='Date'
        name='scheduled_date'
        rules={[{ required: true, message: 'Please select date' }]}
      >
        <DatePicker
          className='w-full'
          format='YYYY-MM-DD'
          disabledDate={current => current && current < dayjs().startOf('day')}
        />
      </Form.Item>

      <Form.Item
        label='Time'
        name='scheduled_time'
        rules={[{ required: true, message: 'Please select time' }]}
      >
        <TimePicker className='w-full' format='HH:mm' minuteStep={15} showNow={false} />
      </Form.Item>

      <Form.Item label='Duration (minutes)' name='duration_minutes'>
        <InputNumber className='w-full' min={15} max={480} step={15} placeholder='30' />
      </Form.Item>

      <Form.Item label='Priority' name='priority'>
        <Select placeholder='Select priority'>
          {priorities.map(priority => (
            <Option key={priority.value} value={priority.value}>
              {priority.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label='Status' name='status'>
        <Select placeholder='Select status'>
          {statuses.map(status => (
            <Option key={status.value} value={status.value}>
              {status.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default SchedulingSection;
