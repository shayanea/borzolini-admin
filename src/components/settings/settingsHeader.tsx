import React from 'react';
import { Typography, Button, Space } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import type { SettingsHeaderProps } from '@/types/settings';

const { Title, Text } = Typography;

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onResetDefaults,
  onSaveChanges,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Title level={2} className="!mb-2">
          Settings
        </Title>
        <Text className="text-text-light">
          Configure clinic settings and preferences
        </Text>
      </div>
      
      <Space>
        <Button icon={<ReloadOutlined />} onClick={onResetDefaults}>
          Reset to Defaults
        </Button>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          className="bg-primary-navy border-primary-navy"
          onClick={onSaveChanges}
        >
          Save Changes
        </Button>
      </Space>
    </div>
  );
};

export default SettingsHeader;
