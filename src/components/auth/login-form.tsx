import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';

import { AuthBackground } from '@/components/common';
import type { LoginCredentials } from '@/types';
import { useCallback } from 'react';
import { useLogin } from '@/hooks/use-auth';

const { Title, Text } = Typography;

export const LoginForm = () => {
  const [form] = Form.useForm();
  const loginMutation = useLogin();

  const handleFinish = useCallback(
    async (values: LoginCredentials) => {
      try {
        loginMutation.mutate(values);
      } catch (error) {
        // Error is handled by the hook
        // Removed console.error for production
      }
    },
    [loginMutation]
  );

  const handleIconRender = useCallback((visible: boolean) => {
    return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
  }, []);

  return (
    <AuthBackground variant='pattern'>
      <Card className='w-full shadow-admin-lg p-8 bg-white/95 backdrop-blur-sm'>
        <div className='text-center mb-8'>
          <div className='mb-4'>
            <div className='w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg'>
              <UserOutlined className='text-2xl text-white' />
            </div>
          </div>
          <Title level={2} className='!mb-2 text-gray-800'>
            Welcome Back
          </Title>
          <Text className='text-gray-600'>Sign in to your Borzolini Admin account</Text>
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
              prefix={<UserOutlined className='text-gray-400' />}
              placeholder='Enter your email'
              autoComplete='email'
              className='h-12'
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
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder='Enter your password'
              autoComplete='current-password'
              iconRender={handleIconRender}
              className='h-12'
            />
          </Form.Item>

          <Form.Item className='!mb-6'>
            <Button
              type='primary'
              htmlType='submit'
              loading={loginMutation.isPending}
              className='w-full h-12 bg-[#023e8a] hover:bg-[#023e8a]/90 border-0 shadow-lg'
            >
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AuthBackground>
  );
};

export default LoginForm;
