import {
  ROLE_COLORS,
  STATUS_COLORS,
  TABLE_PAGE_SIZES,
  USER_TABLE_COLUMNS,
} from '@/constants/user-management';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Space, Table, Tag, Tooltip } from 'antd';

import type { User } from '@/types';
import type { UserTableProps } from '@/types/user-management';

const UserTable = ({
  users,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  selectedRowKeys = [],
  onViewUser,
  onEditUser,
  onDeleteUser,
  onTableChange,
  onRowSelectionChange,
}: UserTableProps) => {
  const createActionHandlers = (user: User) => {
    const handleViewUser = () => onViewUser(user);
    const handleEditUser = () => onEditUser(user);
    const handleDeleteUser = () => onDeleteUser(user.id);

    return { handleViewUser, handleEditUser, handleDeleteUser };
  };

  const columns = [
    {
      title: 'User',
      key: USER_TABLE_COLUMNS.USER,
      render: (user: User) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={25}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <div className='font-medium'>
              {user.firstName} {user.lastName}
            </div>
            <div className='text-sm text-text-light'>{user.email}</div>
            {user.phone && (
              <div className='text-xs text-text-light flex items-center'>
                <PhoneOutlined className='mr-1' />
                {user.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: USER_TABLE_COLUMNS.ROLE,
      render: (user: User) => (
        <Tag color={ROLE_COLORS[user.role] || 'default'}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: USER_TABLE_COLUMNS.STATUS,
      render: (user: User) => {
        const status = user.accountStatus || user.status || 'unknown';
        const statusKey = status as keyof typeof STATUS_COLORS;
        return (
          <Tag color={STATUS_COLORS[statusKey] || 'default'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Verification',
      key: USER_TABLE_COLUMNS.VERIFICATION,
      width: 200,
      render: (user: User) => {
        const isEmailVerified = user.isEmailVerified ?? user.verified ?? false;
        const isPhoneVerified = user.isPhoneVerified ?? false;
        const profileCompletion = user.profileCompletionPercentage ?? user.profileCompletion ?? 0;

        return (
          <div className='space-y-1'>
            <div className='flex items-center space-x-2'>
              <Badge
                status={isEmailVerified ? 'success' : 'error'}
                text={<span className='text-xs'>{isEmailVerified ? 'Email ✓' : 'Email ✗'}</span>}
              />
              <Badge
                status={isPhoneVerified ? 'success' : 'error'}
                text={<span className='text-xs'>{isPhoneVerified ? 'Phone ✓' : 'Phone ✗'}</span>}
              />
            </div>
            <div className='text-xs text-text-light'>Profile: {profileCompletion}% complete</div>
          </div>
        );
      },
    },
    {
      title: 'Location',
      key: USER_TABLE_COLUMNS.LOCATION,
      render: (user: User) => (
        <div className='text-sm text-text-light'>
          {user.city && user.country ? `${user.city}, ${user.country}` : 'Not specified'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: USER_TABLE_COLUMNS.ACTIONS,
      render: (user: User) => {
        const { handleViewUser, handleEditUser, handleDeleteUser } = createActionHandlers(user);

        return (
          <Space>
            <Tooltip title='View Details'>
              <Button size='small' icon={<EyeOutlined />} onClick={handleViewUser} />
            </Tooltip>
            <Tooltip title='Edit User'>
              <Button size='small' icon={<EditOutlined />} onClick={handleEditUser} />
            </Tooltip>
            <Tooltip title='Delete User'>
              <Button size='small' danger icon={<DeleteOutlined />} onClick={handleDeleteUser} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleShowTotal = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} of ${total} users`;
  };

  return (
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
      }}
      onChange={onTableChange}
      rowSelection={{
        selectedRowKeys,
        onChange: onRowSelectionChange,
      }}
    />
  );
};

export default UserTable;
