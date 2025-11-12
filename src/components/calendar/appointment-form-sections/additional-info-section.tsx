import { Form, Input } from 'antd';
import { FC } from 'react';

import { AdditionalInfoSectionProps } from './types';

const { TextArea } = Input;

export const AdditionalInfoSection: FC<AdditionalInfoSectionProps> = () => {
  return (
    <div className='space-y-4'>
      <Form.Item
        label='Reason for Visit'
        name='reason'
        rules={[{ required: true, message: 'Please provide reason for visit' }]}
      >
        <TextArea rows={2} placeholder='Brief description of why the pet needs to be seen' />
      </Form.Item>

      <Form.Item label='Symptoms' name='symptoms'>
        <TextArea rows={2} placeholder='Describe any symptoms the pet is experiencing' />
      </Form.Item>

      <Form.Item label='Additional Notes' name='notes'>
        <TextArea rows={2} placeholder='Any additional information or special instructions' />
      </Form.Item>
    </div>
  );
};

export default AdditionalInfoSection;
