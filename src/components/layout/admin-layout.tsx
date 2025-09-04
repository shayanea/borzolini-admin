import {
  ApiHealth,
  Appointments,
  Calendar,
  ClinicForm,
  Clinics,
  Dashboard,
  PetCases,
  Pets,
  Profile,
  Reports,
  Reviews,
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
  PlusOutlined,
  Space,
  Typography,
  UserOutlined,
} from '@/ui';
import { Route, Routes } from 'react-router-dom';

import { User } from '@/types';
import { useMemo } from 'react';
import { useAdminLayoutLogic } from './admin-layout.logic';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Constants to prevent unnecessary re-renders
const VETERINARIAN_ROLE_FILTER = 'veterinarian' as const;

const renderHeader = (
  handleToggleCollapsed: () => void,
  navigateToNewAppointment: () => void,
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
          {/* Action Buttons */}
          <Space>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark whitespace-nowrap'
              onClick={navigateToNewAppointment}
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
            <div className='flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors flex-shrink-0'>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className='bg-gradient-to-r from-cyan-500 to-blue-500'
              />
              {!collapsed && (
                <div className='text-left min-w-0'>
                  <div className='font-medium text-text-primary truncate'>
                    {user?.firstName} {user?.lastName}
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
  const {
    collapsed,
    menuItems,
    getSelectedKey,
    handleToggleCollapsed,
    userMenuItems,
    user,
    navigateToNewAppointment,
  } = useAdminLayoutLogic();

  // Memoize the routes to prevent unnecessary re-renders
  const routes = useMemo(
    () => (
      <Routes>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='calendar' element={<Calendar />} />
        <Route path='appointments' element={<Appointments />} />
        <Route path='clinics' element={<Clinics />} />
        <Route path='clinics/create' element={<ClinicForm />} />
        <Route path='clinics/edit/:id' element={<ClinicForm />} />
        <Route path='users' element={<Users />} />
        <Route path='veterinarians' element={<Users roleFilter={VETERINARIAN_ROLE_FILTER} />} />
        <Route path='pet-cases' element={<PetCases />} />
        <Route path='pets' element={<Pets />} />
        <Route path='reports' element={<Reports />} />
        <Route path='reviews' element={<Reviews />} />
        <Route path='settings' element={<Settings />} />
        <Route path='profile' element={<Profile />} />
        <Route path='api-health' element={<ApiHealth />} />
        <Route path='' element={<Dashboard />} />
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
          backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
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
        {renderHeader(
          handleToggleCollapsed,
          navigateToNewAppointment,
          userMenuItems,
          user || null,
          collapsed
        )}
        <Content className='admin-content p-6 w-full'>
          <div className='max-w-7xl mr-auto w-full'>{routes}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
