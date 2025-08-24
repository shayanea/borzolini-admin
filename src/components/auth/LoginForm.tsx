import { Alert, Button, Card, Divider, Form, Input, Space, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

import type { LoginCredentials } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) => {
  const [form] = Form.useForm();
  const { login, isLoading, loginMutation } = useAuth();

  const handleFinish = useCallback(
    async (values: LoginCredentials) => {
      try {
        await login(values);
      } catch (error) {
        // Error is handled by the hook
        // Removed console.error for production
      }
    },
    [login]
  );

  const handleForgotPassword = useCallback(() => {
    if (onSwitchToForgotPassword) {
      onSwitchToForgotPassword();
    }
  }, [onSwitchToForgotPassword]);

  const handleRegister = useCallback(() => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  }, [onSwitchToRegister]);

  const handleIconRender = useCallback((visible: boolean) => {
    return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-primary-dark p-4'>
      <Card className='w-full max-w-md shadow-admin-lg' bodyStyle={{ padding: '2rem' }}>
        <div className='text-center mb-8'>
          <div className='mb-4'>
            <div className='w-16 h-16 bg-gradient-to-r from-primary-navy to-primary-orange rounded-full flex items-center justify-center mx-auto'>
              <UserOutlined className='text-2xl text-white' />
            </div>
          </div>
          <Title level={2} className='!mb-2 text-primary-navy'>
            Welcome Back
          </Title>
          <Text className='text-text-light'>Sign in to your Borzolini Admin account</Text>
        </div>

        {loginMutation.error && (
          <Alert
            message='Login Failed'
            description={
              loginMutation.error.message || 'Please check your credentials and try again.'
            }
            type='error'
            showIcon
            className='mb-6'
          />
        )}

        <Form
          form={form}
          name='login'
          onFinish={handleFinish}
          layout='vertical'
          size='large'
          requiredMark={false}
        >
          <Form.Item
            name='email'
            label='Email Address'
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input
              prefix={<UserOutlined className='text-text-light' />}
              placeholder='Enter your email'
              autoComplete='email'
            />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-text-light' />}
              placeholder='Enter your password'
              autoComplete='current-password'
              iconRender={handleIconRender}
            />
          </Form.Item>

          <Form.Item className='!mb-6'>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading}
              className='w-full h-12 bg-primary-navy hover:bg-primary-dark border-primary-navy hover:border-primary-dark'
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <Divider className='!my-6'>
          <Text className='text-text-light'>or</Text>
        </Divider>

        <Space direction='vertical' className='w-full' size='middle'>
          <Button
            type='link'
            onClick={handleForgotPassword}
            className='w-full text-primary-orange hover:text-primary-dark'
          >
            Forgot your password?
          </Button>

          <div className='text-center'>
            <Text className='text-text-light'>Don't have an account? </Text>
            <Button
              type='link'
              onClick={handleRegister}
              className='!p-0 !h-auto text-primary-orange hover:text-primary-dark font-medium'
            >
              Sign up here
            </Button>
          </div>
        </Space>

        <div className='mt-8 text-center'>
          <Text className='text-xs text-text-light'>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
