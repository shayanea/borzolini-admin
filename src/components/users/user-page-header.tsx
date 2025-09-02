import { Button, Space, Typography } from 'antd';
import { ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import type { UserPageHeaderProps } from '@/types/user-management';

const { Title, Text } = Typography;

interface UserPageHeaderPropsWithTitle extends UserPageHeaderProps {
  title?: string;
  subtitle?: string;
}

const UserPageHeader = ({
  onRefresh,
  onExport,
  onAddUser,
  loading,
  title = 'Users',
  subtitle = 'Manage clinic users and staff members',
}: UserPageHeaderPropsWithTitle) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={2} className='!mb-2'>
          {title}
        </Title>
        <Text className='text-text-light'>{subtitle}</Text>
      </div>

      <Space>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
        <div className='relative'>
          <Button icon={<ExportOutlined />} onClick={onExport}>
            Export
          </Button>
          <span className='absolute -top-2 -right-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full'>
            Soon
          </span>
        </div>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          className='bg-primary-navy border-primary-navy'
          onClick={onAddUser}
        >
          Add {title === 'Veterinarians' ? 'Veterinarian' : 'User'}
        </Button>
      </Space>
    </div>
  );
};

export default UserPageHeader;
