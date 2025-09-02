import { Button, Col, Form, Input, Modal, Row, Select, Space, Switch } from 'antd';
import React, { useCallback } from 'react';

import { USER_ROLES } from '@/constants/user-management';
import type { UserFormModalProps } from '@/types/user-management';

const { Option } = Select;

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
          isActive: editingUser.isActive,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingUser, form, isVisible]);

  const handleSubmit = useCallback(
    (values: any) => {
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='firstName'
              label='First Name'
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder='First Name' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='lastName'
              label='Last Name'
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder='Last Name' />
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
              <Input placeholder='Email' disabled={!!editingUser} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='phone' label='Phone' rules={[{ required: false }]}>
              <Input placeholder='Phone' />
            </Form.Item>
          </Col>
        </Row>

        {!editingUser && (
          <Form.Item
            name='password'
            label='Password'
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password placeholder='Password' />
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='role'
              label='Role'
              rules={[{ required: true, message: 'Please select role' }]}
            >
              <Select placeholder='Select Role'>
                <Option value={USER_ROLES.ADMIN}>Admin</Option>
                <Option value={USER_ROLES.VETERINARIAN}>Veterinarian</Option>
                <Option value={USER_ROLES.STAFF}>Staff</Option>
                <Option value={USER_ROLES.PATIENT}>Patient</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='isActive' label='Account Status' valuePropName='checked'>
              <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='city' label='City' rules={[{ required: false }]}>
              <Input placeholder='City' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='country' label='Country' rules={[{ required: false }]}>
              <Input placeholder='Country' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name='address' label='Address' rules={[{ required: false }]}>
          <Input.TextArea placeholder='Address' rows={2} />
        </Form.Item>

        <Form.Item className='mb-0'>
          <Space className='w-full justify-end'>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              className='bg-primary-navy border-primary-navy'
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
