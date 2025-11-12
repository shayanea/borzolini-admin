import { Avatar, Button, Space, Table, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ClinicStaff, User } from '@/types';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import dayjs from 'dayjs';

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

// Simplified role color mapping with solid colors
const roleColorMap: Record<string, { bg: string; text: string; border: string }> = {
  veterinarian: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
  nurse: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  receptionist: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
  technician: { bg: '#e0e7ff', text: '#3730a3', border: '#c4b5fd' },
  admin: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  assistant: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
};

// Map common education keywords to solid color schemes
const getEducationTagColor = (value: string): { bg: string; text: string; border: string } => {
  const v = value.toLowerCase();
  if (/(dvm|bvsc|vmd)/.test(v)) return { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' };
  if (/(phd|doctorate)/.test(v)) return { bg: '#ede9fe', text: '#7c3aed', border: '#d8b4fe' };
  if (/(ms|msc|m\.sc)/.test(v)) return { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' };
  if (/(bs|bsc|b\.sc|ba)/.test(v)) return { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' };
  if (/(board certified|diplomate|residency)/.test(v))
    return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' };
  return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
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
      width: 280,
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
          <div className='flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow'>
            <Avatar
              size={36}
              src={avatarUrl}
              className='border-2 border-slate-200 shadow-sm'
              style={{ backgroundColor: '#667eea' }}
            >
              {(firstName || '?').charAt(0).toUpperCase()} {lastName?.charAt(0).toUpperCase()}
            </Avatar>
            <div className='flex-1 min-w-0'>
              <div className='font-semibold text-sm text-slate-800 truncate'>{displayName}</div>
              {email && <div className='text-xs text-slate-600'>{email}</div>}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Staff Role',
      dataIndex: 'role',
      key: 'role',
      width: 160,
      render: (_: ClinicStaff['role'], record) => {
        const role = (record.displayRole || record.role) as string;
        const color = roleColorMap[role] || { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };

        return (
          <Tag
            className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
            style={{
              backgroundColor: color.bg,
              color: color.text,
              border: `1px solid ${color.border}`,
            }}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      width: 220,
      render: (value?: string) =>
        value ? (
          <Tag
            className='!border-0 !px-3 !py-1.5 !rounded-full text-sm font-medium shadow-sm'
            style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              border: '1px solid #93c5fd',
            }}
          >
            {value}
          </Tag>
        ) : (
          <div className='text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md inline-block'>
            No specialization
          </div>
        ),
    },
    {
      title: 'Experience',
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      width: 160,
      render: (value?: number) =>
        typeof value === 'number' ? (
          <div
            className='px-3 py-1.5 rounded-full font-bold text-sm shadow-sm flex items-center justify-center'
            style={{
              backgroundColor: '#fef3c7',
              color: '#d97706',
              border: '1px solid #fcd34d',
            }}
          >
            {value} yrs
          </div>
        ) : (
          <div className='text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md inline-block'>
            No data
          </div>
        ),
      sorter: (a, b) => (a.experienceYears || 0) - (b.experienceYears || 0),
    },
    {
      title: 'Education',
      dataIndex: 'education',
      key: 'education',
      width: 340,
      render: (list?: string[]) => {
        if (!Array.isArray(list) || list.length === 0) {
          return (
            <div className='text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md inline-block'>
              No education data
            </div>
          );
        }

        const visible = list.slice(0, 2);
        const remaining = list.length - 2;

        return (
          <div className='flex flex-wrap gap-1.5'>
            {visible.map((education, index) => {
              const color = getEducationTagColor(education);
              return (
                <Tag
                  key={index}
                  className='!border-0 !px-3 !py-1 !rounded-full text-xs font-medium shadow-sm'
                  style={{
                    backgroundColor: color.bg,
                    color: color.text,
                    border: `1px solid ${color.border}`,
                  }}
                >
                  {education}
                </Tag>
              );
            })}
            {remaining > 0 && (
              <Tag
                className='!border-0 !px-3 !py-1 !rounded-full text-xs font-medium shadow-sm'
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                }}
              >
                +{remaining} more
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (isActive: boolean) => (
        <div
          className={`px-3 py-1.5 rounded-full font-medium text-sm shadow-sm flex items-center justify-center ${
            isActive
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {isActive ? (
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
      ),
    },
    {
      title: 'Hired / Joined',
      key: 'hireDate',
      width: 180,
      render: (_: unknown, record) => {
        const hire = record.hireDate || record.joinedAt;
        const termination = record.terminationDate;

        return (
          <div className='space-y-1 text-sm'>
            <div className='font-medium text-slate-800'>
              {hire ? dayjs(hire).format('MMM DD, YYYY') : '-'}
            </div>
            {termination && (
              <div className='flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 border border-red-200'>
                <ClockCircleOutlined className='text-red-500 text-xs' />
                <span className='text-xs font-medium text-red-700'>
                  Terminated: {dayjs(termination).format('MMM DD, YYYY')}
                </span>
              </div>
            )}
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
      width: 240,
      render: (_: unknown, record) => {
        const user = record.user;

        return (
          <Space size='middle' className='p-1'>
            <Tooltip title='View Details'>
              <Button
                type='text'
                icon={<EyeOutlined className='text-blue-500' />}
                size='small'
                className='hover:bg-blue-50 rounded-full p-2 transition-colors'
                onClick={() => (user ? onViewUser(user) : onResolveViewUser?.(record.userId))}
              />
            </Tooltip>
            <Tooltip title='Edit User'>
              <Button
                type='text'
                icon={<EditOutlined className='text-green-500' />}
                size='small'
                className='hover:bg-green-50 rounded-full p-2 transition-colors'
                onClick={() => (user ? onEditUser(user) : onResolveEditUser?.(record.userId))}
              />
            </Tooltip>
            <Tooltip title='Remove User'>
              <Button
                type='text'
                icon={<DeleteOutlined className='text-red-500' />}
                size='small'
                danger
                className='hover:bg-red-50 rounded-full p-2 transition-colors'
                onClick={() => user && onDeleteUser(user.id)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
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
        rowClassName='hover:bg-slate-50 transition-colors duration-200'
        locale={{
          emptyText: (
            <div className='text-center py-12'>
              <TeamOutlined className='text-5xl text-slate-300 mb-4' />
              <div className='text-xl font-medium text-slate-500 mb-2'>No Staff Members</div>
              <div className='text-slate-400'>No staff data available at the moment</div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default ClinicStaffTable;
