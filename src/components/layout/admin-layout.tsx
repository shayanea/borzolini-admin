import {
  ApiHealth,
  Appointments,
  Calendar,
  ClinicForm,
  Clinics,
  PetCases,
  Pets,
  Profile,
  Reports,
  Reviews,
  RoleDemo,
  Settings,
  Users,
} from '@/pages';
import {
  Avatar,
  Badge,
  BellOutlined,
  Button,
  Dropdown,
  Layout,
  Menu,
  MenuOutlined,
  MenuProps,
  Typography,
  UserOutlined,
} from '@/ui';
import { Route, Routes } from 'react-router-dom';

import RoleIndicator from './role-indicator';
import RoleProtectedRoute from '../auth/role-protected-route';
import { User } from '@/types';
import { useAdminLayoutLogic } from './admin-layout.logic';
import { useMemo } from 'react';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Constants to prevent unnecessary re-renders
const VETERINARIAN_ROLE_FILTER = 'veterinarian' as const;

const renderHeader = (
  handleToggleCollapsed: () => void,
  userMenuItems: MenuProps['items'],
  user: User | null,
  collapsed: boolean
) => {
  return (
    <Header className='admin-header px-6 overflow-hidden'>
      <div className='w-full flex items-center justify-between min-w-0'>
        <div className='flex items-center space-x-4 flex-shrink-0'>
          <Button
            type='text'
            icon={<MenuOutlined />}
            onClick={handleToggleCollapsed}
            className='text-lg'
          />
        </div>

        <div className='flex items-center space-x-4 flex-shrink-0 ml-auto'>
          {/* Notifications */}
          <Badge count={0} size='small'>
            <Button
              type='text'
              icon={<BellOutlined />}
              className='text-lg text-text-primary hover:text-primary-navy'
            />
          </Badge>

          {/* User Menu */}
          <Dropdown menu={{ items: userMenuItems }} placement='bottomRight' trigger={['click']}>
            <div className='flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors flex-shrink-0'>
              <Avatar size={40} icon={<UserOutlined />} className='bg-primary-navy' />
              {!collapsed && (
                <div className='text-left min-w-0'>
                  <div className='flex items-center space-x-2'>
                    <div className='font-medium text-text-primary truncate'>
                      {user?.firstName} {user?.lastName}
                    </div>
                    {user?.role && <RoleIndicator role={user.role as any} />}
                  </div>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

const AdminLayout = () => {
  const { collapsed, menuItems, getSelectedKey, handleToggleCollapsed, userMenuItems, user } =
    useAdminLayoutLogic();

  // Memoize the routes to prevent unnecessary re-renders
  const routes = useMemo(
    () => (
      <Routes>
        <Route
          path='calendar'
          element={
            <RoleProtectedRoute>
              <Calendar />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='appointments'
          element={
            <RoleProtectedRoute>
              <Appointments />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='clinics'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <Clinics />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='clinics/create'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <ClinicForm />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='clinics/edit/:id'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <ClinicForm />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='users'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <Users />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='veterinarians'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <Users roleFilter={VETERINARIAN_ROLE_FILTER} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='pet-cases'
          element={
            <RoleProtectedRoute>
              <PetCases />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='pets'
          element={
            <RoleProtectedRoute>
              <Pets />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='reports'
          element={
            <RoleProtectedRoute>
              <Reports />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='reviews'
          element={
            <RoleProtectedRoute>
              <Reviews />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='settings'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <Settings />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='profile'
          element={
            <RoleProtectedRoute>
              <Profile />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='api-health'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <ApiHealth />
            </RoleProtectedRoute>
          }
        />
        <Route
          path='role-demo'
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <RoleDemo />
            </RoleProtectedRoute>
          }
        />
        <Route
          path=''
          element={
            <RoleProtectedRoute requiredRole='admin'>
              <Settings />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    ),
    []
  );

  return (
    <Layout className='admin-layout'>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className='admin-sidebar fixed left-0 top-0 h-full z-50 m-4 rounded-xl shadow-lg'
        width={220}
        style={{
          backgroundColor: '#023e8a',
          height: 'calc(100vh - 2rem)',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div className='absolute inset-0 bg-pattern-dots opacity-10' />
        <div className='p-6 overflow-hidden'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 '>
              <span className='text-white font-bold text-lg'>B</span>
            </div>
            <Title
              level={4}
              className={`!mb-0 !text-white font-bold whitespace-nowrap ${collapsed ? 'hidden' : ''}`}
            >
              Borzolini
            </Title>
          </div>
        </div>

        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          className='admin-sidebar-menu px-4'
          inlineCollapsed={collapsed}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
          }}
        />
      </Sider>
      <Layout
        className='ml-4 rounded-lg shadow-lg bg-white h-full w-full overflow-hidden'
        style={{
          marginLeft: collapsed ? '7rem' : '16rem',
          transition: 'margin-left 0.2s ease-in-out',
          minHeight: '100vh',
        }}
      >
        {renderHeader(handleToggleCollapsed, userMenuItems, user || null, collapsed)}
        <Content className='admin-content p-6 w-full'>
          <div className='max-w-7xl mr-auto w-full'>{routes}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
