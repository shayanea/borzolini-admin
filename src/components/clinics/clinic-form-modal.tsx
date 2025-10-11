import { Col, Form, Input, Modal, Row, Switch, Typography } from 'antd';
import { useEffect } from 'react';

import {
  EMAIL_RULE,
  MAX_LENGTH_RULE,
  MIN_LENGTH_RULE,
  PHONE_PATTERN_RULE,
  POSTAL_CODE_RULE,
  REQUIRED_RULE,
  URL_RULE,
  VALIDATION_MESSAGES,
} from '@/constants/form-validation';
import { SOCIAL_MEDIA_FIELDS, SOCIAL_MEDIA_LABELS, SOCIAL_MEDIA_PLACEHOLDERS, SOCIAL_MEDIA_URL_PATTERNS } from '@/constants/social-media';
import { SocialMediaFields } from '@/components/shared';
import type { Clinic } from '@/types';

const { Title } = Typography;
const { TextArea } = Input;

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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='name'
              label='Clinic Name'
              rules={[
                REQUIRED_RULE(VALIDATION_MESSAGES.CLINIC_NAME_REQUIRED),
                MIN_LENGTH_RULE(2, VALIDATION_MESSAGES.CLINIC_NAME_MIN_LENGTH),
              ]}
            >
              <Input placeholder='Enter clinic name' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='phone'
              label='Phone Number'
              rules={[
                REQUIRED_RULE(VALIDATION_MESSAGES.REQUIRED),
                PHONE_PATTERN_RULE,
              ]}
            >
              <Input placeholder='Enter phone number' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='description'
              label='Description'
              rules={[MAX_LENGTH_RULE(500, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)]}
            >
              <TextArea
                rows={3}
                placeholder='Enter clinic description (optional)'
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='address'
              label='Address'
              rules={[
                REQUIRED_RULE(VALIDATION_MESSAGES.ADDRESS_REQUIRED),
                MIN_LENGTH_RULE(5, VALIDATION_MESSAGES.ADDRESS_MIN_LENGTH),
              ]}
            >
              <Input placeholder='Enter full address' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name='city'
              label='City'
              rules={[
                REQUIRED_RULE(VALIDATION_MESSAGES.CITY_REQUIRED),
                MIN_LENGTH_RULE(2, VALIDATION_MESSAGES.CITY_MIN_LENGTH),
              ]}
            >
              <Input placeholder='Enter city' />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='country'
              label='Country'
              rules={[REQUIRED_RULE(VALIDATION_MESSAGES.COUNTRY_REQUIRED)]}
            >
              <Input placeholder='Enter country' />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='postal_code'
              label='Postal Code'
              rules={[POSTAL_CODE_RULE]}
            >
              <Input placeholder='Enter postal code' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                REQUIRED_RULE(VALIDATION_MESSAGES.EMAIL_REQUIRED),
                EMAIL_RULE,
              ]}
            >
              <Input placeholder='Enter email address' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='website'
              label='Website'
              rules={[URL_RULE]}
            >
              <Input placeholder='Enter website URL (optional)' />
            </Form.Item>
          </Col>
        </Row>

        {/* Social Media Fields */}
        <SocialMediaFields />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='is_active' label='Status' valuePropName='checked'>
              <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ClinicFormModal;