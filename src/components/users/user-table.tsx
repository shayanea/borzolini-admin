import { Avatar, Badge, Button, Space, Table, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PhoneOutlined } from '@ant-design/icons';
import { ROLE_COLORS, TABLE_PAGE_SIZES, USER_TABLE_COLUMNS } from '@/constants';
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
      render: (user: User) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={25}
            className='bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center'
          >
            {user.firstName.charAt(0)}
          </Avatar>
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
      title: t('userTable.role'),
      key: USER_TABLE_COLUMNS.ROLE,
      render: (user: User) => (
        <Tag bordered={false} color={ROLE_COLORS[user.role] || 'default'}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Tag>
      ),
    },
    {
      title: t('userTable.verification'),
      key: USER_TABLE_COLUMNS.VERIFICATION,
      render: (user: User) => {
        return (
          <div className='space-y-1'>
            <Badge
              status={user.isEmailVerified ? 'success' : 'error'}
              text={
                <span className='text-xs'>
                  {user.isEmailVerified
                    ? t('userTable.emailVerified')
                    : t('userTable.emailUnverified')}
                </span>
              }
            />
            <div>
              <Badge
                status={user.isActive ? 'success' : 'error'}
                text={
                  <span className='text-xs'>
                    {user.isActive ? t('userTable.active') : t('userTable.inactive')}
                  </span>
                }
              />
            </div>
          </div>
        );
      },
    },
    {
      title: t('userTable.location'),
      key: USER_TABLE_COLUMNS.LOCATION,
      render: (user: User) => (
        <div className='text-sm text-text-light'>
          {user.city && user.country
            ? `${user.city}, ${user.country}`
            : t('userTable.notSpecified')}
        </div>
      ),
    },
    {
      title: t('userTable.actions'),
      key: USER_TABLE_COLUMNS.ACTIONS,
      render: (user: User) => {
        const { handleViewUser, handleEditUser, handleDeleteUser } = createActionHandlers(user);

        return (
          <Space>
            <Tooltip title={t('userTable.viewDetails')}>
              <Button size='small' icon={<EyeOutlined />} onClick={handleViewUser} />
            </Tooltip>
            <Tooltip title={t('userTable.editUser')}>
              <Button size='small' icon={<EditOutlined />} onClick={handleEditUser} />
            </Tooltip>
            <Tooltip title={t('userTable.deleteUser')}>
              <Button size='small' danger icon={<DeleteOutlined />} onClick={handleDeleteUser} />
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
    />
  );
};

export default UserTable;
