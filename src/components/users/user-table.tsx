import { TABLE_PAGE_SIZES, USER_TABLE_COLUMNS } from '@/constants';
import type { User, UserTableProps } from '@/types';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Space, Switch, Table, Tooltip } from 'antd';

import { useTranslation } from 'react-i18next';

const UserTable = ({
  users,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  selectedRowKeys,

  onViewUser,
  onEditUser,
  onDeleteUser,
  onTableChange,
  onRowSelectionChange,
  onToggleActive,
}: UserTableProps) => {
  const { t } = useTranslation('components');

  const createActionHandlers = (user: User) => {
    const handleViewUser = () => onViewUser(user);
    const handleEditUser = () => onEditUser(user);
    const handleDeleteUser = () => onDeleteUser(user.id);

    return { handleViewUser, handleEditUser, handleDeleteUser };
  };

  const columns = [
    {
      title: t('userTable.user'),
      key: USER_TABLE_COLUMNS.USER,
      width: 280,
      render: (user: User) => (
        <div className='flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200'>
          <Avatar
            size={40}
            className='border-2 border-slate-300 shadow-md ring-2 ring-slate-100'
            style={{
              background: 'linear-gradient(135deg, #6ecefd 0%, #06b6d4 100%)',
              fontWeight: 'bold',
            }}
          >
            {user.firstName.charAt(0)}
          </Avatar>
          <div className='flex-1 min-w-0'>
            <div className='font-bold text-sm text-slate-900 truncate mb-0.5 tracking-tight'>
              {user.firstName} {user.lastName}
            </div>
            <div className='text-xs text-slate-600 font-medium truncate mb-1'>{user.email}</div>
            {user.phone && (
              <div className='text-xs text-slate-500 flex items-center gap-1.5 font-medium'>
                <PhoneOutlined className='text-slate-400 text-[11px]' />
                {user.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('userTable.role'),
      key: USER_TABLE_COLUMNS.ROLE,
      width: 160,
      render: (user: User) => {
        const roleConfig = {
          admin: {
            bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            text: '#991b1b',
            border: '#fca5a5',
            shadow: '0 2px 4px rgba(220, 38, 38, 0.15)',
          },
          veterinarian: {
            bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            text: '#065f46',
            border: '#6ee7b7',
            shadow: '0 2px 4px rgba(16, 185, 129, 0.15)',
          },
          staff: {
            bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            text: '#1e3a8a',
            border: '#93c5fd',
            shadow: '0 2px 4px rgba(59, 130, 246, 0.15)',
          },
          patient: {
            bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            text: '#92400e',
            border: '#fcd34d',
            shadow: '0 2px 4px rgba(217, 119, 6, 0.15)',
          },
          clinic_admin: {
            bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
            text: '#5b21b6',
            border: '#c4b5fd',
            shadow: '0 2px 4px rgba(139, 92, 246, 0.15)',
          },
          default: {
            bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            text: '#334155',
            border: '#cbd5e1',
            shadow: '0 2px 4px rgba(71, 85, 105, 0.1)',
          },
        };

        const config = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.default;

        return (
          <span
            className='inline-flex items-center px-3.5 py-2 rounded-xl font-semibold text-xs tracking-wide transition-all duration-200 hover:scale-105'
            style={{
              background: config.bg,
              color: config.text,
              border: `1px solid ${config.border}`,
              boxShadow: config.shadow,
            }}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
          </span>
        );
      },
    },
    {
      title: t('userTable.verification'),
      key: USER_TABLE_COLUMNS.VERIFICATION,
      width: 200,
      render: (user: User) => (
        <div className='space-y-2.5'>
          {/* Email Verification */}
          <div
            className='flex items-center justify-center transition-all duration-200 hover:scale-105'
            style={{
              background: user.isEmailVerified
                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: user.isEmailVerified ? '#065f46' : '#991b1b',
              border: `1px solid ${user.isEmailVerified ? '#6ee7b7' : '#fca5a5'}`,
              borderRadius: '12px',
              padding: '8px 12px',
              boxShadow: user.isEmailVerified
                ? '0 2px 4px rgba(16, 185, 129, 0.15)'
                : '0 2px 4px rgba(220, 38, 38, 0.15)',
            }}
          >
            {user.isEmailVerified ? (
              <>
                <CheckCircleOutlined className='mr-1.5 text-sm' style={{ fontSize: '14px' }} />
                <span className='font-semibold text-xs tracking-wide'>Verified</span>
              </>
            ) : (
              <>
                <CloseCircleOutlined className='mr-1.5 text-sm' style={{ fontSize: '14px' }} />
                <span className='font-semibold text-xs tracking-wide'>Unverified</span>
              </>
            )}
          </div>

          {/* Account Status */}
          <div
            className='flex items-center justify-center transition-all duration-200 hover:scale-105'
            style={{
              background: user.isActive
                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              color: user.isActive ? '#065f46' : '#475569',
              border: `1px solid ${user.isActive ? '#6ee7b7' : '#cbd5e1'}`,
              borderRadius: '12px',
              padding: '8px 12px',
              boxShadow: user.isActive
                ? '0 2px 4px rgba(16, 185, 129, 0.15)'
                : '0 2px 4px rgba(71, 85, 105, 0.1)',
            }}
          >
            {user.isActive ? (
              <>
                <CheckCircleOutlined className='mr-1.5 text-sm' style={{ fontSize: '14px' }} />
                <span className='font-semibold text-xs tracking-wide'>Active</span>
              </>
            ) : (
              <>
                <ClockCircleOutlined className='mr-1.5 text-sm' style={{ fontSize: '14px' }} />
                <span className='font-semibold text-xs tracking-wide'>Inactive</span>
              </>
            )}
          </div>

          {onToggleActive && (
            <div className='flex justify-center pt-1'>
              <Switch
                size='small'
                checked={!!user.isActive}
                onChange={checked => onToggleActive(user, checked)}
                className='shadow-sm'
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('userTable.location'),
      key: USER_TABLE_COLUMNS.LOCATION,
      width: 200,
      render: (user: User) => (
        <div className='space-y-1 text-sm'>
          {user.city && user.country ? (
            <div className='flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105'>
              <EnvironmentOutlined
                className='text-slate-500 text-sm'
                style={{ fontSize: '14px' }}
              />
              <span className='text-slate-700 font-semibold text-xs tracking-wide'>
                {user.city}, {user.country}
              </span>
            </div>
          ) : (
            <div className='text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 inline-block font-medium'>
              Not Specified
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('userTable.actions'),
      key: USER_TABLE_COLUMNS.ACTIONS,
      width: 140,
      align: 'center' as const,
      render: (user: User) => {
        const { handleViewUser, handleEditUser, handleDeleteUser } = createActionHandlers(user);

        return (
          <Space size='small' className='p-1'>
            <Tooltip title={t('userTable.viewDetails')}>
              <Button
                type='text'
                icon={<EyeOutlined />}
                size='small'
                className='hover:bg-blue-50 rounded-lg p-2.5 transition-all duration-200 hover:scale-110 hover:shadow-md'
                style={{ color: '#3b82f6' }}
                onClick={handleViewUser}
              />
            </Tooltip>
            <Tooltip title={t('userTable.editUser')}>
              <Button
                type='text'
                icon={<EditOutlined />}
                size='small'
                className='hover:bg-green-50 rounded-lg p-2.5 transition-all duration-200 hover:scale-110 hover:shadow-md'
                style={{ color: '#10b981' }}
                onClick={handleEditUser}
              />
            </Tooltip>
            <Tooltip title={t('userTable.deleteUser')}>
              <Button
                type='text'
                icon={<DeleteOutlined />}
                size='small'
                danger
                className='hover:bg-red-50 rounded-lg p-2.5 transition-all duration-200 hover:scale-110 hover:shadow-md'
                onClick={handleDeleteUser}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleShowTotal = (total: number, range: [number, number]) => {
    return t('userTable.showTotal', { start: range[0], end: range[1], total });
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden'>
      <Table
        columns={columns}
        dataSource={users}
        rowKey='id'
        loading={loading}
        rowSelection={
          onRowSelectionChange
            ? {
                selectedRowKeys,
                onChange: onRowSelectionChange,
              }
            : undefined
        }
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: handleShowTotal,
          pageSizeOptions: TABLE_PAGE_SIZES.map(String),
          position: ['bottomCenter'],
          className: 'px-6 py-4',
        }}
        onChange={onTableChange}
        rowClassName='hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200 border-b border-slate-100'
        className='[&_.ant-table-thead>tr>th]:bg-gradient-to-r [&_.ant-table-thead>tr>th]:from-slate-50 [&_.ant-table-thead>tr>th]:to-white [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-slate-200 [&_.ant-table-thead>tr>th]:font-bold [&_.ant-table-thead>tr>th]:text-slate-700 [&_.ant-table-thead>tr>th]:text-xs [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:tracking-wider'
        locale={{
          emptyText: (
            <div className='text-center py-16'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4'>
                <UserOutlined className='text-4xl text-slate-400' />
              </div>
              <div className='text-xl font-bold text-slate-600 mb-2 tracking-tight'>
                No Users Found
              </div>
              <div className='text-slate-500 font-medium'>No user data available at the moment</div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export { UserTable };
export default UserTable;
