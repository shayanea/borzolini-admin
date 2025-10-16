/**
 * User Information Card
 */

import { ROLE_COLORS } from '@/constants';
import type { User } from '@/types';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Badge, Card, Descriptions, Space, Tag } from 'antd';
import { FC } from 'react';

interface UserInfoCardProps {
  user: User;
}

export const UserInfoCard: FC<UserInfoCardProps> = ({ user }) => {
  return (
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
  );
};
