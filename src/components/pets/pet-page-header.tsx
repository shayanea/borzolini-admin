import { Button, Card, Space, Statistic } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import type { PetPageHeaderProps } from '@/types';

const PetPageHeader = ({ totalPets, onAddPet, onRefresh, loading = false }: PetPageHeaderProps) => {
  return (
    <Card className='admin-card'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-text-dark mb-2'>Pet Management</h1>
          <p className='text-text-light'>Manage all pets in the clinic system</p>
        </div>
        <div className='flex items-center space-x-4'>
          <Statistic title='Total Pets' value={totalPets} valueStyle={{ color: '#1890ff' }} />
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
      </div>
    </Card>
  );
};

export default PetPageHeader;
