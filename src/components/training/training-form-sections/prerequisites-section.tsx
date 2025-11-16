import { Button, Card, Form, Input } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Typography } from 'antd';
import type { TrainingFormSectionProps } from './types';

const { Text } = Typography;

export const PrerequisitesSection: React.FC<TrainingFormSectionProps> = ({ form }) => {
  return (
    <Card
      title='Prerequisites (Optional)'
      extra={
        <Text type='secondary' className='text-sm'>
          What should pets/owners know or have before starting this training?
        </Text>
      }
    >
      <Form.Item label='Prerequisites'>
        <div className='space-y-2'>
          {(form.formData.prerequisites || []).map((prereq, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <span className='text-lg mt-1'>📚</span>
              <Input
                value={prereq}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.updatePrerequisite(index, e.target.value)
                }
                placeholder='e.g., Basic obedience commands, Quiet training environment'
                className='flex-1'
              />
              <Button
                type='text'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => form.deletePrerequisite(index)}
                danger
              />
            </div>
          ))}
          <Button
            type='default'
            size='small'
            icon={<PlusOutlined />}
            onClick={form.addPrerequisite}
          >
            Add Prerequisite
          </Button>
        </div>
      </Form.Item>
    </Card>
  );
};

