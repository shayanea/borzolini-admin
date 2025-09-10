import { Col, Form, Input, Modal, Row, Switch, Typography } from 'antd';

import type { Clinic } from '@/types';
import { useEffect } from 'react';

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
                { required: true, message: 'Please enter clinic name' },
                { min: 2, message: 'Clinic name must be at least 2 characters' },
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
                { required: true, message: 'Please enter phone number' },
                {
                  pattern: /^[+]?[\d\s\-\(\)\.]{7,20}$/,
                  message: 'Please enter a valid phone number',
                },
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
              rules={[{ max: 500, message: 'Description must not exceed 500 characters' }]}
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
                { required: true, message: 'Please enter address' },
                { min: 5, message: 'Address must be at least 5 characters' },
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
                { required: true, message: 'Please enter city' },
                { min: 2, message: 'City must be at least 2 characters' },
              ]}
            >
              <Input placeholder='Enter city' />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='country'
              label='Country'
              rules={[{ required: true, message: 'Please enter country' }]}
            >
              <Input placeholder='Enter country' />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name='postal_code'
              label='Postal Code'
              rules={[
                { pattern: /^[0-9A-Za-z\s-]{3,10}$/, message: 'Please enter a valid postal code' },
              ]}
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
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder='Enter email address' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='website'
              label='Website'
              rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
            >
              <Input placeholder='Enter website URL (optional)' />
            </Form.Item>
          </Col>
        </Row>

        {/* Social Media Fields */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='facebook_url'
              label='Facebook URL'
              rules={[
                { type: 'url', message: 'Please enter a valid URL' },
                {
                  pattern: /^https?:\/\/(www\.)?facebook\.com\/.+/,
                  message: 'Please enter a valid Facebook URL',
                },
              ]}
            >
              <Input placeholder='https://facebook.com/yourclinic' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='twitter_url'
              label='Twitter URL'
              rules={[
                { type: 'url', message: 'Please enter a valid URL' },
                {
                  pattern: /^https?:\/\/(www\.)?twitter\.com\/.+/,
                  message: 'Please enter a valid Twitter URL',
                },
              ]}
            >
              <Input placeholder='https://twitter.com/yourclinic' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='instagram_url'
              label='Instagram URL'
              rules={[
                { type: 'url', message: 'Please enter a valid URL' },
                {
                  pattern: /^https?:\/\/(www\.)?instagram\.com\/.+/,
                  message: 'Please enter a valid Instagram URL',
                },
              ]}
            >
              <Input placeholder='https://instagram.com/yourclinic' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='linkedin_url'
              label='LinkedIn URL'
              rules={[
                { type: 'url', message: 'Please enter a valid URL' },
                {
                  pattern: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
                  message: 'Please enter a valid LinkedIn URL',
                },
              ]}
            >
              <Input placeholder='https://linkedin.com/company/yourclinic' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='youtube_url'
              label='YouTube URL'
              rules={[
                { type: 'url', message: 'Please enter a valid URL' },
                {
                  pattern: /^https?:\/\/(www\.)?youtube\.com\/.+/,
                  message: 'Please enter a valid YouTube URL',
                },
              ]}
            >
              <Input placeholder='https://youtube.com/c/yourclinic' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='tiktok_url'
              label='TikTok URL'
              rules={[
                { type: 'url', message: 'Please enter a valid URL' },
                {
                  pattern: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
                  message: 'Please enter a valid TikTok URL',
                },
              ]}
            >
              <Input placeholder='https://tiktok.com/@yourclinic' />
            </Form.Item>
          </Col>
        </Row>

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
