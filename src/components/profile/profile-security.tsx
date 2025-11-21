import { Alert, Button, Card, Divider, Form, Input, Switch } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, SecurityScanOutlined } from '@/ui';

import { AuthService } from '@/services/auth';
import { User } from '@/types';
import { useState } from 'react';

interface ProfileSecurityProps {
  user: User;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfileSecurity({ user, onSuccess, onError }: ProfileSecurityProps) {
  const [passwordForm] = Form.useForm();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
  });

  const handlePasswordChange = async (values: ChangePasswordData) => {
    if (values.newPassword !== values.confirmPassword) {
      onError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // Call the auth service to change password
      await AuthService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      passwordForm.resetFields();
      setIsChangingPassword(false);
      onSuccess('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      onError('Failed to change password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySettingChange = (setting: string, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
    onSuccess(`${setting} setting updated`);
  };

  const renderSecurityStatus = (title: string, status: boolean, description: string) => (
    <div className='flex items-center justify-between p-4 border rounded-lg'>
      <div className='flex-1'>
        <h4 className='font-medium text-gray-900'>{title}</h4>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
      <Switch
        checked={status}
        onChange={checked =>
          handleSecuritySettingChange(title.toLowerCase().replace(/\s+/g, ''), checked)
        }
      />
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Password Change Section */}
      <Card className='shadow-sm'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-gray-900'>Change Password</h3>
          {!isChangingPassword && (
            <Button
              type='primary'
              icon={<LockOutlined />}
              onClick={() => setIsChangingPassword(true)}
              className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
            >
              Change Password
            </Button>
          )}
        </div>

        {!isChangingPassword ? (
          <div className='text-center py-8'>
            <LockOutlined className='text-4xl text-gray-300 mb-4' />
            <p className='text-gray-500'>Click the button above to change your password</p>
          </div>
        ) : (
          <Form
            form={passwordForm}
            layout='vertical'
            onFinish={handlePasswordChange}
            className='space-y-6'
          >
            <Form.Item
              name='currentPassword'
              label='Current Password'
              rules={[
                { required: true, message: 'Current password is required' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                placeholder='Enter current password'
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name='newPassword'
              label='New Password'
              rules={[
                { required: true, message: 'New password is required' },
                { min: 8, message: 'Password must be at least 8 characters' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                },
              ]}
            >
              <Input.Password
                placeholder='Enter new password'
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name='confirmPassword'
              label='Confirm New Password'
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder='Confirm new password'
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Alert
              message='Password Requirements'
              description='Your password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and special characters.'
              type='info'
              showIcon
              className='mb-4'
            />

            <div className='flex justify-end space-x-3'>
              <Button onClick={() => setIsChangingPassword(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                icon={<LockOutlined />}
                loading={loading}
                className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
              >
                Change Password
              </Button>
            </div>
          </Form>
        )}
      </Card>

      {/* Security Settings Section */}
      <Card className='shadow-sm'>
        <div className='flex items-center space-x-3 mb-6'>
          <SecurityScanOutlined className='text-xl text-primary-navy' />
          <h3 className='text-lg font-semibold text-gray-900'>Security Settings</h3>
        </div>

        <div className='space-y-4'>
          {renderSecurityStatus(
            'Two-Factor Authentication',
            securitySettings.twoFactorAuth,
            'Add an extra layer of security to your account'
          )}

          {renderSecurityStatus(
            'Login Notifications',
            securitySettings.loginNotifications,
            'Get notified when someone logs into your account'
          )}

          {renderSecurityStatus(
            'Suspicious Activity Alerts',
            securitySettings.suspiciousActivityAlerts,
            'Receive alerts for unusual account activity'
          )}
        </div>

        <Divider />

        <div className='p-4 border rounded-lg'>
          <h4 className='font-medium text-gray-900 mb-2'>Session Timeout</h4>
          <p className='text-sm text-gray-500 mb-3'>
            Automatically log out after {securitySettings.sessionTimeout} minutes of inactivity
          </p>
          <div className='flex items-center space-x-3'>
            <span className='text-sm text-gray-500'>15 min</span>
            <Switch
              checked={securitySettings.sessionTimeout === 15}
              onChange={() => handleSecuritySettingChange('sessionTimeout', 15)}
            />
            <span className='text-sm text-gray-500'>30 min</span>
            <Switch
              checked={securitySettings.sessionTimeout === 30}
              onChange={() => handleSecuritySettingChange('sessionTimeout', 30)}
            />
            <span className='text-sm text-gray-500'>60 min</span>
            <Switch
              checked={securitySettings.sessionTimeout === 60}
              onChange={() => handleSecuritySettingChange('sessionTimeout', 60)}
            />
          </div>
        </div>
      </Card>

      {/* Account Status Section */}
      <Card className='shadow-sm'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Account Status</h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div>
              <h4 className='font-medium text-gray-900'>Email Verification</h4>
              <p className='text-sm text-gray-500'>
                {user.isEmailVerified
                  ? 'Your email is verified'
                  : 'Please verify your email address'}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.isEmailVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {user.isEmailVerified ? 'Verified' : 'Pending'}
            </div>
          </div>

          <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div>
              <h4 className='font-medium text-gray-900'>Phone Verification</h4>
              <p className='text-sm text-gray-500'>
                {user.isPhoneVerified
                  ? 'Your phone is verified'
                  : 'Please verify your phone number'}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.isPhoneVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {user.isPhoneVerified ? 'Verified' : 'Pending'}
            </div>
          </div>

          <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div>
              <h4 className='font-medium text-gray-900'>Account Status</h4>
              <p className='text-sm text-gray-500'>
                {user.isActive ? 'Your account is active' : 'Your account has restrictions'}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
