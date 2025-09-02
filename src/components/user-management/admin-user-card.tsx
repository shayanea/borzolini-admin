import type { AdminUserProperties, User } from '@/types';
import { Card, Progress, Space, Tag, Tooltip, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';

import React from 'react';

const { Text, Title } = Typography;

interface AdminUserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export const AdminUserCard: React.FC<AdminUserCardProps> = ({ user, onEdit, onDelete }) => {
  // Check if this is an admin view with enhanced properties
  const isAdminView = user.isAdminView;
  const adminProps = user.adminProperties;

  if (!isAdminView || !adminProps) {
    // Fallback to basic user display for non-admin views
    return (
      <Card size='small' className='user-card'>
        <div className='flex items-center justify-between'>
          <div>
            <Title level={5} className='mb-1'>
              {user.firstName} {user.lastName}
            </Title>
            <Text type='secondary'>{user.email}</Text>
          </div>
          <Tag color={user.isActive ? 'green' : 'red'}>{user.role}</Tag>
        </div>
      </Card>
    );
  }

  const getRiskColor = (riskLevel: AdminUserProperties['riskLevel']) => {
    switch (riskLevel) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: AdminUserProperties['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'normal':
        return 'blue';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getVerificationIcon = (status: AdminUserProperties['verificationStatus']) => {
    switch (status) {
      case 'Fully verified':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Partially verified':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'Unverified':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  return (
    <Card
      size='small'
      className={`user-card ${user.requiresAttention ? 'requires-attention' : ''}`}
      title={
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <UserOutlined />
            <span>
              {user.firstName} {user.lastName}
            </span>
            {adminProps.isNewUser && <Tag color='blue'>New</Tag>}
          </div>
          <Space>
            {user.canEdit && (
              <Tooltip title='Edit User'>
                <EditOutlined
                  className='cursor-pointer text-blue-500 hover:text-blue-700'
                  onClick={() => onEdit?.(user)}
                />
              </Tooltip>
            )}
            {user.canDelete && (
              <Tooltip title='Delete User'>
                <DeleteOutlined
                  className='cursor-pointer text-red-500 hover:text-red-700'
                  onClick={() => onDelete?.(user)}
                />
              </Tooltip>
            )}
          </Space>
        </div>
      }
      extra={
        <Space direction='vertical' size='small' align='end'>
          <Tag color={getRiskColor(adminProps.riskLevel)}>Risk: {adminProps.riskLevel}</Tag>
          <Tag color={getPriorityColor(adminProps.priority)}>{adminProps.priority}</Tag>
        </Space>
      }
    >
      <div className='space-y-3'>
        {/* Basic Info */}
        <div>
          <Text type='secondary' className='block text-xs'>
            Email
          </Text>
          <Text>{user.email}</Text>
        </div>

        {/* Admin-specific Properties */}
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <Text type='secondary' className='block text-xs'>
              Account Age
            </Text>
            <Text>{adminProps.accountAge}</Text>
          </div>
          <div>
            <Text type='secondary' className='block text-xs'>
              Last Activity
            </Text>
            <div className='flex items-center gap-1'>
              <ClockCircleOutlined className='text-xs' />
              <Text className='text-xs'>{adminProps.lastActivityStatus}</Text>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <Text type='secondary' className='block text-xs'>
            Verification
          </Text>
          <div className='flex items-center gap-1'>
            {getVerificationIcon(adminProps.verificationStatus)}
            <Text className='text-xs'>{adminProps.verificationStatus}</Text>
          </div>
        </div>

        {/* Profile Completion */}
        <div>
          <Text type='secondary' className='block text-xs'>
            Profile Completion
          </Text>
          <Progress
            percent={adminProps.profileCompleteness}
            size='small'
            status={adminProps.profileCompleteness < 50 ? 'exception' : 'normal'}
          />
        </div>

        {/* Management Notes */}
        <div>
          <Text type='secondary' className='block text-xs'>
            Admin Notes
          </Text>
          <Text className='text-xs italic'>{adminProps.managementNotes || 'No notes added'}</Text>
        </div>

        {/* Status Tags */}
        <div className='flex flex-wrap gap-1'>
          <Tag color={user.isActive ? 'green' : 'red'}>{user.isActive ? 'Active' : 'Inactive'}</Tag>
          <Tag color='default'>{user.role}</Tag>
          {user.requiresAttention && <Tag color='red'>Needs Attention</Tag>}
        </div>
      </div>
    </Card>
  );
};

export default AdminUserCard;
