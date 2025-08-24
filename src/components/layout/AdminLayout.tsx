import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Typography,
  type MenuProps,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/dashboard';
import Calendar from '@/pages/calendar';
import Users from '@/pages/users';
import Appointments from '@/pages/appointments';
import Reports from '@/pages/reports';
import Settings from '@/pages/settings';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Menu items configuration
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/calendar',
      label: 'Calendar',
      icon: <CalendarOutlined />,
      onClick: () => navigate('/calendar'),
    },
    {
      key: '/appointments',
      label: 'Appointments',
      icon: <FileTextOutlined />,
      onClick: () => navigate('/appointments'),
    },
    {
      key: '/users',
      label: 'Users',
      icon: <UserOutlined />,
      onClick: () => navigate('/users'),
    },
    {
      key: '/veterinarians',
      label: 'Veterinarians',
      icon: <TeamOutlined />,
      onClick: () => navigate('/veterinarians'),
    },
    {
      key: '/reports',
      label: 'Reports',
      icon: <FileTextOutlined />,
      onClick: () => navigate('/reports'),
    },
    {
      key: '/settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  // Get current selected menu item
  const getSelectedKey = (): string => {
    const path = location.pathname;
    return menuItems?.find(item => item?.key === path)?.key?.toString() || '/dashboard';
  };

  return (
    <Layout className='admin-layout'>
      <Sider trigger={null} collapsible collapsed={collapsed} className='admin-sidebar' width={280}>
        <div className='p-6'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-primary-orange to-primary-navy rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>B</span>
            </div>
            {!collapsed && (
              <Title level={4} className='!mb-0'>
                Borzolini
              </Title>
            )}
          </div>
        </div>

        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          className='admin-sidebar-menu'
          style={{
            backgroundColor: 'transparent',
            border: 'none',
          }}
        />
      </Sider>

      <Layout>
        <Header className='admin-header px-6 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleToggleCollapsed}
              className='text-lg'
            />

            {/* Search Bar */}
            <div className='relative'>
              <SearchOutlined className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light' />
              <input
                type='text'
                placeholder='Search...'
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-transparent w-64'
              />
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            {/* Action Buttons */}
            <Space>
              <Button
                icon={<FilterOutlined />}
                className='border-gray-300 text-text-primary hover:border-primary-navy hover:text-primary-navy'
              >
                Filters
              </Button>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
              >
                New Appointment
              </Button>
            </Space>

            {/* Notifications */}
            <Badge count={3} size='small'>
              <Button
                type='text'
                icon={<BellOutlined />}
                className='text-lg text-text-primary hover:text-primary-navy'
              />
            </Badge>

            {/* User Menu */}
            <Dropdown menu={{ items: userMenuItems }} placement='bottomRight' trigger={['click']}>
              <div className='flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors'>
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className='bg-gradient-to-r from-primary-orange to-primary-navy'
                />
                {!collapsed && (
                  <div className='text-left'>
                    <div className='font-medium text-text-primary'>
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className='text-sm text-text-light capitalize'>{user?.role}</div>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className='admin-content p-6'>
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/appointments' element={<Appointments />} />
            <Route path='/users' element={<Users />} />
            <Route path='/veterinarians' element={<Users />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/' element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
