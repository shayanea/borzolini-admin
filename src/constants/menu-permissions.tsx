// Role-based menu permissions and configurations
import {
  BarChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  MessageOutlined,
  MonitorOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import React from 'react';
import { SoonBadge } from '@/components/shared/soon-badge';
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
  hidden?: boolean;
  badge?: React.ReactNode;
}

// Define all available menu items with unique icons
const ALL_MENU_ITEMS: MenuItemConfig[] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    icon: React.createElement(DashboardOutlined),
    onClick: () => {},
    roles: ['admin', 'veterinarian', 'staff', 'patient'],
  },
  {
    key: '/appointments',
    label: 'Appointments',
    icon: React.createElement(FileTextOutlined),
    onClick: () => {},
    roles: ['admin', 'veterinarian', 'staff', 'patient'],
  },
  {
    key: '/calendar',
    label: 'Calendar',
    icon: React.createElement(CalendarOutlined),
    onClick: () => {},
    roles: ['clinic_admin', 'staff'],
  },
  {
    key: '/clinics',
    label: 'Clinics',
    icon: React.createElement(MedicineBoxOutlined),
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
    key: '/patients',
    label: 'Patients',
    icon: React.createElement(UserOutlined),
    onClick: () => {},
    roles: ['clinic_admin', 'staff'],
  },
  {
    key: '/veterinarians',
    label: 'Veterinarians',
    icon: React.createElement(TeamOutlined),
    onClick: () => {},
    roles: [],
  },
  {
    key: '/pets',
    label: 'Pets',
    icon: React.createElement(HeartOutlined),
    onClick: () => {},
    roles: ['admin', 'veterinarian', 'staff', 'patient'],
  },
  {
    key: '/pet-cases',
    label: 'Pet Cases',
    icon: React.createElement(FileTextOutlined),
    onClick: () => {},
    roles: ['veterinarian', 'staff'],
  },
  {
    key: '/staff',
    label: 'Staff',
    icon: React.createElement(TeamOutlined),
    onClick: () => {},
    roles: ['clinic_admin'],
  },
  {
    key: '/reports',
    label: (
      <div className='relative flex items-center gap-2'>
        <span>Reports</span>
        <SoonBadge />
      </div>
    ),
    icon: React.createElement(BarChartOutlined),
    onClick: () => {},
    roles: ['admin'],
  },
  {
    key: '/reviews',
    label: (
      <div className='relative flex items-center gap-2'>
        <span>Reviews</span>
        <SoonBadge />
      </div>
    ),
    icon: React.createElement(StarOutlined),
    onClick: () => {},
    roles: ['admin'],
  },
  {
    key: '/contacts',
    label: 'Contact Messages',
    icon: React.createElement(MessageOutlined),
    onClick: () => {},
    roles: ['admin'],
  },
  {
    key: '/api-health',
    label: (
      <div className='relative flex items-center gap-2'>
        <span>API Health</span>
        <SoonBadge />
      </div>
    ),
    icon: React.createElement(MonitorOutlined),
    onClick: () => {},
    roles: ['admin'],
  },
  {
    key: '/role-demo',
    label: 'Role Demo',
    icon: React.createElement(ExperimentOutlined),
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
  {
    key: '/profile',
    label: 'Profile',
    icon: React.createElement(UserOutlined),
    onClick: () => {},
    roles: ['admin', 'veterinarian', 'staff', 'patient'],
  },
];

// Role-based menu configurations
export const MENU_ITEMS: Record<UserRole, MenuItemConfig[]> = {
  admin: ALL_MENU_ITEMS.filter(item => item.roles.includes('admin')),
  // clinic_admin should only see pages related to their clinic (not admin pages like clinics, users, settings)
  clinic_admin: ALL_MENU_ITEMS.filter(
    item =>
      item.roles.includes('veterinarian') ||
      item.roles.includes('staff') ||
      item.key === '/dashboard' ||
      item.key === '/appointments' ||
      item.key === '/calendar' ||
      item.key === '/pets' ||
      item.key === '/pet-cases' ||
      item.key === '/staff' ||
      item.key === '/profile'
  ),
  veterinarian: ALL_MENU_ITEMS.filter(item => item.roles.includes('veterinarian')),
  staff: ALL_MENU_ITEMS.filter(item => item.roles.includes('staff')),
  patient: ALL_MENU_ITEMS.filter(item => item.roles.includes('patient')),
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
  const baseRoutes = roleMenuItems.map(item => item.key);

  // Add sub-routes for routes that have them
  const subRoutes: string[] = [];

  baseRoutes.forEach(route => {
    switch (route) {
      case '/clinics':
        subRoutes.push('/clinics/create', '/clinics/edit/');
        break;
      // Add other routes with sub-routes as needed
      default:
        break;
    }
  });

  return [...baseRoutes, ...subRoutes];
};
