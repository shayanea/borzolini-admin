import { Button, Card, Form, Space, Switch, Typography } from 'antd';
import React from 'react';
import type { TrainingFormSectionProps } from './types';

const { Text } = Typography;

interface StatusSectionProps extends TrainingFormSectionProps {
  onCancel: () => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export const StatusSection: React.FC<StatusSectionProps> = ({
  form,
  onCancel,
  isLoading,
  isEdit = false,
}) => {
  return (
    <Card>
      <Form.Item>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Switch
              checked={form.formData.isActive ?? false}
              onChange={(checked: boolean) => form.handleInputChange('isActive', checked)}
            />
            <Text strong>Make this activity available to users</Text>
          </div>

          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={form.isSubmitting || isLoading}>
              {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update Activity' : 'Create Activity'}
            </Button>
          </Space>
        </div>
      </Form.Item>
    </Card>
  );
};

