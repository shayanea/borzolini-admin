import { Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined, HeartOutlined } from '@ant-design/icons';

import type { PetPageHeaderProps } from '@/types';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';

const PetPageHeader = ({ onAddPet, onRefresh, loading = false }: PetPageHeaderProps) => {
  const { t } = useTranslation('components');

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
        {/* Left Section - Title and Stats */}
        <div className='flex items-start gap-4 flex-1'>
          {/* Icon */}
          <div 
            className='w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-white flex-shrink-0'
            style={{ backgroundColor: '#ec4899' }}
          >
            <HeartOutlined className='text-xl' />
          </div>
          
          {/* Title and Subtitle */}
          <div className='flex-1 min-w-0'>
            <Title level={2} className='mb-1 text-slate-800 !tracking-tight !font-bold'>
              {t('petManagement.title')}
            </Title>
            <Text className='text-slate-600 font-medium text-base'>
              {t('petManagement.subtitle')}
            </Text>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className='flex items-center gap-3 flex-shrink-0'>
          {/* Refresh Button */}
          <Button
            type='text'
            icon={<ReloadOutlined className='text-slate-500' />}
            onClick={onRefresh}
            loading={loading}
            className='h-10 px-4 rounded-xl hover:bg-slate-50 transition-colors'
            title='Refresh data'
            size='middle'
          >
            {t('petManagement.refresh')}
          </Button>

          {/* Add Pet Button */}
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={onAddPet}
            className='h-10 px-5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center'
            style={{
              backgroundColor: '#ec4899',
              border: 'none',
            }}
            size='middle'
          >
            {t('petManagement.addPet')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetPageHeader;
