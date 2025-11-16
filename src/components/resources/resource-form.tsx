import { Button, Form, Input, Select, Space, Switch, Typography } from 'antd';
import React from 'react';
import type { ReturnType } from 'react';
import type { useResourceForm } from '@/hooks/useResourceForm';
import type { Resource, ResourceType } from '@/types/resources';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface ResourceFormProps {
  form: ReturnType<typeof useResourceForm>;
  onSubmit: () => Promise<boolean>;
  isLoading: boolean;
  resource?: Resource | null;
  onCancel: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  form,
  onSubmit,
  isLoading,
  resource,
  onCancel
}) => {
  const isEdit = !!resource;

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Title" required validateStatus={form.errors.title ? 'error' : ''} help={form.errors.title}>
          <Input
            value={form.formData.title}
            onChange={(e) => form.handleInputChange('title', e.target.value)}
            placeholder="Enter resource title"
          />
        </Form.Item>

        <Form.Item label="Type" required validateStatus={form.errors.type ? 'error' : ''} help={form.errors.type}>
          <Select 
            value={form.formData.type} 
            onChange={(value) => form.handleInputChange('type', value)}
            placeholder="Select type"
          >
            <Option value={ResourceType.VIDEO}>Video</Option>
            <Option value={ResourceType.DISCORD}>Discord</Option>
            <Option value={ResourceType.AUDIO}>Audio</Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item label="Description" validateStatus={form.errors.description ? 'error' : ''} help={form.errors.description}>
        <TextArea
          value={form.formData.description || ''}
          onChange={(e) => form.handleInputChange('description', e.target.value)}
          placeholder="Enter resource description (optional)"
          rows={4}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="URL" required validateStatus={form.errors.url ? 'error' : ''} help={form.errors.url}>
          <Input
            type="url"
            value={form.formData.url || ''}
            onChange={(e) => form.handleInputChange('url', e.target.value)}
            placeholder="https://example.com/resource"
          />
        </Form.Item>

        <Form.Item label="Cover Image URL (optional)">
          <Input
            type="url"
            value={form.formData.cover || ''}
            onChange={(e) => form.handleInputChange('cover', e.target.value)}
            placeholder="https://example.com/cover.jpg"
          />
        </Form.Item>
      </div>

      <Form.Item>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.formData.is_active ?? true}
              onChange={(checked) => form.handleInputChange('is_active', checked as any)}
            />
            <Text>Active</Text>
          </div>

          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              {isEdit ? 'Update Resource' : 'Create Resource'}
            </Button>
          </Space>
        </div>
      </Form.Item>
    </Form>
  );
};

