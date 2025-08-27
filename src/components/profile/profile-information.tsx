import { Button, Card, Col, Divider, Form, Input, Row } from 'antd';
import { EditOutlined, EnvironmentOutlined, PhoneOutlined, SaveOutlined, UserOutlined } from '@/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '@/types';
import { UsersService } from '@/services/users.service';
import { useAuthActions } from '@/stores/auth.store';
import { useState } from 'react';

interface ProfileInformationProps {
  user: User;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export const ProfileInformation: React.FC<ProfileInformationProps> = ({
  user,
  onSuccess,
  onError,
}) => {
  const [form] = Form.useForm();
  const { updateUser } = useAuthActions();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormData) => UsersService.updateUser(user.id, values),
    onSuccess: updatedUser => {
      // Update local auth store
      updateUser(updatedUser);
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      setIsEditing(false);
      onSuccess('Profile updated successfully!');
    },
    onError: error => {
      console.error('Error updating profile:', error);
      onError('Failed to update profile. Please try again.');
    },
  });

  const initialValues: ProfileFormData = {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || '',
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(initialValues);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSubmit = async (values: ProfileFormData) => {
    await updateProfileMutation.mutateAsync(values);
  };

  const renderField = (label: string, value: string | undefined, icon: React.ReactNode) => (
    <div className='flex items-center space-x-3'>
      <div className='text-gray-400'>{icon}</div>
      <div className='flex-1'>
        <div className='text-sm text-gray-500'>{label}</div>
        <div className='text-gray-900 font-medium'>{value || 'Not provided'}</div>
      </div>
    </div>
  );

  return (
    <Card className='shadow-sm'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
        {!isEditing && (
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={handleEdit}
            className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
          >
            Edit Profile
          </Button>
        )}
      </div>

      {!isEditing ? (
        // View Mode
        <div className='space-y-6'>
          <Row gutter={24}>
            <Col span={12}>{renderField('First Name', user.firstName, <UserOutlined />)}</Col>
            <Col span={12}>{renderField('Last Name', user.lastName, <UserOutlined />)}</Col>
          </Row>

          <Divider />

          <Row gutter={24}>
            <Col span={12}>{renderField('Phone', user.phone, <PhoneOutlined />)}</Col>
            <Col span={12}>{renderField('Email', user.email, <UserOutlined />)}</Col>
          </Row>

          <Divider />

          <Row gutter={24}>
            <Col span={12}>{renderField('Address', user.address, <EnvironmentOutlined />)}</Col>
            <Col span={12}>{renderField('City', user.city, <EnvironmentOutlined />)}</Col>
          </Row>

          <Divider />

          <Row gutter={24}>
            <Col span={12}>{renderField('Country', user.country, <EnvironmentOutlined />)}</Col>
            <Col span={12}>
              <div className='flex items-center space-x-3'>
                <div className='text-gray-400'>
                  <UserOutlined />
                </div>
                <div className='flex-1'>
                  <div className='text-sm text-gray-500'>Role</div>
                  <div className='text-gray-900 font-medium capitalize'>{user.role}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        // Edit Mode
        <Form
          form={form}
          layout='vertical'
          initialValues={initialValues}
          onFinish={handleSubmit}
          className='space-y-6'
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name='firstName'
                label='First Name'
                rules={[
                  { required: true, message: 'First name is required' },
                  { min: 2, message: 'First name must be at least 2 characters' },
                ]}
              >
                <Input placeholder='Enter first name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='lastName'
                label='Last Name'
                rules={[
                  { required: true, message: 'Last name is required' },
                  { min: 2, message: 'Last name must be at least 2 characters' },
                ]}
              >
                <Input placeholder='Enter last name' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name='phone'
                label='Phone Number'
                rules={[
                  {
                    pattern: /^[+]?[1-9][\d]{0,15}$/,
                    message: 'Please enter a valid phone number',
                  },
                ]}
              >
                <Input placeholder='Enter phone number' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Email'>
                <Input value={user.email} disabled />
                <div className='text-xs text-gray-500 mt-1'>
                  Email cannot be changed. Contact administrator if needed.
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name='address'
                label='Address'
                rules={[{ min: 5, message: 'Address must be at least 5 characters' }]}
              >
                <Input placeholder='Enter address' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='city'
                label='City'
                rules={[{ min: 2, message: 'City must be at least 2 characters' }]}
              >
                <Input placeholder='Enter city' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name='country'
                label='Country'
                rules={[{ min: 2, message: 'Country must be at least 2 characters' }]}
              >
                <Input placeholder='Enter country' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Role'>
                <Input value={user.role} disabled />
                <div className='text-xs text-gray-500 mt-1'>
                  Role cannot be changed. Contact administrator if needed.
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <div className='flex justify-end space-x-3'>
            <Button onClick={handleCancel} disabled={updateProfileMutation.isPending}>
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              icon={<SaveOutlined />}
              loading={updateProfileMutation.isPending}
              className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
            >
              Save Changes
            </Button>
          </div>
        </Form>
      )}
    </Card>
  );
};
