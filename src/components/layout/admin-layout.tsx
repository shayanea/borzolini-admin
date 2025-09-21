import { Layout } from '@/ui';
import AdminHeader from './admin-header';
import { useAdminLayoutLogic } from './admin-layout.logic';
import AdminRoutes from './admin-routes';
import AdminSidebar from './admin-sidebar';

const { Header, Content } = Layout;

const AdminLayout = () => {
  const { collapsed, menuItems, getSelectedKey, handleToggleCollapsed, userMenuItems, user } =
    useAdminLayoutLogic();

  return (
    <Layout className='admin-layout'>
      <AdminSidebar collapsed={collapsed} menuItems={menuItems} getSelectedKey={getSelectedKey} />
      <Layout
        className='ml-4 rounded-lg shadow-lg bg-white h-full w-full overflow-hidden'
        style={{
          marginLeft: collapsed ? '7rem' : '16rem',
          transition: 'margin-left 0.2s ease-in-out',
          minHeight: '100vh',
        }}
      >
        <Header>
          <AdminHeader
            handleToggleCollapsed={handleToggleCollapsed}
            userMenuItems={userMenuItems}
            user={user || null}
            collapsed={collapsed}
          />
        </Header>
        <Content className='admin-content p-6 w-full'>
          <div className='max-w-7xl mr-auto w-full'>
            <AdminRoutes />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
