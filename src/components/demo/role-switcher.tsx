import { Button, Card, Space, Typography } from 'antd';

import React from 'react';
// Demo component to switch between different user roles for testing
import { UserRole } from '@/types';

const { Text } = Typography;

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const roles: { role: UserRole; label: string; color: string }[] = [
    { role: 'admin', label: 'Admin', color: 'red' },
    { role: 'veterinarian', label: 'Veterinarian', color: 'blue' },
    { role: 'staff', label: 'Staff', color: 'green' },
    { role: 'patient', label: 'Patient', color: 'default' },
  ];

  return (
    <Card title='Role Switcher (Demo)' className='mb-4'>
      <Space direction='vertical' className='w-full'>
        <Text>
          Current Role: <strong>{currentRole}</strong>
        </Text>
        <Text type='secondary'>Click a role below to switch and see different menu items:</Text>
        <Space wrap>
          {roles.map(({ role, label, color }) => (
            <Button
              key={role}
              type={currentRole === role ? 'primary' : 'default'}
              onClick={() => onRoleChange(role)}
              style={{
                borderColor: currentRole === role ? undefined : color,
                color: currentRole === role ? undefined : color,
              }}
            >
              {label}
            </Button>
          ))}
        </Space>
      </Space>
    </Card>
  );
};

export default RoleSwitcher;
