import { Button, Space, Typography } from 'antd';
import { ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import React from 'react';
import type { UserPageHeaderProps } from '@/types/userManagement';

const { Title, Text } = Typography;


const UserPageHeader = ({
  onRefresh,
  onExport,
  onAddUser,
  loading,
}) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <Title level={2} className='!mb-2'>
          Users
        </Title>
        <Text className='text-text-light'>Manage clinic users and staff members</Text>
      </div>

      <Space>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
        <Button icon={<ExportOutlined />} onClick={onExport}>
          Export
        </Button>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          className='bg-primary-navy border-primary-navy'
          onClick={onAddUser}
        >
          Add User
        </Button>
      </Space>
    </div>
  );
};

export default UserPageHeader;
