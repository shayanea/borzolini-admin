import { Button, Checkbox, Form, Input, Modal, Select, Space } from 'antd';
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FlagOutlined,
} from '@ant-design/icons';

import type { BulkReviewAction } from '@/types/reviews';
import { useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

export interface ReviewsBulkActionsProps {
  selectedReviews: string[];
  onBulkAction: (actionData: BulkReviewAction) => Promise<void>;
  loading?: boolean;
}

const ReviewsBulkActions = ({
  selectedReviews,
  onBulkAction,
  loading,
}: ReviewsBulkActionsProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [form] = Form.useForm();

  const bulkActions = [
    {
      value: 'publish',
      label: 'Publish Reviews',
      icon: <EyeOutlined />,
      description: 'Make selected reviews visible to the public',
    },
    {
      value: 'unpublish',
      label: 'Unpublish Reviews',
      icon: <EyeInvisibleOutlined />,
      description: 'Hide selected reviews from the public',
    },
    {
      value: 'flag',
      label: 'Flag Reviews',
      icon: <FlagOutlined />,
      description: 'Mark reviews for moderation',
    },
    {
      value: 'unflag',
      label: 'Unflag Reviews',
      icon: <FlagOutlined />,
      description: 'Remove moderation flag from reviews',
    },
    {
      value: 'verify',
      label: 'Verify Reviews',
      icon: <CheckCircleOutlined />,
      description: 'Mark reviews as verified (legitimate)',
    },
    {
      value: 'delete',
      label: 'Delete Reviews',
      icon: <DeleteOutlined />,
      description: 'Permanently delete selected reviews',
      danger: true,
    },
  ];

  const handleBulkAction = () => {
    form.validateFields().then(async values => {
      if (!selectedAction || selectedReviews.length === 0) return;

      const actionData: BulkReviewAction = {
        reviewIds: selectedReviews,
        action: selectedAction as BulkReviewAction['action'],
        reason: values.reason,
      };

      await onBulkAction(actionData);
      setModalVisible(false);
      form.resetFields();
      setSelectedAction('');
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedAction('');
  };

  const selectedActionData = bulkActions.find(action => action.value === selectedAction);

  if (selectedReviews.length === 0) {
    return null;
  }

  return (
    <>
      <div className='flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <div className='flex items-center space-x-2'>
          <CheckSquareOutlined className='text-blue-600' />
          <span className='font-medium text-blue-800'>
            {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
          </span>
        </div>

        <Space>
          <Button onClick={() => setModalVisible(true)} type='primary' disabled={loading}>
            Bulk Actions
          </Button>

          <Button
            onClick={() => {
              // Clear selection - this would need to be handled by parent component
              console.log('Clear selection');
            }}
          >
            Clear Selection
          </Button>
        </Space>
      </div>

      <Modal
        title='Bulk Actions'
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleBulkAction}
        confirmLoading={loading}
        okText='Apply Action'
        okButtonProps={{
          danger: selectedActionData?.danger,
        }}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Select Action'
            name='action'
            rules={[{ required: true, message: 'Please select an action' }]}
          >
            <Select
              placeholder='Choose an action to apply'
              onChange={value => setSelectedAction(value)}
            >
              {bulkActions.map(action => (
                <Option key={action.value} value={action.value}>
                  <div className='flex items-center space-x-2'>
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedActionData && (
            <div className='mb-4 p-3 bg-gray-50 rounded'>
              <div className='text-sm text-gray-600'>{selectedActionData.description}</div>
            </div>
          )}

          {(selectedAction === 'flag' || selectedAction === 'delete') && (
            <Form.Item
              label='Reason (Required)'
              name='reason'
              rules={[
                { required: true, message: 'Please provide a reason for this action' },
                { min: 10, message: 'Reason must be at least 10 characters' },
              ]}
            >
              <TextArea
                placeholder='Explain why you are performing this action...'
                rows={3}
                showCount
                maxLength={500}
              />
            </Form.Item>
          )}

          <Form.Item name='confirm' valuePropName='checked'>
            <Checkbox>
              I confirm that I want to apply "{selectedActionData?.label}" to{' '}
              {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''}
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReviewsBulkActions;
