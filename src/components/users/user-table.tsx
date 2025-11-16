import { Avatar, Button, Space, Table, Tag, Tooltip } from 'antd';
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
import { TABLE_PAGE_SIZES, USER_TABLE_COLUMNS } from '@/constants';
import type { User, UserTableProps } from '@/types';

import { useTranslation } from 'react-i18next';

const UserTable = ({
  users,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,

  onViewUser,
  onEditUser,
  onDeleteUser,
  onTableChange,
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
        <div className='flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow'>
          <Avatar
            size={36}
            className='border-2 border-slate-200 shadow-sm'
            style={{ backgroundColor: '#667eea' }}
          >
            {user.firstName.charAt(0)}
          </Avatar>
          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-sm text-slate-800 truncate'>
              {user.firstName} {user.lastName}
            </div>
            <div className='text-xs text-slate-600'>{user.email}</div>
            {user.phone && (
              <div className='text-xs text-slate-500 flex items-center gap-1'>
                <PhoneOutlined className='text-slate-400' />
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
        const roleColors = {
          admin: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
          veterinarian: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
          staff: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
          patient: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
          default: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
        };

        const style = roleColors[user.role as keyof typeof roleColors] || roleColors.default;

        return (
          <Tag
            className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
            style={{
              backgroundColor: style.bg,
              color: style.text,
              border: `1px solid ${style.border}`,
            }}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: t('userTable.verification'),
      key: USER_TABLE_COLUMNS.VERIFICATION,
      width: 180,
      render: (user: User) => (
        <div className='space-y-2'>
          {/* Email Verification */}
          <div
            className={`px-3 py-1.5 rounded-full font-medium text-sm shadow-sm flex items-center justify-center ${
              user.isEmailVerified
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {user.isEmailVerified ? (
              <>
                <CheckCircleOutlined className='text-green-600 mr-1 text-xs' />
                Verified
              </>
            ) : (
              <>
                <CloseCircleOutlined className='text-red-600 mr-1 text-xs' />
                Unverified
              </>
            )}
          </div>

          {/* Account Status */}
          <div
            className={`px-3 py-1.5 rounded-full font-medium text-sm shadow-sm flex items-center justify-center ${
              user.isActive
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {user.isActive ? (
              <>
                <CheckCircleOutlined className='text-green-600 mr-1 text-xs' />
                Active
              </>
            ) : (
              <>
                <ClockCircleOutlined className='text-slate-500 mr-1 text-xs' />
                Inactive
              </>
            )}
          </div>
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
            <div className='flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200'>
              <EnvironmentOutlined className='text-slate-500 text-xs' />
              <span className='text-slate-700 font-medium'>
                {user.city}, {user.country}
              </span>
            </div>
          ) : (
            <div className='text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md inline-block'>
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
          <Space size='middle' className='p-1'>
            <Tooltip title={t('userTable.viewDetails')}>
              <Button
                type='text'
                icon={<EyeOutlined className='text-blue-500' />}
                size='small'
                className='hover:bg-blue-50 rounded-full p-2 transition-colors'
                onClick={handleViewUser}
              />
            </Tooltip>
            <Tooltip title={t('userTable.editUser')}>
              <Button
                type='text'
                icon={<EditOutlined className='text-green-500' />}
                size='small'
                className='hover:bg-green-50 rounded-full p-2 transition-colors'
                onClick={handleEditUser}
              />
            </Tooltip>
            <Tooltip title={t('userTable.deleteUser')}>
              <Button
                type='text'
                icon={<DeleteOutlined className='text-red-500' />}
                size='small'
                danger
                className='hover:bg-red-50 rounded-full p-2 transition-colors'
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
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      <Table
        columns={columns}
        dataSource={users}
        rowKey='id'
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: handleShowTotal,
          pageSizeOptions: TABLE_PAGE_SIZES.map(String),
          position: ['bottomCenter'],
        }}
        onChange={onTableChange}
        rowClassName='hover:bg-slate-50 transition-colors duration-200'
        locale={{
          emptyText: (
            <div className='text-center py-12'>
              <UserOutlined className='text-5xl text-slate-300 mb-4' />
              <div className='text-xl font-medium text-slate-500 mb-2'>No Users Found</div>
              <div className='text-slate-400'>No user data available at the moment</div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default UserTable;
