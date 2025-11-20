// Quick Filters Component
import { Checkbox, Form } from 'antd';


function QuickFilters() {
  return (
    <Form.Item
      label={<span className='text-sm font-medium text-gray-700'>Quick Filters</span>}
      className='mb-0'
    >
      <div className='space-y-3'>
        <Form.Item name='is_urgent' valuePropName='checked' noStyle>
          <Checkbox className='text-sm text-gray-700'>Urgent Cases Only</Checkbox>
        </Form.Item>
        <Form.Item name='is_resolved' valuePropName='checked' noStyle>
          <Checkbox className='text-sm text-gray-700'>Resolved Cases Only</Checkbox>
        </Form.Item>
      </div>
    </Form.Item>
  );
}

export { QuickFilters };
export default QuickFilters;
