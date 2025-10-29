import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';

import BG from '@/ui/icons/auth-bg.svg';
import type { LoginCredentials } from '@/types';
import { useCallback } from 'react';
import { useLogin } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export const LoginForm = () => {
  const { t } = useTranslation(['pages', 'common']);
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
    <div
      className='min-h-screen flex items-center justify-center p-4 w-full bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${BG})` }}
    >
      <Card className='w-1/3 shadow-2xl p-4 py-0 bg-white rounded-2xl'>
        <div className='text-center mb-8'>
          <div className='mb-4'>
            <div className='flex items-center justify-center mx-auto'>
              <img
                src='/web-app-manifest-512x512.png'
                alt='Borzolini Logo'
                className='w-16 h-16 object-contain rounded-xl'
              />
            </div>
          </div>
          <Title level={2} className='!mb-2 !text-gray-800'>
            {t('pages:login.title')}
          </Title>
          <Text className='text-gray-600'>{t('pages:login.subtitle')}</Text>
        </div>

        {loginMutation.error && (
          <Alert
            message={t('pages:login.loginFailed')}
            description={loginMutation.error.message || t('pages:login.checkCredentials')}
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
            label={<span className='text-gray-700'>{t('pages:login.email')}</span>}
            rules={[
              { required: true, message: t('pages:login.enterEmailAddress') },
              { type: 'email', message: t('pages:login.validEmailAddress') },
            ]}
          >
            <Input
              prefix={<UserOutlined className='text-gray-400' />}
              placeholder={t('pages:login.enterEmail')}
              autoComplete='email'
              className='h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
            />
          </Form.Item>

          <Form.Item
            name='password'
            label={<span className='text-gray-700'>{t('pages:login.password')}</span>}
            rules={[
              { required: true, message: t('pages:login.enterPasswordField') },
              { min: 8, message: t('pages:login.passwordMinChars') },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder={t('pages:login.enterPassword')}
              autoComplete='current-password'
              iconRender={handleIconRender}
              className='h-12 bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
            />
          </Form.Item>

          <Form.Item className='!mb-6'>
            <Button
              type='primary'
              htmlType='submit'
              loading={loginMutation.isPending}
              className='w-full h-12 bg-primary-500 hover:bg-primary-600 border-0 shadow-lg text-white font-medium'
            >
              {loginMutation.isPending ? t('pages:login.signingIn') : t('pages:login.signIn')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
