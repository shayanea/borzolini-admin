import { Alert, Button, Form, Spin } from 'antd';
import {
  AppointmentSettings,
  BasicSettings,
  GeneralSettings,
  SecuritySettings,
  SettingsHeader,
} from '@/components/settings';

import { SaveOutlined } from '@ant-design/icons';
import { useSettings } from '@/hooks/use-settings';

// TODO: Add notification settings

const Settings = () => {
  const [form] = Form.useForm();
  const {
    initialValues,
    handleResetDefaults,
    onFinish,
    settingsLoading,
    updateLoading,
    resetLoading,
    settingsError,
  } = useSettings();

  const handleSave = () => {
    form.submit();
  };

  // Show loading spinner while fetching settings
  if (settingsLoading) {
    return (
      <div className='flex justify-center items-center min-h-96'>
        <Spin size='large' />
      </div>
    );
  }

  // Show error if settings failed to load
  if (settingsError) {
    return (
      <div className='space-y-6'>
        <Alert
          message='Failed to Load Settings'
          description='There was an error loading the settings. Please try refreshing the page.'
          type='error'
          showIcon
          action={
            <Button size='small' onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <SettingsHeader onResetDefaults={handleResetDefaults} onSaveChanges={handleSave} />

      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={initialValues}
        disabled={settingsLoading || updateLoading}
      >
        {/* Basic Settings */}
        <BasicSettings />

        {/* General Settings */}
        <GeneralSettings />

        {/* Appointment Settings */}
        <AppointmentSettings />

        {/* Security Settings */}
        <SecuritySettings />

        {/* Save Button */}
        <div className='text-center'>
          <Button
            type='primary'
            htmlType='submit'
            size='large'
            icon={<SaveOutlined />}
            loading={updateLoading}
            disabled={settingsLoading || resetLoading}
            className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
          >
            {updateLoading ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Settings;
