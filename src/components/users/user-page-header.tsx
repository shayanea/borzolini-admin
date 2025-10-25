import { Button, Space, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import { ExportButton } from '@/components/common';
import type { UserPageHeaderProps } from '@/types/user-management';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface UserPageHeaderPropsWithTitle extends Omit<UserPageHeaderProps, 'onExport'> {
  title?: string;
  subtitle?: string;
  onExportCSV: () => Promise<Blob>;
  onExportExcel: () => Promise<Blob>;
  filters?: Record<string, any>;
  estimatedRecordCount?: number;
}

const UserPageHeader = ({
  onRefresh,
  onExportCSV,
  onExportExcel,
  onAddUser,
  loading,
  title = 'Users',
  subtitle = 'Manage clinic users and staff members',
  filters = {},
  estimatedRecordCount = 0,
}: UserPageHeaderPropsWithTitle) => {
  const { t } = useTranslation('components');

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
          {t('userManagement.refresh')}
        </Button>
        <ExportButton
          entityType={title === 'Veterinarians' ? 'veterinarians' : 'users'}
          exportCSV={onExportCSV}
          exportExcel={onExportExcel}
          filters={filters}
          estimatedRecordCount={estimatedRecordCount}
          disabled={loading}
        />
        <Button
          type='primary'
          icon={<PlusOutlined />}
          className='bg-primary-navy border-primary-navy'
          onClick={onAddUser}
        >
          {title === 'Veterinarians'
            ? t('userManagement.addVeterinarian')
            : t('userManagement.addUser')}
        </Button>
      </Space>
    </div>
  );
};

export default UserPageHeader;
