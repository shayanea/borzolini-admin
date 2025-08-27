import { Appointments, Calendar, Dashboard, Reports, Settings, Users } from '@/pages';
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
import { useAdminLayoutLogic } from './admin-layout.logic';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const renderHeader = (
  handleToggleCollapsed: () => void,
  navigateToNewAppointment: () => void,
  userMenuItems: MenuProps['items'],
  user: User | null,
  collapsed: boolean
) => {
  return (
    <Header className='admin-header px-6'>
      <div className='max-w-7xl mr-auto w-full flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            type='text'
            icon={<MenuOutlined />}
            onClick={handleToggleCollapsed}
            className='text-lg'
          />
        </div>
        <div className='flex items-center space-x-4'>
          {/* Action Buttons */}
          <Space>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
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
      </div>
    </Header>
  );
};

const renderContent = () => {
  return (
    <Content className='admin-content p-6 w-full'>
      <div className='max-w-7xl mr-auto w-full'>
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
      </div>
    </Content>
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
        {renderHeader(
          handleToggleCollapsed,
          navigateToNewAppointment,
          userMenuItems,
          user,
          collapsed
        )}
        {renderContent()}
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
