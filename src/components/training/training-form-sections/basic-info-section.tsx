import { Card, Checkbox, Form, Input, Select, Space } from 'antd';
import React from 'react';
import type { TrainingFormSectionProps } from './types';
import { getSpeciesIcon } from '../training-utils';

const { Option } = Select;
const { TextArea } = Input;

export function BasicInfoSection({
  form,
  difficultyOptions,
  speciesOptions,
}: TrainingFormSectionProps) {
  return (
    <Card title='Basic Information'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item
          label='Title'
          required
          validateStatus={form.errors.title ? 'error' : ''}
          help={form.errors.title}
        >
          <Input
            value={form.formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.handleInputChange('title', e.target.value)
            }
            placeholder='e.g., Basic Sit Command for Puppies'
          />
        </Form.Item>

        <Form.Item
          label='Difficulty Level'
          required
          validateStatus={form.errors.difficulty ? 'error' : ''}
          help={form.errors.difficulty}
        >
          <Select
            value={form.formData.difficulty}
            onChange={(value: string) => form.handleInputChange('difficulty', value)}
            placeholder='Select difficulty'
          >
            {difficultyOptions.map(difficulty => (
              <Option key={difficulty.value} value={difficulty.value}>
                <Space>
                  <span
                    className='inline-block w-2 h-2 rounded-full'
                    style={{
                      backgroundColor: difficulty.color.includes('green')
                        ? '#52c41a'
                        : difficulty.color.includes('yellow')
                          ? '#faad14'
                          : '#ff4d4f',
                    }}
                  />
                  {difficulty.label}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        label='Description'
        required
        validateStatus={form.errors.description ? 'error' : ''}
        help={form.errors.description}
      >
        <TextArea
          value={form.formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            form.handleInputChange('description', e.target.value);
          }}
          placeholder='Describe what this training activity teaches and its benefits...'
          rows={4}
        />
      </Form.Item>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item
          label='Duration (minutes)'
          required
          validateStatus={form.errors.durationMinutes ? 'error' : ''}
          help={form.errors.durationMinutes}
        >
          <Input
            type='number'
            min={1}
            value={form.formData.durationMinutes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.handleInputChange('durationMinutes', parseInt(e.target.value) || 0)
            }
            placeholder='15'
          />
        </Form.Item>

        <Form.Item
          label='Target Species'
          required
          validateStatus={form.errors.species ? 'error' : ''}
          help={form.errors.species}
        >
          <Checkbox.Group
            value={form.formData.species || []}
            onChange={values => form.handleInputChange('species', values)}
          >
            <div className='grid grid-cols-2 gap-2'>
              {speciesOptions.map(species => (
                <Checkbox key={species.value} value={species.value}>
                  {getSpeciesIcon(species.value)} {species.label}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>
      </div>
    </Card>
  );
}

