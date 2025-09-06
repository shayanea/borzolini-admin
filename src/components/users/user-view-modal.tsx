import { EnvironmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Descriptions,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';

import { ROLE_COLORS } from '@/constants';
import { PetsService } from '@/services/pets.service';
import type { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

const { Text, Title } = Typography;

interface UserViewModalProps {
  isVisible: boolean;
  user: User | null;
  onClose: () => void;
  hidePetsSection?: boolean;
}

const UserViewModal = ({
  isVisible,
  user,
  onClose,
  hidePetsSection = false,
}: UserViewModalProps) => {
  // Fetch user's pets (only when pets section should be shown)
  const {
    data: pets = [],
    isLoading: petsLoading,
    error: petsError,
  } = useQuery({
    queryKey: ['user-pets', user?.id],
    queryFn: () => PetsService.getPetsByUserId(user!.id),
    enabled: !!user?.id && isVisible && !hidePetsSection,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  if (!user) return null;

  const petColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color='blue'>{type}</Tag>,
    },
    {
      title: 'Breed',
      dataIndex: 'breed',
      key: 'breed',
      render: (breed: string) => breed || 'Not specified',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => (age ? `${age} years` : 'Not specified'),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => (weight ? `${weight} kg` : 'Not specified'),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Badge status={isActive ? 'success' : 'default'} text={isActive ? 'Active' : 'Inactive'} />
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <Title level={4} className='mb-0'>
              {user.firstName} {user.lastName}
            </Title>
            <Text type='secondary'>{user.email}</Text>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
      ]}
      width={900}
      destroyOnHidden={true}
    >
      <div className='space-y-6'>
        {/* User Information */}
        <Card title='User Information' size='small'>
          <Descriptions column={2} size='small'>
            <Descriptions.Item label='Full Name'>
              {user.firstName} {user.lastName}
            </Descriptions.Item>
            <Descriptions.Item label='Email'>
              <Space>
                <MailOutlined />
                {user.email}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label='Phone'>
              {user.phone ? (
                <Space>
                  <PhoneOutlined />
                  {user.phone}
                </Space>
              ) : (
                'Not provided'
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Role'>
              <Tag color={ROLE_COLORS[user.role] || 'default'}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Location' span={2}>
              {user.city && user.country ? (
                <Space>
                  <EnvironmentOutlined />
                  {user.city}, {user.country}
                </Space>
              ) : (
                'Not specified'
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Email Verified'>
              <Badge
                status={user.isEmailVerified ? 'success' : 'error'}
                text={user.isEmailVerified ? 'Verified' : 'Not Verified'}
              />
            </Descriptions.Item>
            <Descriptions.Item label='Phone Verified'>
              <Badge
                status={user.isPhoneVerified ? 'success' : 'error'}
                text={user.isPhoneVerified ? 'Verified' : 'Not Verified'}
              />
            </Descriptions.Item>
            <Descriptions.Item label='Profile Completion'>
              {user.profileCompletionPercentage ?? user.profileCompletion ?? 0}%
            </Descriptions.Item>
            <Descriptions.Item label='Account Status'>
              <Badge
                status={user.isActive ? 'success' : 'default'}
                text={user.isActive ? 'Active' : 'Inactive'}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* User's Pets - Only show when not hidden */}
        {!hidePetsSection && (
          <Card
            title={
              <div className='flex items-center justify-between'>
                <span>User's Pets</span>
                {petsLoading && <Spin size='small' />}
              </div>
            }
            size='small'
          >
            {petsError ? (
              <div className='text-center py-4'>
                <Text type='danger'>Failed to load pets. Please try again.</Text>
              </div>
            ) : pets.length === 0 ? (
              <div className='text-center py-4'>
                <Text type='secondary'>No pets found for this user.</Text>
              </div>
            ) : (
              <div className='w-full'>
                <Table
                  columns={petColumns}
                  dataSource={pets}
                  rowKey='id'
                  loading={petsLoading}
                  pagination={{
                    position: ['bottomCenter'],
                    pageSize: 5,
                    showSizeChanger: false,
                    // You can add more pagination props as needed
                  }}
                  size='small'
                  scroll={{ x: 600 }}
                />
              </div>
            )}
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default UserViewModal;
