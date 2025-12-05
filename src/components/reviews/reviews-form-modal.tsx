import { Form, Input, Rate, Select, Space, Switch } from 'antd';
import { useEffect } from 'react';

import { FormModal } from '@/components/shared/form-modal';
import type { CreateReviewData, UpdateReviewData } from '@/services/reviews';
import type { Review } from '@/types';

const { TextArea } = Input;
const { Option } = Select;

export interface ReviewsFormModalProps {
  visible: boolean;
  loading?: boolean;
  review?: Review | null;
  clinics?: { id: string; name: string }[];
  users?: { id: string; firstName: string; lastName: string; email: string }[];
  onSubmit: (data: CreateReviewData | UpdateReviewData) => Promise<Review>;
  onCancel: () => void;
}

const ReviewsFormModal = ({
  visible,
  loading,
  review,
  clinics = [],
  users = [],
  onSubmit,
  onCancel,
}: ReviewsFormModalProps) => {
  const [form] = Form.useForm();
  const isEditing = !!review;

  useEffect(() => {
    if (visible && review) {
      form.setFieldsValue({
        userId: review.userId,
        clinicId: review.clinicId,
        rating: review.rating,
        comment: review.comment,
        isPublished: review.isPublished,
        isVerified: review.isVerified,
      });
    } else if (visible && !review) {
      form.resetFields();
      form.setFieldsValue({
        isPublished: false,
        isVerified: false,
      });
    }
  }, [visible, review, form]);

  const handleFormSubmit = async (values: any) => {
    if (isEditing && review) {
      const updateData: UpdateReviewData = {
        rating: values.rating,
        comment: values.comment,
        isPublished: values.isPublished,
        isVerified: values.isVerified,
      };
      await onSubmit(updateData);
    } else {
      const createData: CreateReviewData = {
        userId: values.userId,
        clinicId: values.clinicId,
        rating: values.rating,
        comment: values.comment,
        isPublished: values.isPublished,
        isVerified: values.isVerified,
      };
      await onSubmit(createData);
    }
  };

  const userOptions = users.map(user => (
    <Option key={user.id} value={user.id}>
      {user.firstName} {user.lastName} ({user.email})
    </Option>
  ));

  const clinicOptions = clinics.map(clinic => (
    <Option key={clinic.id} value={clinic.id}>
      {clinic.name}
    </Option>
  ));

  return (
    <FormModal
      visible={visible}
      title={isEditing ? 'Edit Review' : 'Add New Review'}
      form={form}
      onCancel={onCancel}
      onSubmit={handleFormSubmit}
      loading={loading}
      isEditMode={isEditing}
      width={600}
      initialValues={{
        rating: 5,
        isPublished: false,
        isVerified: false,
      }}
      okText={isEditing ? 'Update Review' : 'Create Review'}
    >
      <Form.Item
        label='User'
        name='userId'
        rules={[{ required: true, message: 'Please select a user' }]}
      >
        <Select
          placeholder='Select user'
          showSearch
          optionFilterProp='children'
          loading={loading}
          disabled={isEditing} // Can't change user when editing
        >
          {userOptions}
        </Select>
      </Form.Item>

      <Form.Item
        label='Clinic'
        name='clinicId'
        rules={[{ required: true, message: 'Please select a clinic' }]}
      >
        <Select
          placeholder='Select clinic'
          showSearch
          optionFilterProp='children'
          loading={loading}
          disabled={isEditing} // Can't change clinic when editing
        >
          {clinicOptions}
        </Select>
      </Form.Item>

      <Form.Item
        label='Rating'
        name='rating'
        rules={[{ required: true, message: 'Please provide a rating' }]}
      >
        <Rate allowHalf />
      </Form.Item>

      <Form.Item
        label='Comment'
        name='comment'
        rules={[
          { required: true, message: 'Please provide a comment' },
          { min: 10, message: 'Comment must be at least 10 characters' },
          { max: 1000, message: 'Comment must be less than 1000 characters' },
        ]}
      >
        <TextArea
          placeholder='Enter review comment...'
          rows={4}
          showCount
          maxLength={1000}
        />
      </Form.Item>

      <Space direction='vertical' className='w-full'>
        <Form.Item
          label='Publish Review'
          name='isPublished'
          valuePropName='checked'
        >
          <Switch
            checkedChildren='Published'
            unCheckedChildren='Draft'
          />
        </Form.Item>

        <Form.Item
          label='Mark as Verified'
          name='isVerified'
          valuePropName='checked'
        >
          <Switch
            checkedChildren='Verified'
            unCheckedChildren='Unverified'
          />
        </Form.Item>
      </Space>
    </FormModal>
  );
};

export { ReviewsFormModal };
export default ReviewsFormModal;
