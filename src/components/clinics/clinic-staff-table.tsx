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
  onResolveViewUser?: (userId: string) => void;
  onResolveEditUser?: (userId: string) => void;
}

const roleColorMap: Record<string, string> = {
  veterinarian: 'green',
  nurse: 'blue',
  receptionist: 'purple',
  technician: 'gold',
  admin: 'red',
  assistant: 'cyan',
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
  onResolveViewUser,
  onResolveEditUser,
}: ClinicStaffTableProps) => {
  const columns: ColumnsType<ClinicStaffWithUser> = [
    {
      title: 'Member',
      key: 'member',
      width: 260,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 220 } }),
      render: (_, record) => {
        const avatarUrl = record.user?.avatar || record.avatar || record.profilePhotoUrl;
        const firstName = record.user?.firstName || record.firstName || '';
        const lastName = record.user?.lastName || record.lastName || '';
        const displayName =
          firstName || lastName
            ? `${firstName} ${lastName}`.trim()
            : record.user?.email || record.email || record.userId;
        const email = record.user?.email || record.email;

        return (
          <div className='flex items-center space-x-3'>
            <Avatar
              size={28}
              src={avatarUrl}
              className='bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center'
            >
              {(displayName || '?').charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div className='font-medium'>{displayName}</div>
              {email && <div className='text-sm text-text-light'>{email}</div>}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Staff Role',
      dataIndex: 'role',
      key: 'role',
      width: 140,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 120 } }),
      render: (_: ClinicStaff['role'], record) => {
        const role = (record.displayRole || record.role) as string;
        const color = roleColorMap[role] || 'default';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      width: 200,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 160 } }),
      render: (value?: string) =>
        value ? <Tag color='default'>{value}</Tag> : <Text type='secondary'>-</Text>,
    },
    {
      title: 'Experience',
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      width: 140,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 110 } }),
      render: (value?: number) =>
        typeof value === 'number' ? (
          <Tag color='geekblue'>{value} yrs</Tag>
        ) : (
          <Text type='secondary'>-</Text>
        ),
      sorter: (a, b) => (a.experienceYears || 0) - (b.experienceYears || 0),
    },
    {
      title: 'Education',
      dataIndex: 'education',
      key: 'education',
      width: 320,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 240 } }),
      render: (list?: string[]) => {
        if (!Array.isArray(list) || list.length === 0) return <Text type='secondary'>-</Text>;
        const visible = list.slice(0, 2);
        const remaining = list.length - visible.length;
        return (
          <Space size={[4, 4]} wrap>
            {visible.map(item => (
              <Tag key={item} color='default'>
                {item}
              </Tag>
            ))}
            {remaining > 0 && (
              <Tooltip title={list.join(', ')}>
                <Tag>+{remaining} more</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 110 } }),
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'error'} text={isActive ? 'Active' : 'Inactive'} />
      ),
    },
    {
      title: 'Hired / Joined',
      key: 'hireDate',
      width: 160,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 140 } }),
      render: (_: unknown, record) => {
        const hire = record.hireDate || record.joinedAt;
        const termination = record.terminationDate;
        const formatDate = (v?: string | null) => {
          if (!v) return null;
          const d = new Date(v);
          return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
        };
        return (
          <div className='space-y-0.5'>
            <div>{formatDate(hire) || <Text type='secondary'>-</Text>}</div>
            {termination && <Tag color='red'>{formatDate(termination)}</Tag>}
          </div>
        );
      },
      sorter: (a, b) => {
        const dateA = new Date(a.hireDate || a.joinedAt || 0);
        const dateB = new Date(b.hireDate || b.joinedAt || 0);
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      onHeaderCell: () => ({ className: 'th-min', style: { minWidth: 180 } }),
      render: (_: unknown, record) => {
        const user = record.user;
        return (
          <Space>
            <Tooltip title='View Details'>
              <Button
                size='small'
                onClick={() => (user ? onViewUser(user) : onResolveViewUser?.(record.userId))}
              >
                View
              </Button>
            </Tooltip>
            <Tooltip title='Edit User'>
              <Button
                size='small'
                onClick={() => (user ? onEditUser(user) : onResolveEditUser?.(record.userId))}
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title='Remove User'>
              <Button
                size='small'
                danger
                disabled={user?.role === 'admin' || user?.role === 'clinic_admin'}
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
      scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
      className='custom-scrollbar'
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
