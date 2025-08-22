import React from 'react';
import { Card, Typography, Button, Space, Table, Tag, Avatar, Input } from 'antd';
import { UserOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { User } from '@/types';

const { Title, Text } = Typography;
const { Search } = Input;

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@borzolini.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1234567890',
    isEmailVerified: true,
    isPhoneVerified: true,
    profileCompletionPercentage: 100,
    accountStatus: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'dr.smith@borzolini.com',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
    role: 'veterinarian',
    phone: '+1234567891',
    address: '123 Vet Street',
    city: 'Medical City',
    country: 'USA',
    isEmailVerified: true,
    isPhoneVerified: true,
    profileCompletionPercentage: 95,
    accountStatus: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const Users: React.FC = () => {
  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-primary-orange to-primary-navy"
          />
          <div>
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-text-light">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (user: User) => (
        <Tag
          color={
            user.role === 'admin' ? 'red' :
            user.role === 'veterinarian' ? 'blue' :
            user.role === 'staff' ? 'green' : 'default'
          }
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (user: User) => (
        <Tag
          color={
            user.accountStatus === 'active' ? 'green' :
            user.accountStatus === 'inactive' ? 'red' :
            user.accountStatus === 'suspended' ? 'orange' : 'default'
          }
        >
          {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Verification',
      key: 'verification',
      render: (user: User) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Tag color={user.isEmailVerified ? 'green' : 'red'}>
              {user.isEmailVerified ? 'Email ✓' : 'Email ✗'}
            </Tag>
            <Tag color={user.isPhoneVerified ? 'green' : 'red'}>
              {user.isPhoneVerified ? 'Phone ✓' : 'Phone ✗'}
            </Tag>
          </div>
          <div className="text-xs text-text-light">
            Profile: {user.profileCompletionPercentage}% complete
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Users
          </Title>
          <Text className="text-text-light">
            Manage clinic users and staff members
          </Text>
        </div>
        
        <Button type="primary" icon={<PlusOutlined />} className="bg-primary-navy border-primary-navy">
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <Search
            placeholder="Search users..."
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Space>
            <Button>Filters</Button>
            <Button>Export</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={mockUsers}
          rowKey="id"
          pagination={{
            total: mockUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
        />
      </Card>
    </div>
  );
};

export default Users;
