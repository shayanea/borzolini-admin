import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';
import { DeleteOutlined, DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import React from 'react';
import type { TrainingFormSectionProps } from './types';

const { TextArea } = Input;
const { Text } = Typography;

export function StepsSection({ form }: TrainingFormSectionProps) {
  return (
    <Card
      title={
        <div className='flex justify-between items-center'>
          <span>Training Steps *</span>
          <Button type='default' size='small' icon={<PlusOutlined />} onClick={form.addStep}>
            Add Step
          </Button>
        </div>
      }
    >
      {form.errors.steps && (
        <Alert
          message='Validation Error'
          description={form.errors.steps}
          type='error'
          showIcon
          className='mb-4'
        />
      )}

      <div className='space-y-3'>
        {(form.formData.steps || []).map((step, index) => (
          <div
            key={'id' in step && step.id ? String(step.id) : `step-${index}`}
            className='border rounded-lg p-4 bg-card/50'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-1'>
                  <Text strong>Step {step.order}</Text>
                  <Space size='small'>
                    <Button
                      type='text'
                      size='small'
                      icon={<UpOutlined />}
                      onClick={() => form.moveStep(index, 'up')}
                      disabled={index === 0}
                    />
                    <Button
                      type='text'
                      size='small'
                      icon={<DownOutlined />}
                      onClick={() => form.moveStep(index, 'down')}
                      disabled={index === (form.formData.steps || []).length - 1}
                    />
                  </Space>
                </div>
              </div>
              <Button
                type='text'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => form.deleteStep(index)}
                danger
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Form.Item
                label='Step Title'
                required
                validateStatus={form.stepErrors[index]?.title ? 'error' : ''}
                help={form.stepErrors[index]?.title}
              >
                <Input
                  value={step.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    form.updateStep(index, 'title', e.target.value)
                  }
                  placeholder={`Step ${step.order} title`}
                />
              </Form.Item>

              <Form.Item label='Estimated Time'>
                <Input
                  type='number'
                  min={1}
                  placeholder='5'
                  value={
                    'duration' in step && typeof step.duration === 'number' ? step.duration : ''
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    form.updateStep(index, 'duration', parseInt(e.target.value) || 0)
                  }
                />
              </Form.Item>
            </div>

            <Form.Item
              label='Step Description'
              required
              validateStatus={form.stepErrors[index]?.description ? 'error' : ''}
              help={form.stepErrors[index]?.description}
            >
              <TextArea
                value={step.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  form.updateStep(index, 'description', e.target.value);
                }}
                placeholder='Describe how to perform this step...'
                rows={3}
              />
            </Form.Item>

            {step.tips && step.tips.length > 0 && (
              <Form.Item label='Tips for Success'>
                <div className='space-y-2'>
                  {step.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className='flex gap-2 items-start'>
                      <span className='text-lg mt-1'>💡</span>
                      <Input
                        value={tip}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newTips = [...(step.tips || [])];
                          newTips[tipIndex] = e.target.value;
                          form.updateStep(index, 'tips', newTips);
                        }}
                        placeholder='Add a helpful tip...'
                        className='flex-1'
                      />
                      <Button
                        type='text'
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          const newTips = step.tips!.filter((_, i) => i !== tipIndex);
                          form.updateStep(index, 'tips', newTips);
                        }}
                        danger
                      />
                    </div>
                  ))}
                  <Button
                    type='default'
                    size='small'
                    icon={<PlusOutlined />}
                    onClick={() => {
                      const newTips = [...(step.tips || []), ''];
                      form.updateStep(index, 'tips', newTips);
                    }}
                  >
                    Add Tip
                  </Button>
                </div>
              </Form.Item>
            )}
          </div>
        ))}
      </div>

      {form.errors.steps && (
        <Alert
          message='Steps Required'
          description='Please add at least one training step to continue'
          type='error'
          showIcon
          className='mt-4'
        />
      )}
    </Card>
  );
}

