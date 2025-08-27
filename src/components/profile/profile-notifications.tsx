import { useState } from 'react';
import { Card, Switch, Select, Typography, Alert } from 'antd';
import { BellOutlined, MailOutlined, SettingOutlined, CalendarOutlined } from '@/ui';

import { User } from '@/types';

const { Title, Text } = Typography;
const { Option } = Select;

interface ProfileNotificationsProps {
  user: User;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  appointmentConfirmations: boolean;
  appointmentCancellations: boolean;
  appointmentReschedules: boolean;
  followUpReminders: boolean;
  billingNotifications: boolean;
  marketingEmails: boolean;
  newsletterSubscriptions: boolean;
  emergencyAlerts: boolean;
  systemUpdates: boolean;
  reminderFrequency: 'immediate' | '1_hour' | '2_hours' | '1_day';
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export const ProfileNotifications: React.FC<ProfileNotificationsProps> = ({
  user,
  onSuccess,
}) => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: user.isPhoneVerified || false,
    pushNotifications: true,
    appointmentReminders: true,
    appointmentConfirmations: true,
    appointmentCancellations: true,
    appointmentReschedules: true,
    followUpReminders: true,
    billingNotifications: true,
    marketingEmails: false,
    newsletterSubscriptions: false,
    emergencyAlerts: true,
    systemUpdates: true,
    reminderFrequency: '1_hour',
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  const handleSettingChange = (setting: keyof NotificationSettings, value: boolean | string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
    
    // Show success message
    const settingName = setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    onSuccess(`${settingName} setting updated`);
  };

  const renderNotificationToggle = (
    title: string,
    description: string,
    setting: keyof NotificationSettings,
    disabled?: boolean
  ) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch
        checked={notificationSettings[setting] as boolean}
        onChange={(checked) => handleSettingChange(setting, checked)}
        disabled={disabled}
      />
    </div>
  );

  const renderNotificationSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <Card className="shadow-sm mb-6">
      <div className="flex items-center space-x-3 mb-6">
        {icon}
        <Title level={4} className="!mb-0">{title}</Title>
      </div>
      {children}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* General Notification Settings */}
      {renderNotificationSection(
        'General Notifications',
        <BellOutlined className="text-xl text-primary-navy" />,
        <div className="space-y-4">
          {renderNotificationToggle(
            'Email Notifications',
            'Receive notifications via email',
            'emailNotifications'
          )}
          
          {renderNotificationToggle(
            'SMS Notifications',
            'Receive notifications via text message',
            'smsNotifications',
            !user.isPhoneVerified
          )}
          
          {renderNotificationToggle(
            'Push Notifications',
            'Receive notifications in the browser',
            'pushNotifications'
          )}
          
          {!user.isPhoneVerified && (
            <Alert
              message="Phone Verification Required"
              description="You need to verify your phone number to enable SMS notifications."
              type="warning"
              showIcon
              className="mt-4"
            />
          )}
        </div>
      )}

      {/* Appointment Notifications */}
      {renderNotificationSection(
        'Appointment Notifications',
        <CalendarOutlined className="text-xl text-primary-navy" />,
        <div className="space-y-4">
          {renderNotificationToggle(
            'Appointment Reminders',
            'Get reminded about upcoming appointments',
            'appointmentReminders'
          )}
          
          {renderNotificationToggle(
            'Appointment Confirmations',
            'Receive confirmations when appointments are scheduled',
            'appointmentConfirmations'
          )}
          
          {renderNotificationToggle(
            'Appointment Cancellations',
            'Get notified when appointments are cancelled',
            'appointmentCancellations'
          )}
          
          {renderNotificationToggle(
            'Appointment Reschedules',
            'Get notified when appointments are rescheduled',
            'appointmentReschedules'
          )}
          
          {renderNotificationToggle(
            'Follow-up Reminders',
            'Receive reminders for follow-up appointments',
            'followUpReminders'
          )}
        </div>
      )}

      {/* Business Notifications */}
      {renderNotificationSection(
        'Business Notifications',
        <SettingOutlined className="text-xl text-primary-navy" />,
        <div className="space-y-4">
          {renderNotificationToggle(
            'Billing Notifications',
            'Receive notifications about billing and payments',
            'billingNotifications'
          )}
          
          {renderNotificationToggle(
            'Emergency Alerts',
            'Receive urgent notifications about emergencies',
            'emergencyAlerts'
          )}
          
          {renderNotificationToggle(
            'System Updates',
            'Get notified about system maintenance and updates',
            'systemUpdates'
          )}
        </div>
      )}

      {/* Marketing & Communications */}
      {renderNotificationSection(
        'Marketing & Communications',
        <MailOutlined className="text-xl text-primary-navy" />,
        <div className="space-y-4">
          {renderNotificationToggle(
            'Marketing Emails',
            'Receive promotional emails and offers',
            'marketingEmails'
          )}
          
          {renderNotificationToggle(
            'Newsletter Subscriptions',
            'Subscribe to our monthly newsletter',
            'newsletterSubscriptions'
          )}
        </div>
      )}

      {/* Notification Preferences */}
      {renderNotificationSection(
        'Notification Preferences',
        <BellOutlined className="text-xl text-primary-navy" />,
        <div className="space-y-6">
          {/* Reminder Frequency */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Reminder Frequency</h4>
            <p className="text-sm text-gray-500 mb-4">
              Choose how early you want to receive appointment reminders
            </p>
            <Select
              value={notificationSettings.reminderFrequency}
              onChange={(value) => handleSettingChange('reminderFrequency', value)}
              className="w-full"
            >
              <Option value="immediate">Immediately</Option>
              <Option value="1_hour">1 hour before</Option>
              <Option value="2_hours">2 hours before</Option>
              <Option value="1_day">1 day before</Option>
            </Select>
          </div>

          {/* Quiet Hours */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Quiet Hours</h4>
              <Switch
                checked={notificationSettings.quietHours}
                onChange={(checked) => handleSettingChange('quietHours', checked)}
              />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              During quiet hours, you'll only receive emergency notifications
            </p>
            
            {notificationSettings.quietHours && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm text-gray-600">Start Time</Text>
                  <Select
                    value={notificationSettings.quietHoursStart}
                    onChange={(value) => handleSettingChange('quietHoursStart', value)}
                    className="w-full mt-1"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <Option key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <Text className="text-sm text-gray-600">End Time</Text>
                  <Select
                    value={notificationSettings.quietHoursEnd}
                    onChange={(value) => handleSettingChange('quietHoursEnd', value)}
                    className="w-full mt-1"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <Option key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification Summary */}
      <Card className="shadow-sm bg-blue-50 border-blue-200">
        <div className="text-center">
          <BellOutlined className="text-2xl text-blue-600 mb-2" />
          <Title level={5} className="!mb-2 text-blue-900">
            Notification Summary
          </Title>
          <Text className="text-blue-700">
            You have {Object.values(notificationSettings).filter(Boolean).length} notification types enabled
          </Text>
        </div>
      </Card>
    </div>
  );
};
