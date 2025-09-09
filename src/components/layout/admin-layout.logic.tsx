import { LogoutOutlined, SettingOutlined, UserOutlined } from '@/ui';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MenuProps } from 'antd';
import { ROUTES } from '@/constants';
import { UserRole } from '@/types';
import { getMenuItemsForRole } from '@/constants/menu-permissions';
import { useAuth } from '@/hooks/use-auth';

export const useAdminLayoutLogic = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleToggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  // Get role-based menu items
  const userRole = (user?.role as UserRole) || 'admin';
  const roleMenuItems = getMenuItemsForRole(userRole);

  // Redirect non-admin users to appointments if they try to access admin-only routes
  useEffect(() => {
    if (user && userRole !== 'admin') {
      const currentPath = location.pathname;
      if (currentPath === '/' || currentPath === '/dashboard' || currentPath === '/settings') {
        navigate(ROUTES.APPOINTMENTS, { replace: true });
      }
    }
  }, [user, userRole, location.pathname, navigate]);

  // Redirect admin users to dashboard if they try to access root
  useEffect(() => {
    if (user && userRole === 'admin') {
      const currentPath = location.pathname;
      if (currentPath === '/') {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    }
  }, [user, userRole, location.pathname, navigate]);

  // Convert role menu items to Ant Design menu format
  const baseMenuItems: MenuProps['items'] = roleMenuItems.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    onClick: () => navigate(item.key),
    className: item.className,
    disabled: item.disabled,
    hidden: item.hidden,
  }));

  // Get current selected menu item
  const getSelectedKey = (): string => {
    return location.pathname;
  };

  // Menu items with selection styling
  const menuItems: MenuProps['items'] = useMemo(() => {
    const selectedKey = getSelectedKey();
    return baseMenuItems.map(item => {
      if (!item) return item;
      return {
        ...item,
        className: item.key === selectedKey ? 'menu-item-selected-custom' : undefined,
      };
    });
  }, [baseMenuItems, location.pathname]);

  // Handle logout
  const handleLogout = () => logout();

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
      disabled: userRole !== 'admin',
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
