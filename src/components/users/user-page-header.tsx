import { PlusOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';

import { ExportButton } from '@/components/common';
import type { UserRole } from '@/types';
import type { UserPageHeaderProps } from '@/types/user-management';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface UserPageHeaderPropsWithTitle extends UserPageHeaderProps {
  title?: string;
  subtitle?: string;
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
  stats,
  onQuickRoleFilter,
  onQuickStatusFilter,
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
            <Text className='text-slate-600 font-medium text-base'>{subtitle}</Text>

            {/* Filters Summary */}
            {Object.keys(filters).some(key => filters[key]) && (
              <div className='flex flex-wrap items-center gap-3 mt-3'>
                <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200'>
                  <span className='text-xs font-medium text-blue-700'>Search:</span>
                  <span className='text-xs font-semibold text-blue-800'>
                    {filters.search || 'All'}
                  </span>
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
                  <span className='text-xs font-semibold text-slate-800'>
                    {estimatedRecordCount}
                  </span>
                </div>
              </div>
            )}

            {/* Quick KPIs / Chips */}
            {stats && (
              <div className='flex flex-wrap items-center gap-2.5 mt-4'>
                {/* All Tag - Primary Active State */}
                <button
                  type='button'
                  onClick={() => {
                    onQuickRoleFilter?.(null);
                    onQuickStatusFilter?.(null);
                  }}
                  className='group relative px-4 py-2 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105 active:scale-100'
                  style={{
                    background: 'linear-gradient(135deg, #6ecefd 0%, #06b6d4 100%)',
                    color: '#ffffff',
                    border: 'none',
                  }}
                >
                  <span className='relative z-10 flex items-center gap-1.5'>
                    All
                    <span className='px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm font-bold'>
                      {stats.total}
                    </span>
                  </span>
                  <span className='absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </button>

                {/* Active Tag */}
                <button
                  type='button'
                  onClick={() => onQuickStatusFilter?.(true)}
                  className='group relative px-4 py-2 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105 active:scale-100'
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                  }}
                >
                  <span className='relative z-10 flex items-center gap-1.5'>
                    Active
                    <span className='px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm font-bold'>
                      {stats.activeCount}
                    </span>
                  </span>
                  <span className='absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </button>

                {/* Inactive Tag */}
                <button
                  type='button'
                  onClick={() => onQuickStatusFilter?.(false)}
                  className='group relative px-4 py-2 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105 active:scale-100 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                >
                  <span className='relative z-10 flex items-center gap-1.5'>
                    Inactive
                    <span className='px-1.5 py-0.5 rounded-md bg-slate-200 font-bold'>
                      {stats.inactiveCount}
                    </span>
                  </span>
                </button>

                {/* Role Tags */}
                {(['admin', 'veterinarian', 'staff', 'patient', 'clinic_admin'] as UserRole[]).map(
                  role => {
                    const roleConfig = {
                      admin: {
                        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        text: '#ffffff',
                      },
                      veterinarian: {
                        bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        text: '#ffffff',
                      },
                      staff: {
                        bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        text: '#ffffff',
                      },
                      patient: {
                        bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        text: '#ffffff',
                      },
                      clinic_admin: {
                        bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        text: '#ffffff',
                      },
                    };

                    const config = roleConfig[role] || {
                      bg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                      text: '#ffffff',
                    };

                    return (
                      <button
                        key={role}
                        type='button'
                        onClick={() => onQuickRoleFilter?.(role)}
                        className='group relative px-4 py-2 rounded-xl font-semibold text-[11px] tracking-wide transition-all duration-300 ease-out shadow-sm hover:shadow-md hover:scale-105 active:scale-100'
                        style={{
                          background: config.bg,
                          color: config.text,
                          border: 'none',
                        }}
                      >
                        <span className='relative z-10 flex items-center gap-1.5'>
                          {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                          <span className='px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm font-bold'>
                            {stats.roleCounts[role] ?? 0}
                          </span>
                        </span>
                        <span className='absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                      </button>
                    );
                  }
                )}
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

export { UserPageHeader };
export default UserPageHeader;
