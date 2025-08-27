import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@/ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { MenuProps } from 'antd';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export const useAdminLayoutLogic = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleToggleCollapsed = () => {
    setCollapsed(prev => !prev);
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
    return menuItems?.find(item => item?.key === path)?.key?.toString() || ROUTES.DASHBOARD;
  };

  const navigateToNewAppointment = () => {
    navigate(ROUTES.APPOINTMENTS);
  };

  return {
    user,
    collapsed,
    menuItems,
    userMenuItems,
    getSelectedKey,
    handleToggleCollapsed,
    handleLogout,
    navigateToNewAppointment,
  };
};
