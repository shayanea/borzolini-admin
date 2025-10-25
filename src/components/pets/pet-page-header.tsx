import { Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import type { PetPageHeaderProps } from '@/types';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';

const PetPageHeader = ({ onAddPet, onRefresh, loading = false }: PetPageHeaderProps) => {
  const { t } = useTranslation('components');

  return (
    <div className='flex justify-between items-center'>
      <div>
        <Title level={2} className='!mb-2'>
          {t('petManagement.title')}
        </Title>
        <Text className='text-text-light'>{t('petManagement.subtitle')}</Text>
      </div>
      <Space>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          {t('petManagement.refresh')}
        </Button>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={onAddPet}
          className='bg-primary-navy border-primary-navy'
        >
          {t('petManagement.addPet')}
        </Button>
      </Space>
    </div>
  );
};

export default PetPageHeader;
