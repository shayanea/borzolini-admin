import { Alert, Button, Card, Form, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Typography } from 'antd';
import type { TrainingFormSectionProps } from './types';

const { Text } = Typography;

export const BenefitsSection: React.FC<TrainingFormSectionProps> = ({ form }) => {
  return (
    <Card
      title='Benefits of This Training'
      extra={
        <Text type='secondary' className='text-sm'>
          What will pets and owners gain from completing this training?
        </Text>
      }
    >
      {form.errors.benefits && (
        <Alert
          message='Validation Error'
          description={form.errors.benefits}
          type='error'
          showIcon
          className='mb-4'
        />
      )}
      <Form.Item
        label='Benefits'
        required
        validateStatus={form.errors.benefits ? 'error' : ''}
        help={form.errors.benefits}
      >
        <div className='space-y-2'>
          {(form.formData.benefits || []).map((benefit, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <span className='text-lg mt-1'>✅</span>
              <Input
                value={benefit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.updateBenefit(index, e.target.value)
                }
                placeholder='e.g., Improves focus and impulse control'
              />
              <Button
                type='text'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => form.deleteBenefit(index)}
                danger
              />
            </div>
          ))}
          <Button type='default' size='small' icon={<PlusOutlined />} onClick={form.addBenefit}>
            Add Benefit
          </Button>
        </div>
      </Form.Item>
    </Card>
  );
};

