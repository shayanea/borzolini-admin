import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const AppointmentsHeader = () => {
  const { t } = useTranslation('pages');

  return (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={2} className='!mb-2'>
          {t('appointments.title')}
        </Title>
        <Text className='text-text-light'>{t('appointments.subtitle')}</Text>
      </div>
    </div>
  );
};

export default AppointmentsHeader;
