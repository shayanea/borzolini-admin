import { Button, Card, Form, Input } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import React from 'react';
import type { TrainingFormSectionProps } from './types';

export const MediaSection: React.FC<TrainingFormSectionProps> = ({ form }) => {
  return (
    <Card title='Media & Resources'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item label='Video URL (optional)'>
          <Input
            type='url'
            value={form.formData.videoUrl || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.handleInputChange('videoUrl', e.target.value)
            }
            placeholder='https://youtube.com/watch?v=...'
          />
          {form.formData.videoUrl && (
            <Button
              type='default'
              size='small'
              icon={<PlayCircleOutlined />}
              onClick={() => window.open(form.formData.videoUrl, '_blank')}
              className='mt-1'
            >
              Preview Video
            </Button>
          )}
        </Form.Item>

        <Form.Item label='Thumbnail URL (optional)'>
          <Input
            type='url'
            value={form.formData.thumbnailUrl || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.handleInputChange('thumbnailUrl', e.target.value)
            }
            placeholder='https://example.com/thumbnail.jpg'
          />
          {form.formData.thumbnailUrl && (
            <img
              src={form.formData.thumbnailUrl}
              alt='Thumbnail preview'
              className='w-24 h-16 object-cover rounded mt-1'
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </Form.Item>
      </div>
    </Card>
  );
};

