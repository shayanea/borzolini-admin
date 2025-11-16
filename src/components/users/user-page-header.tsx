import { Button, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';

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
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
        {/* Left Section - Title and Stats */}
        <div className='flex items-start gap-4 flex-1'>
          {/* Icon */}
          <div 
            className='w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-white flex-shrink-0'
            style={{ backgroundColor: '#667eea' }}
          >
            <UserOutlined className='text-xl' />
          </div>
          
          {/* Title and Subtitle */}
          <div className='flex-1 min-w-0'>
            <Title level={2} className='mb-1 text-slate-800 !tracking-tight !font-bold'>
              {title}
            </Title>
            <Text className='text-slate-600 font-medium text-base'>
              {subtitle}
            </Text>
            
            {/* Filters Summary */}
            {Object.keys(filters).some(key => filters[key]) && (
              <div className='flex flex-wrap items-center gap-3 mt-3'>
                <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200'>
                  <span className='text-xs font-medium text-blue-700'>Search:</span>
                  <span className='text-xs font-semibold text-blue-800'>{filters.search || 'All'}</span>
                </div>
                
                {filters.role && (
                  <div className='flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200'>
                    <span className='text-xs font-medium text-green-700'>Role:</span>
                    <span className='text-xs font-semibold text-green-800'>{filters.role}</span>
                  </div>
                )}
                
                {filters.isActive !== undefined && (
                  <div className='flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200'>
                    <span className='text-xs font-medium text-slate-600'>Status:</span>
                    <span className='text-xs font-semibold text-slate-800'>
                      {filters.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
                
                <div className='flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200'>
                  <span className='text-xs font-medium text-slate-600'>Records:</span>
                  <span className='text-xs font-semibold text-slate-800'>{estimatedRecordCount}</span>
                </div>
              </div>
            )}
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
            {t('userManagement.refresh')}
          </Button>

          {/* Export Button */}
          <ExportButton
            entityType={title === 'Veterinarians' ? 'veterinarians' : 'users'}
            exportCSV={onExportCSV}
            exportExcel={onExportExcel}
            filters={filters}
            estimatedRecordCount={estimatedRecordCount}
            disabled={loading}
          />

          {/* Add User Button */}
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={onAddUser}
            className='h-10 px-5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center'
            style={{
              backgroundColor: '#667eea',
              border: 'none',
            }}
            size='middle'
          >
            {title === 'Veterinarians'
              ? t('userManagement.addVeterinarian')
              : t('userManagement.addUser')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserPageHeader;
