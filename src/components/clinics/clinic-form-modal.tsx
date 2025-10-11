import { Form, Modal, Typography } from 'antd';
import { useEffect } from 'react';

import {
  BasicInfoSection,
  ContactInfoSection,
  LocationSection,
  StatusSection,
} from './clinic-form-sections';
import type { Clinic } from '@/types';

const { Title } = Typography;

interface ClinicFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  editingClinic: Clinic | null;
}

interface ClinicFormValues {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  phone: string;
  email: string;
  website?: string;
  is_active: boolean;
  // Social Media Fields
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}

const ClinicFormModal = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  editingClinic,
}: ClinicFormModalProps) => {
  const [form] = Form.useForm<ClinicFormValues>();

  const isEditing = !!editingClinic;
  const title = isEditing ? 'Edit Clinic' : 'Add New Clinic';

  useEffect(() => {
    if (visible && editingClinic) {
      form.setFieldsValue({
        name: editingClinic.name,
        description: editingClinic.description || '',
        address: editingClinic.address,
        city: editingClinic.city,
        country: editingClinic.country,
        postal_code: editingClinic.postal_code || '',
        phone: editingClinic.phone,
        email: editingClinic.email,
        website: editingClinic.website || '',
        is_active: editingClinic.is_active,
        // Social Media Fields
        facebook_url: editingClinic.facebook_url || '',
        twitter_url: editingClinic.twitter_url || '',
        instagram_url: editingClinic.instagram_url || '',
        linkedin_url: editingClinic.linkedin_url || '',
        youtube_url: editingClinic.youtube_url || '',
        tiktok_url: editingClinic.tiktok_url || '',
      });
    } else if (visible && !editingClinic) {
      form.resetFields();
      form.setFieldsValue({
        is_active: true,
        country: 'United States',
      });
    }
  }, [visible, editingClinic, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      // Form validation errors are handled automatically
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={<Title level={4}>{title}</Title>}
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      destroyOnHidden
      okText={isEditing ? 'Update' : 'Create'}
      cancelText='Cancel'
    >
      <Form
        form={form}
        layout='vertical'
        className='mt-4'
        initialValues={{
          isActive: true,
          country: 'United States',
        }}
      >
        {/* Basic Information */}
        <BasicInfoSection form={form} />
        
        {/* Location Information */}
        <LocationSection form={form} />
        
        {/* Contact Information */}
        <ContactInfoSection form={form} />
        
        {/* Status */}
        <StatusSection form={form} />
      </Form>
    </Modal>
  );
};

export default ClinicFormModal;