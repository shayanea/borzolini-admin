import {
  AccountInfoSection,
  ActionButtonsSection,
  AddressSection,
  PersonalInfoSection,
} from './user-form-sections';
import { Form, Modal } from 'antd';
import type { UserFormModalProps, UserFormValues } from '@/types/user-management';
import { useCallback, useEffect } from 'react';

import { USER_ROLES } from '@/constants/user-management';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const UserFormModal = ({
  isVisible,
  editingUser,
  loading,
  onCancel,
  onSubmit,
}: UserFormModalProps) => {
  const { t } = useTranslation('components');
  const [form] = Form.useForm();

  useEffect(() => {
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
      title={editingUser ? t('modals.userForm.titleEdit') : t('modals.userForm.titleCreate')}
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden={true}
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
        <PersonalInfoSection />

        {/* Account Information */}
        <AccountInfoSection editingUser={editingUser} />

        {/* Address Information */}
        <AddressSection />

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
