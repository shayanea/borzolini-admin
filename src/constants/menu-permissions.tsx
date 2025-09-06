// Role-based menu permissions and configurations
import {
  BankOutlined,
  BarChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  MessageOutlined,
  MonitorOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import React from 'react';
import { Tag } from 'antd';
import { UserRole } from '../types';

// Menu item interface
export interface MenuItemConfig {
  key: string;
  label: string | React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  roles: UserRole[];
  className?: string;
  disabled?: boolean;
  badge?: React.ReactNode;
}

// Role-based menu configurations
export const MENU_ITEMS: Record<UserRole, MenuItemConfig[]> = {
  admin: [
    {
      key: '/dashboard',
      label: 'Dashboard',
      icon: React.createElement(DashboardOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/calendar',
      label: 'Calendar',
      icon: React.createElement(CalendarOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/appointments',
      label: 'Appointments',
      icon: React.createElement(FileTextOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/clinics',
      label: 'Clinics',
      icon: React.createElement(BankOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/users',
      label: 'Users',
      icon: React.createElement(UserOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/veterinarians',
      label: 'Veterinarians',
      icon: React.createElement(TeamOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/pets',
      label: 'Pets',
      icon: React.createElement(HeartOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/pet-cases',
      label: 'Pet Cases',
      icon: React.createElement(MedicineBoxOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/reports',
      label: React.createElement(
        'div',
        { className: 'flex items-center justify-between w-full' },
        React.createElement('span', null, 'Reports'),
        React.createElement(Tag, { color: 'green' }, 'Soon')
      ),
      icon: React.createElement(BarChartOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/reviews',
      label: React.createElement(
        'div',
        { className: 'flex items-center justify-between w-full' },
        React.createElement('span', null, 'Reviews'),
        React.createElement(Tag, { color: 'green' }, 'Soon')
      ),
      icon: React.createElement(MessageOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/api-health',
      label: 'API Health',
      icon: React.createElement(MonitorOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/role-demo',
      label: 'Role Demo',
      icon: React.createElement(UserOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
    {
      key: '/settings',
      label: 'Settings',
      icon: React.createElement(SettingOutlined),
      onClick: () => {},
      roles: ['admin'],
    },
  ],

  veterinarian: [
    {
      key: '/dashboard',
      label: 'Dashboard',
      icon: React.createElement(DashboardOutlined),
      onClick: () => {},
      roles: ['veterinarian'],
    },
    {
      key: '/calendar',
      label: 'My Schedule',
      icon: React.createElement(CalendarOutlined),
      onClick: () => {},
      roles: ['veterinarian'],
    },
    {
      key: '/appointments',
      label: 'My Appointments',
      icon: React.createElement(FileTextOutlined),
      onClick: () => {},
      roles: ['veterinarian'],
    },
    {
      key: '/pets',
      label: 'Patients',
      icon: React.createElement(HeartOutlined),
      onClick: () => {},
      roles: ['veterinarian'],
    },
    {
      key: '/pet-cases',
      label: 'My Cases',
      icon: React.createElement(MedicineBoxOutlined),
      onClick: () => {},
      roles: ['veterinarian'],
    },
    {
      key: '/reports',
      label: React.createElement(
        'div',
        { className: 'flex items-center justify-between w-full' },
        React.createElement('span', null, 'My Reports'),
        React.createElement(Tag, { color: 'green' }, 'Soon')
      ),
      icon: React.createElement(BarChartOutlined),
      onClick: () => {},
      roles: ['veterinarian'],
    },
    {
      key: '/settings',
      label: 'Settings',
      icon: React.createElement(SettingOutlined),
      onClick: () => {},
      roles: ['veterinarian'],
    },
  ],

  staff: [
    {
      key: '/dashboard',
      label: 'Dashboard',
      icon: React.createElement(DashboardOutlined),
      onClick: () => {},
      roles: ['staff'],
    },
    {
      key: '/calendar',
      label: 'Schedule',
      icon: React.createElement(CalendarOutlined),
      onClick: () => {},
      roles: ['staff'],
    },
    {
      key: '/appointments',
      label: 'Appointments',
      icon: React.createElement(FileTextOutlined),
      onClick: () => {},
      roles: ['staff'],
    },
    {
      key: '/pets',
      label: 'Pets',
      icon: React.createElement(HeartOutlined),
      onClick: () => {},
      roles: ['staff'],
    },
    {
      key: '/pet-cases',
      label: 'Cases',
      icon: React.createElement(MedicineBoxOutlined),
      onClick: () => {},
      roles: ['staff'],
    },
    {
      key: '/settings',
      label: 'Settings',
      icon: React.createElement(SettingOutlined),
      onClick: () => {},
      roles: ['staff'],
    },
  ],

  patient: [
    {
      key: '/dashboard',
      label: 'My Dashboard',
      icon: React.createElement(DashboardOutlined),
      onClick: () => {},
      roles: ['patient'],
    },
    {
      key: '/appointments',
      label: 'My Appointments',
      icon: React.createElement(FileTextOutlined),
      onClick: () => {},
      roles: ['patient'],
    },
    {
      key: '/pets',
      label: 'My Pets',
      icon: React.createElement(HeartOutlined),
      onClick: () => {},
      roles: ['patient'],
    },
    {
      key: '/pet-cases',
      label: 'My Pet Cases',
      icon: React.createElement(MedicineBoxOutlined),
      onClick: () => {},
      roles: ['patient'],
    },
    {
      key: '/settings',
      label: 'Settings',
      icon: React.createElement(SettingOutlined),
      onClick: () => {},
      roles: ['patient'],
    },
  ],
};

// Helper function to get menu items for a specific role
export const getMenuItemsForRole = (role: UserRole): MenuItemConfig[] => {
  return MENU_ITEMS[role] || [];
};

// Helper function to check if a user has access to a specific menu item
export const hasMenuAccess = (userRole: UserRole, menuKey: string): boolean => {
  const roleMenuItems = getMenuItemsForRole(userRole);
  return roleMenuItems.some(item => item.key === menuKey);
};

// Helper function to get all accessible routes for a role
export const getAccessibleRoutes = (role: UserRole): string[] => {
  const roleMenuItems = getMenuItemsForRole(role);
  return roleMenuItems.map(item => item.key);
};
