import { Alert, Card, Space, Typography } from 'antd';
import { useState } from 'react';
import { getAccessibleRoutes, getMenuItemsForRole } from '@/constants/menu-permissions';

// Demo page to test role-based menu filtering
import RoleSwitcher from '@/components/demo/role-switcher';
import { UserRole } from '@/types';

const { Title, Text, Paragraph } = Typography;

function RoleDemo() {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
  };

  const menuItems = getMenuItemsForRole(currentRole);
  const accessibleRoutes = getAccessibleRoutes(currentRole);

  return (
    <div className='p-6'>
      <Title level={2}>Role-Based Menu Demo</Title>
      <Paragraph>
        This demo shows how different user roles see different menu items and have different access
        permissions.
      </Paragraph>

      <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />

      <Space direction='vertical' className='w-full' size='large'>
        <Card title={`Menu Items for ${currentRole.toUpperCase()}`}>
          <Space direction='vertical' className='w-full'>
            {menuItems.map(item => (
              <div key={item.key} className='flex items-center space-x-3 p-2 border rounded'>
                <span className='text-lg'>{item.icon}</span>
                <div>
                  <Text strong>{item.label}</Text>
                  <br />
                  <Text type='secondary' code>
                    {item.key}
                  </Text>
                </div>
              </div>
            ))}
          </Space>
        </Card>

        <Card title='Accessible Routes'>
          <Space wrap>
            {accessibleRoutes.map(route => (
              <Text key={route} code>
                {route}
              </Text>
            ))}
          </Space>
        </Card>

        <Alert
          message='How it works'
          description={
            <div>
              <Paragraph>
                <strong>Admin:</strong> Full access to all features including user management,
                clinics, and API health.
              </Paragraph>
              <Paragraph>
                <strong>Veterinarian:</strong> Access to their schedule, appointments, patients, and
                cases. No access to user management or clinics.
              </Paragraph>
              <Paragraph>
                <strong>Staff:</strong> Basic access to schedule, appointments, pets, and cases. No
                administrative features.
              </Paragraph>
              <Paragraph>
                <strong>Patient:</strong> Limited access to their own appointments, pets, and cases.
                No access to administrative features.
              </Paragraph>
            </div>
          }
          type='info'
          showIcon
        />
      </Space>
    </div>
  );
}

export { RoleDemo };
export default RoleDemo;
