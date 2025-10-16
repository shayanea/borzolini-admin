import type { UserFormModalProps, UserFormValues } from '@/types/user-management';
import { Form, Modal } from 'antd';
import React, { useCallback } from 'react';
import dayjs from 'dayjs';

import { USER_ROLES } from '@/constants/user-management';
import {
  AccountInfoSection,
  ActionButtonsSection,
  AddressSection,
  PersonalInfoSection,
} from './user-form-sections';

const UserFormModal = ({
  isVisible,
  editingUser,
  loading,
  onCancel,
  onSubmit,
}: UserFormModalProps) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (isVisible) {
      if (editingUser) {
        form.setFieldsValue({
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role,
          address: editingUser.address,
          city: editingUser.city,
          country: editingUser.country,
          postalCode: editingUser.postalCode,
          dateOfBirth: editingUser.dateOfBirth ? dayjs(editingUser.dateOfBirth) : undefined,
          avatar: editingUser.avatar,
          isActive: editingUser.isActive,
          isEmailVerified: editingUser.isEmailVerified,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingUser, form, isVisible]);

  const handleSubmit = useCallback(
    (values: UserFormValues) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [form, onCancel]);

  // Don't render the form if modal is not visible
  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      title={editingUser ? 'Edit User' : 'Create New User'}
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          role: USER_ROLES.PATIENT,
          isActive: true,
        }}
      >
        {/* Personal Information */}
        <PersonalInfoSection form={form} />

        {/* Account Information */}
        <AccountInfoSection form={form} editingUser={editingUser} />

        {/* Address Information */}
        <AddressSection form={form} />

        {/* Action Buttons */}
        <Form.Item className='mb-0'>
          <ActionButtonsSection 
            onCancel={handleCancel} 
            loading={loading} 
            editingUser={editingUser} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;