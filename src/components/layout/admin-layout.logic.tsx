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

  // Redirect admin users to settings if they try to access dashboard or root
  useEffect(() => {
    if (user && userRole === 'admin') {
      const currentPath = location.pathname;
      if (currentPath === '/' || currentPath === '/dashboard') {
        navigate(ROUTES.SETTINGS, { replace: true });
      }
    }
  }, [user, userRole, location.pathname, navigate]);

  // Convert role menu items to Ant Design menu format
  const baseMenuItems: MenuProps['items'] = roleMenuItems.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    onClick: () => {
      // Map menu keys to routes
      const routeMap: Record<string, string> = {
        '/dashboard': ROUTES.DASHBOARD,
        '/calendar': ROUTES.CALENDAR,
        '/appointments': ROUTES.APPOINTMENTS,
        '/clinics': ROUTES.CLINICS,
        '/users': ROUTES.USERS,
        '/veterinarians': ROUTES.VETERINARIANS,
        '/pets': ROUTES.PETS,
        '/pet-cases': ROUTES.PET_CASES,
        '/reports': ROUTES.REPORTS,
        '/reviews': ROUTES.REVIEWS,
        '/api-health': ROUTES.API_HEALTH,
        '/role-demo': ROUTES.ROLE_DEMO,
        '/settings': ROUTES.SETTINGS,
        '/profile': ROUTES.PROFILE,
      };

      const route = routeMap[item.key];
      if (route) {
        navigate(route);
      }
    },
    className: item.className,
    disabled: item.disabled,
  }));

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
