import { Button, Card, Form, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import type { TrainingFormSectionProps } from './types';

export function TagsSection({ form }: TrainingFormSectionProps) {
  return (
    <Card title='Tags & Organization'>
      <Form.Item
        label='Tags'
        validateStatus={form.errors.tags ? 'error' : ''}
        help={form.errors.tags}
      >
        <div className='flex gap-2 flex-wrap'>
          {(form.formData.tags || []).map((tag, index) => (
            <div key={index} className='flex items-center gap-2 bg-gray-50 p-2 rounded-md'>
              <Input
                value={tag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.updateTag(index, e.target.value)
                }
                placeholder='Tag name'
                size='small'
                className='w-32'
              />
              <Button
                type='text'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => form.deleteTag(index)}
                danger
              />
            </div>
          ))}
          <Button type='default' size='small' icon={<PlusOutlined />} onClick={form.addTag}>
            Add Tag
          </Button>
        </div>
      </Form.Item>
    </Card>
  );
}

