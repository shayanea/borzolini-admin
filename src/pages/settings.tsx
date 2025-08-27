import {
  AppointmentSettings,
  GeneralSettings,
  NotificationSettings,
  SecuritySettings,
  SettingsHeader,
} from '@/components/settings';
import { Button, Form } from 'antd';

import { SaveOutlined } from '@ant-design/icons';
import { useSettings } from '@/hooks/use-settings';

const Settings = () => {
  const [form] = Form.useForm();
  const { initialValues, handleResetDefaults, onFinish } = useSettings();

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <SettingsHeader onResetDefaults={handleResetDefaults} onSaveChanges={() => {}} />

      <Form form={form} layout='vertical' onFinish={onFinish} initialValues={initialValues}>
        {/* General Settings */}
        <GeneralSettings />

        {/* Notification Settings */}
        <NotificationSettings />

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
            className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
          >
            Save All Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Settings;
