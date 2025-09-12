import { Avatar, Badge, Button, Space, Table, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PhoneOutlined } from '@ant-design/icons';
import { ROLE_COLORS, TABLE_PAGE_SIZES, USER_TABLE_COLUMNS } from '@/constants';
import type { User, UserTableProps } from '@/types';

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
            className='bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center'
            src='/borzolini-logo.svg'
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
      title: 'Verification',
      key: USER_TABLE_COLUMNS.VERIFICATION,
      render: (user: User) => {
        return (
          <div className='space-y-1'>
            <Badge
              status={user.isEmailVerified ? 'success' : 'error'}
              text={
                <span className='text-xs'>
                  {user.isEmailVerified ? 'Email Verified' : 'Email Unverified'}
                </span>
              }
            />
            <div>
              <Badge
                status={user.isActive ? 'success' : 'error'}
                text={<span className='text-xs'>{user.isActive ? 'Active' : 'Inactive'}</span>}
              />
            </div>
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
        position: ['bottomCenter'],
      }}
      onChange={onTableChange}
    />
  );
};

export default UserTable;
