import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';

import { useLogin } from '@/hooks/auth';
import type { LoginCredentials } from '@/types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { getLoginSchema } from '@/schemas/auth';
import { createSchemaFieldRule } from '@/utils/validation';
import { useMemo } from 'react';

export const LoginForm = () => {
  const { t } = useTranslation(['pages', 'common']);
  const [form] = Form.useForm();
  const loginMutation = useLogin();
  
  const schema = useMemo(() => getLoginSchema(t), [t]);

  const handleFinish = useCallback(
    async (values: LoginCredentials) => {
      try {
        loginMutation.mutate(values);
      } catch (error) {
        // Error is handled by the hook
      }
    },
    [loginMutation]
  );

  const handleIconRender = useCallback((visible: boolean) => {
    return visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;
  }, []);

  return (
    <div className='w-full'>
      {loginMutation.error && (
        <Alert
          message={t('pages:login.loginFailed')}
          description={loginMutation.error.message || t('pages:login.checkCredentials')}
          type='error'
          showIcon
          className='mb-6 rounded-lg'
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
          label={<span className='text-gray-700 font-medium'>{t('pages:login.email')}</span>}
          rules={[createSchemaFieldRule(schema.shape.email)]}
          className='mb-5'
        >
          <Input
            prefix={<UserOutlined className='text-gray-400' />}
            placeholder={t('pages:login.enterEmail')}
            autoComplete='email'
            className='h-12 bg-gray-50 border-gray-200 hover:border-primary-400 focus:border-primary-500 text-gray-800 placeholder-gray-400 rounded-xl transition-all'
          />
        </Form.Item>

        <Form.Item
          name='password'
          label={<span className='text-gray-700 font-medium'>{t('pages:login.password')}</span>}
          rules={[createSchemaFieldRule(schema.shape.password)]}
          className='mb-8'
        >
          <Input.Password
            prefix={<LockOutlined className='text-gray-400' />}
            placeholder={t('pages:login.enterPassword')}
            autoComplete='current-password'
            iconRender={handleIconRender}
            className='h-12 bg-gray-50 border-gray-200 hover:border-primary-400 focus:border-primary-500 text-gray-800 placeholder-gray-400 rounded-xl transition-all'
          />
        </Form.Item>

        <Form.Item className='!mb-2'>
          <Button
            type='primary'
            htmlType='submit'
            loading={loginMutation.isPending}
            className='w-full h-12 bg-primary-600 hover:bg-primary-700 border-0 shadow-lg shadow-primary-500/20 text-white font-semibold text-lg rounded-xl transition-all transform active:scale-[0.98]'
          >
            {loginMutation.isPending ? t('pages:login.signingIn') : t('pages:login.signIn')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
