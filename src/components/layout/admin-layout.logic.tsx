import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MonitorOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
} from '@/ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { MenuProps } from 'antd';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/use-auth';

export const useAdminLayoutLogic = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleToggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  // Menu items configuration (base)
  const baseMenuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      onClick: () => navigate(ROUTES.DASHBOARD),
    },
    {
      key: '/calendar',
      label: 'Calendar',
      icon: <CalendarOutlined />,
      onClick: () => navigate(ROUTES.CALENDAR),
    },
    {
      key: '/appointments',
      label: 'Appointments',
      icon: <FileTextOutlined />,
      onClick: () => navigate(ROUTES.APPOINTMENTS),
    },
    {
      key: '/clinics',
      label: 'Clinics',
      icon: <BankOutlined />,
      onClick: () => navigate(ROUTES.CLINICS),
    },
    {
      key: '/users',
      label: 'Users',
      icon: <UserOutlined />,
      onClick: () => navigate(ROUTES.USERS),
    },
    {
      key: '/veterinarians',
      label: 'Veterinarians',
      icon: <TeamOutlined />,
      onClick: () => navigate(ROUTES.VETERINARIANS),
    },
    {
      key: '/reports',
      label: 'Reports',
      icon: <FileTextOutlined />,
      onClick: () => navigate(ROUTES.REPORTS),
    },
    {
      key: '/api-health',
      label: 'API Health',
      icon: <MonitorOutlined />,
      onClick: () => navigate(ROUTES.API_HEALTH),
    },
    {
      key: '/settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate(ROUTES.SETTINGS),
    },
  ];

  // Get current selected menu item
  const getSelectedKey = (): string => {
    const path = location.pathname;
    return baseMenuItems?.find(item => item?.key === path)?.key?.toString() || ROUTES.DASHBOARD;
  };

  // Add a custom class to the active item for text color overrides if needed
  const menuItems: MenuProps['items'] = useMemo(() => {
    const selectedKey = getSelectedKey();
    return baseMenuItems.map(item => {
      if (!item) return item;
      const isSelected = item.key === selectedKey;
      return {
        ...item,
        className: isSelected ? 'menu-item-selected-custom' : undefined,
      } as NonNullable<typeof item>;
    });
  }, [location.pathname]);

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
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate(ROUTES.SETTINGS),
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
