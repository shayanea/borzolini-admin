import { BellOutlined, LockOutlined, SafetyOutlined, UserOutlined } from '@/ui';
import { Card, Tabs, message } from 'antd';

import { ProfileInformation } from '@/components/profile/profile-information';
import { ProfileNotifications } from '@/components/profile/profile-notifications';
import { ProfilePrivacy } from '@/components/profile/profile-privacy';
import { ProfileSecurity } from '@/components/profile/profile-security';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('information');
  const [messageApi, contextHolder] = message.useMessage();

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const showSuccessMessage = (messageText: string) => {
    messageApi.success(messageText);
  };

  const showErrorMessage = (messageText: string) => {
    messageApi.error(messageText);
  };

  if (!user) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <UserOutlined className='text-4xl text-gray-400 mb-4' />
          <p className='text-gray-500'>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {contextHolder}

      {/* Profile Header */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center space-x-4'>
          <div className='w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center'>
            <span className='text-white text-2xl font-bold'>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              {user.firstName} {user.lastName}
            </h1>
            <p className='text-gray-600'>{user.email}</p>
            <div className='flex items-center space-x-4 mt-2'>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                {user.role}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className='mt-6'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-700'>Profile Completion</span>
            <span className='text-sm text-gray-500'>{user.profileCompletionPercentage}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${user.profileCompletionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <Card className='shadow-sm'>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: 'information',
              label: (
                <span className='flex items-center space-x-2'>
                  <UserOutlined />
                  <span>Information</span>
                </span>
              ),
              children: (
                <ProfileInformation
                  user={user}
                  onSuccess={showSuccessMessage}
                  onError={showErrorMessage}
                />
              ),
            },
            {
              key: 'security',
              label: (
                <span className='flex items-center space-x-2'>
                  <LockOutlined />
                  <span>Security</span>
                </span>
              ),
              children: (
                <ProfileSecurity
                  user={user}
                  onSuccess={showSuccessMessage}
                  onError={showErrorMessage}
                />
              ),
            },
            {
              key: 'notifications',
              label: (
                <span className='flex items-center space-x-2'>
                  <BellOutlined />
                  <span>Notifications</span>
                </span>
              ),
              children: (
                <ProfileNotifications
                  user={user}
                  onSuccess={showSuccessMessage}
                  onError={showErrorMessage}
                />
              ),
            },
            {
              key: 'privacy',
              label: (
                <span className='flex items-center space-x-2'>
                  <SafetyOutlined />
                  <span>Privacy</span>
                </span>
              ),
              children: (
                <ProfilePrivacy
                  user={user}
                  onSuccess={showSuccessMessage}
                  onError={showErrorMessage}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Profile;
