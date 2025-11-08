import { Col, Row } from 'antd';
import {
  GeneralSettings,
  IntegrationSettings,
  NotificationSettings,
  SecuritySettings,
  SettingsCategories,
  SettingsHeader,
} from '@/components/settings';

const Settings = () => {
  /**
   * Reset form values to defaults
   * TODO: Wire this up to actual form logic when service layer is ready
   */
  const handleResetDefaults = () => {
    // placeholder – integrate with react-hook-form or antd Form instance
    console.info('Reset settings to default values');
  };

  /**
   * Persist settings to backend
   * TODO: Replace console with mutation calling SettingsService
   */
  const handleSaveChanges = () => {
    console.info('Save settings changes');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <SettingsHeader onResetDefaults={handleResetDefaults} onSaveChanges={handleSaveChanges} />

      {/* Categories quick links */}
      <SettingsCategories />

      {/* Detailed editable sections */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <GeneralSettings />
        </Col>
        <Col xs={24} lg={12}>
          <SecuritySettings />
        </Col>
      </Row>

      <NotificationSettings />
      <IntegrationSettings />
    </div>
  );
};

export default Settings;
