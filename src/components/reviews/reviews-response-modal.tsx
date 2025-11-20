import { Form, Input, Modal, Button, Typography, Rate, Divider } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

import type { Review } from '@/types';
import type { CreateReviewResponseData, UpdateReviewResponseData } from '@/services/reviews.service';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export interface ReviewsResponseModalProps {
  visible: boolean;
  loading?: boolean;
  review: Review | null;
  onSubmit: (id: string, data: CreateReviewResponseData | UpdateReviewResponseData) => Promise<Review>;
  onCancel: () => void;
}

const ReviewsResponseModal = ({
  visible,
  loading,
  review,
  onSubmit,
  onCancel,
}: ReviewsResponseModalProps) => {
  const [form] = Form.useForm();
  const hasResponse = review?.response;

  useEffect(() => {
    if (visible && review?.response) {
      form.setFieldsValue({
        responseText: review.response.responseText,
      });
    } else if (visible && !review?.response) {
      form.resetFields();
    }
  }, [visible, review, form]);

  const handleSubmit = async () => {
    try {
      if (!review) return;

      const values = await form.validateFields();

      if (hasResponse) {
        const updateData: UpdateReviewResponseData = {
          responseText: values.responseText,
        };
        await onSubmit(review.id, updateData);
      } else {
        const createData: CreateReviewResponseData = {
          responseText: values.responseText,
        };
        await onSubmit(review.id, createData);
      }

      form.resetFields();
    } catch (error) {
      console.error('Response submission error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  if (!review) return null;

  return (
    <Modal
      title={
        <div className='flex items-center space-x-2'>
          <MessageOutlined />
          <span>{hasResponse ? 'Edit Response' : 'Add Response'}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={handleSubmit}
        >
          {hasResponse ? 'Update Response' : 'Add Response'}
        </Button>,
      ]}
    >
      <div className='space-y-6'>
        {/* Original Review */}
        <div className='bg-gray-50 p-4 rounded-lg'>
          <Title level={5} className='mb-3'>
            Original Review
          </Title>

          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Rate disabled value={review.rating} />
              <Text strong>{review.rating}/5</Text>
            </div>

            <Paragraph className='mb-2'>
              {review.comment}
            </Paragraph>

            <div className='text-sm text-gray-600'>
              By {review.userName || review.userId} on{' '}
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <Divider />

        {/* Response Form */}
        <div>
          <Title level={5} className='mb-3'>
            {hasResponse ? 'Edit Response' : 'Your Response'}
          </Title>

          <Form
            form={form}
            layout='vertical'
            initialValues={{
              responseText: review.response?.responseText || '',
            }}
          >
            <Form.Item
              label='Response Text'
              name='responseText'
              rules={[
                { required: true, message: 'Please provide a response' },
                { min: 10, message: 'Response must be at least 10 characters' },
                { max: 2000, message: 'Response must be less than 2000 characters' },
              ]}
            >
              <TextArea
                placeholder='Enter your response to this review...'
                rows={6}
                showCount
                maxLength={2000}
              />
            </Form.Item>
          </Form>

          {hasResponse && review.response && (
            <div className='mt-4 text-sm text-gray-600'>
              Last updated by {review.response.respondedByName} on{' '}
              {new Date(review.response.respondedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export { ReviewsResponseModal };
export default ReviewsResponseModal;
