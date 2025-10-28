import { Avatar, Badge, Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ClinicStaff, User } from '@/types';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

const { Text } = Typography;

export interface ClinicStaffWithUser extends ClinicStaff {
  user?: User | null;
}

export interface ClinicStaffTableProps {
  staff: ClinicStaffWithUser[];
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ClinicStaffWithUser> | SorterResult<ClinicStaffWithUser>[]
  ) => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const roleColorMap: Record<ClinicStaff['role'], string> = {
  veterinarian: 'green',
  nurse: 'blue',
  receptionist: 'purple',
  technician: 'gold',
};

const ClinicStaffTable = ({
  staff,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onTableChange,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: ClinicStaffTableProps) => {
  const columns: ColumnsType<ClinicStaffWithUser> = [
    {
      title: 'Member',
      key: 'member',
      render: (_, record) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={25}
            className='bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center'
          >
            {(record.user?.firstName || record.user?.email || record.user?.id || '?')
              .charAt(0)
              .toUpperCase()}
          </Avatar>
          <div>
            <div className='font-medium'>
              {record.user ? (
                <>
                  {record.user.firstName} {record.user.lastName}
                </>
              ) : (
                <Text type='secondary'>{record.userId}</Text>
              )}
            </div>
            {record.user?.email && (
              <div className='text-sm text-text-light'>{record.user.email}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Staff Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: ClinicStaff['role']) => <Tag color={roleColorMap[role]}>{role}</Tag>,
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (value?: string) =>
        value ? <Tag color='default'>{value}</Tag> : <Text type='secondary'>-</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'error'} text={isActive ? 'Active' : 'Inactive'} />
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (value: string) => {
        if (!value) return <Text type='secondary'>-</Text>;
        const date = new Date(value);
        if (isNaN(date.getTime())) return <Text type='secondary'>Invalid Date</Text>;
        return date.toLocaleDateString();
      },
      sorter: (a, b) => {
        const dateA = new Date(a.joinedAt);
        const dateB = new Date(b.joinedAt);
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record) => {
        const user = record.user;
        return (
          <Space>
            <Tooltip title='View Details'>
              <Button size='small' disabled={!user} onClick={() => user && onViewUser(user)}>
                View
              </Button>
            </Tooltip>
            <Tooltip title='Edit User'>
              <Button size='small' disabled={!user} onClick={() => user && onEditUser(user)}>
                Edit
              </Button>
            </Tooltip>
            <Tooltip title='Remove User'>
              <Button
                size='small'
                danger
                disabled={!user}
                onClick={() => user && onDeleteUser(user.id)}
              >
                Remove
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={staff}
      rowKey={row => `${row.userId}-${row.id}`}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        position: ['bottomCenter'],
      }}
      onChange={onTableChange}
    />
  );
};

export default ClinicStaffTable;
