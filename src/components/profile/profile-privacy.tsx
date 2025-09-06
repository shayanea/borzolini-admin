import { Alert, Button, Card, Modal, Progress, Select, Switch, Typography } from 'antd';
import { DeleteOutlined, DownloadOutlined, EyeOutlined, LockOutlined, SafetyOutlined } from '@/ui';

import { User } from '@/types';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface ProfilePrivacyProps {
  user: User;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'staff_only' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  allowContactByEmail: boolean;
  allowContactByPhone: boolean;
  allowContactBySMS: boolean;
  shareAnalytics: boolean;
  shareUsageData: boolean;
  allowMarketing: boolean;
  allowThirdPartySharing: boolean;
  dataRetention: '30_days' | '90_days' | '1_year' | 'indefinite';
}

export const ProfilePrivacy: React.FC<ProfilePrivacyProps> = ({ user, onSuccess, onError }) => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'staff_only',
    showEmail: true,
    showPhone: false,
    showAddress: false,
    allowContactByEmail: true,
    allowContactByPhone: user.isPhoneVerified || false,
    allowContactBySMS: user.isPhoneVerified || false,
    shareAnalytics: false,
    shareUsageData: false,
    allowMarketing: false,
    allowThirdPartySharing: false,
    dataRetention: '1_year',
  });

  const [isDataExportModalVisible, setIsDataExportModalVisible] = useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePrivacySettingChange = (setting: keyof PrivacySettings, value: boolean | string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value,
    }));

    // Show success message
    const settingName = setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    onSuccess(`${settingName} setting updated`);
  };

  const renderPrivacyToggle = (
    title: string,
    description: string,
    setting: keyof PrivacySettings,
    disabled?: boolean
  ) => (
    <div className='flex items-center justify-between p-4 border rounded-lg'>
      <div className='flex-1'>
        <h4 className='font-medium text-gray-900'>{title}</h4>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
      <Switch
        checked={privacySettings[setting] as boolean}
        onChange={checked => handlePrivacySettingChange(setting, checked)}
        disabled={disabled}
      />
    </div>
  );

  const renderPrivacySection = (
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <Card className='shadow-sm mb-6'>
      <div className='flex items-center space-x-3 mb-6'>
        {icon}
        <Title level={4} className='!mb-0'>
          {title}
        </Title>
      </div>
      {children}
    </Card>
  );

  const handleDataExport = async () => {
    try {
      setExportLoading(true);
      // Simulate data export
      // await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess('Data export completed successfully!');
      setIsDataExportModalVisible(false);
    } catch (error) {
      onError('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      setDeleteLoading(true);
      // Simulate account deletion
      // await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess('Account deletion request submitted. You will receive a confirmation email.');
      setIsDeleteAccountModalVisible(false);
    } catch (error) {
      onError('Failed to submit deletion request. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const calculatePrivacyScore = () => {
    let score = 0;
    const totalSettings = Object.keys(privacySettings).length;

    // Profile visibility scoring
    if (privacySettings.profileVisibility === 'private') score += 3;
    else if (privacySettings.profileVisibility === 'staff_only') score += 2;
    else score += 1;

    // Contact preferences scoring
    if (!privacySettings.allowContactByEmail) score += 1;
    if (!privacySettings.allowContactByPhone) score += 1;
    if (!privacySettings.allowContactBySMS) score += 1;

    // Data sharing scoring
    if (!privacySettings.shareAnalytics) score += 1;
    if (!privacySettings.shareUsageData) score += 1;
    if (!privacySettings.allowMarketing) score += 1;
    if (!privacySettings.allowThirdPartySharing) score += 1;

    // Data retention scoring
    if (privacySettings.dataRetention === '30_days') score += 3;
    else if (privacySettings.dataRetention === '90_days') score += 2;
    else if (privacySettings.dataRetention === '1_year') score += 1;

    return Math.round((score / (totalSettings + 2)) * 100);
  };

  const privacyScore = calculatePrivacyScore();
  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPrivacyScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className='space-y-6'>
      {/* Privacy Score */}
      <Card className='shadow-sm bg-blue-50 border-blue-200'>
        <div className='text-center'>
          <SafetyOutlined className='text-3xl text-blue-600 mb-4' />
          <Title level={3} className='!mb-2 text-blue-900'>
            Your Privacy Score
          </Title>
          <div className='flex items-center justify-center space-x-4 mb-4'>
            <Progress
              type='circle'
              percent={privacyScore}
              size={80}
              strokeColor={{
                '0%': '#3b82f6',
                '100%': '#1d4ed8',
              }}
            />
            <div className='text-left'>
              <Text className={`text-2xl font-bold ${getPrivacyScoreColor(privacyScore)}`}>
                {privacyScore}/100
              </Text>
              <div className={`text-sm font-medium ${getPrivacyScoreColor(privacyScore)}`}>
                {getPrivacyScoreLabel(privacyScore)}
              </div>
            </div>
          </div>
          <Text className='text-blue-700'>
            {privacyScore >= 80
              ? 'Great job! Your privacy settings are well configured.'
              : privacyScore >= 60
                ? 'Good privacy settings. Consider reviewing some options for better protection.'
                : 'Your privacy could be improved. Review the settings below.'}
          </Text>
        </div>
      </Card>

      {/* Profile Visibility */}
      {renderPrivacySection(
        'Profile Visibility',
        <EyeOutlined className='text-xl text-primary-navy' />,
        <div className='space-y-4'>
          <div className='p-4 border rounded-lg'>
            <h4 className='font-medium text-gray-900 mb-3'>Profile Visibility Level</h4>
            <p className='text-sm text-gray-500 mb-4'>
              Control who can see your profile information
            </p>
            <Select
              value={privacySettings.profileVisibility}
              onChange={value => handlePrivacySettingChange('profileVisibility', value)}
              className='w-full'
            >
              <Option value='public'>Public - Visible to all users</Option>
              <Option value='staff_only'>Staff Only - Visible to clinic staff</Option>
              <Option value='private'>Private - Only visible to you</Option>
            </Select>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {renderPrivacyToggle(
              'Show Email Address',
              'Allow others to see your email address',
              'showEmail'
            )}

            {renderPrivacyToggle(
              'Show Phone Number',
              'Allow others to see your phone number',
              'showPhone'
            )}

            {renderPrivacyToggle('Show Address', 'Allow others to see your address', 'showAddress')}
          </div>
        </div>
      )}

      {/* Contact Preferences */}
      {renderPrivacySection(
        'Contact Preferences',
        <LockOutlined className='text-xl text-primary-navy' />,
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {renderPrivacyToggle(
              'Allow Email Contact',
              'Allow staff to contact you via email',
              'allowContactByEmail'
            )}

            {renderPrivacyToggle(
              'Allow Phone Contact',
              'Allow staff to contact you via phone',
              'allowContactByPhone',
              !user.isPhoneVerified
            )}

            {renderPrivacyToggle(
              'Allow SMS Contact',
              'Allow staff to contact you via SMS',
              'allowContactBySMS',
              !user.isPhoneVerified
            )}
          </div>

          {!user.isPhoneVerified && (
            <Alert
              message='Phone Verification Required'
              description='You need to verify your phone number to enable phone and SMS contact preferences.'
              type='warning'
              showIcon
            />
          )}
        </div>
      )}

      {/* Data Sharing */}
      {renderPrivacySection(
        'Data Sharing & Analytics',
        <SafetyOutlined className='text-xl text-primary-navy' />,
        <div className='space-y-4'>
          {renderPrivacyToggle(
            'Share Analytics Data',
            'Help improve our services by sharing anonymous usage data',
            'shareAnalytics'
          )}

          {renderPrivacyToggle(
            'Share Usage Data',
            'Allow us to analyze how you use our platform',
            'shareUsageData'
          )}

          {renderPrivacyToggle(
            'Marketing Communications',
            'Receive promotional materials and special offers',
            'allowMarketing'
          )}

          {renderPrivacyToggle(
            'Third-Party Sharing',
            'Allow sharing data with trusted third-party services',
            'allowThirdPartySharing'
          )}
        </div>
      )}

      {/* Data Retention */}
      {renderPrivacySection(
        'Data Retention',
        <SafetyOutlined className='text-xl text-primary-navy' />,
        <div className='space-y-4'>
          <div className='p-4 border rounded-lg'>
            <h4 className='font-medium text-gray-900 mb-3'>Data Retention Policy</h4>
            <p className='text-sm text-gray-500 mb-4'>
              Choose how long we keep your data after account deletion
            </p>
            <Select
              value={privacySettings.dataRetention}
              onChange={value => handlePrivacySettingChange('dataRetention', value)}
              className='w-full'
            >
              <Option value='30_days'>30 days - Quick deletion</Option>
              <Option value='90_days'>90 days - Standard retention</Option>
              <Option value='1_year'>1 year - Extended retention</Option>
              <Option value='indefinite'>Indefinite - Legal compliance</Option>
            </Select>
            <div className='text-xs text-gray-500 mt-2'>
              Note: Some data may be retained longer for legal or regulatory compliance.
            </div>
          </div>
        </div>
      )}

      {/* Data Management */}
      {renderPrivacySection(
        'Data Management',
        <DownloadOutlined className='text-xl text-primary-navy' />,
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='relative'>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => setIsDataExportModalVisible(true)}
                className='h-auto p-4 flex flex-col items-center space-y-2'
              >
                <span className='font-medium'>Export My Data</span>
                <span className='text-xs text-gray-500'>Download all your data</span>
              </Button>
              <span className='absolute -top-4 -right-4 text-xs bg-orange-100 text-orange-600 p-1 rounded-md'>
                Soon
              </span>
            </div>

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setIsDeleteAccountModalVisible(true)}
              className='h-auto p-4 flex flex-col items-center space-y-2'
            >
              <span className='font-medium'>Delete Account</span>
              <span className='text-xs text-gray-500'>Permanently remove account</span>
            </Button>
          </div>
        </div>
      )}

      {/* Data Export Modal */}
      <Modal
        title='Export Your Data'
        open={isDataExportModalVisible}
        onOk={handleDataExport}
        onCancel={() => setIsDataExportModalVisible(false)}
        confirmLoading={exportLoading}
        okText='Export Data'
        cancelText='Cancel'
      >
        <div className='space-y-4'>
          <p>This will export all your personal data including:</p>
          <ul className='list-disc list-inside space-y-1 text-gray-600'>
            <li>Personal information</li>
            <li>Appointment history</li>
            <li>Medical records</li>
            <li>Communication history</li>
            <li>Account settings</li>
          </ul>
          <p className='text-sm text-gray-500'>
            The export will be sent to your email address and may take a few minutes to process.
          </p>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        title='Delete Account'
        open={isDeleteAccountModalVisible}
        onOk={handleAccountDeletion}
        onCancel={() => setIsDeleteAccountModalVisible(false)}
        confirmLoading={deleteLoading}
        okText='Delete Account'
        cancelText='Cancel'
        okButtonProps={{ danger: true }}
      >
        <div className='space-y-4'>
          <Alert
            message='Warning: This action cannot be undone'
            description='Deleting your account will permanently remove all your data, appointments, and records from our system.'
            type='warning'
            showIcon
          />
          <p>Are you sure you want to delete your account? This action will:</p>
          <ul className='list-disc list-inside space-y-1 text-red-600'>
            <li>Permanently delete all your data</li>
            <li>Cancel all future appointments</li>
            <li>Remove access to medical records</li>
            <li>Delete your account permanently</li>
          </ul>
          <p className='text-sm text-gray-500'>
            You will receive a confirmation email before the deletion is processed.
          </p>
        </div>
      </Modal>
    </div>
  );
};
