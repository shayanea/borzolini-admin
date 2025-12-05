import LoginForm from '@/components/auth/login-form';
import BG from '@/ui/icons/auth-bg.svg';
import { Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const LoginPage = () => {
  const { t } = useTranslation(['pages']);

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4 w-full bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${BG})` }}
    >
      <Card className='w-full max-w-md shadow-2xl p-4 py-8 bg-white/95 backdrop-blur-sm rounded-2xl border-0'>
        <div className='text-center mb-8'>
          <div className='mb-6'>
            <div className='flex items-center justify-center mx-auto bg-white p-3 rounded-2xl shadow-sm w-fit'>
              <img
                src='/web-app-manifest-512x512.png'
                alt='Borzolini Logo'
                className='w-16 h-16 object-contain rounded-xl'
              />
            </div>
          </div>
          <Title level={2} className='!mb-2 !text-gray-800 tracking-tight'>
            {t('pages:login.title')}
          </Title>
          <Text className='text-gray-500 text-lg'>{t('pages:login.subtitle')}</Text>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
