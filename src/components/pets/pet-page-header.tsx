import { Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import type { PetPageHeaderProps } from '@/types';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';

const PetPageHeader = ({ onAddPet, onRefresh, loading = false }: PetPageHeaderProps) => {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <Title level={2} className='!mb-2'>
          Pet Management
        </Title>
        <Text className='text-text-light'>Manage all pets in the clinic system</Text>
      </div>
      <Space>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={onAddPet}
          className='bg-primary-navy border-primary-navy'
        >
          Add Pet
        </Button>
      </Space>
    </div>
  );
};

export default PetPageHeader;
