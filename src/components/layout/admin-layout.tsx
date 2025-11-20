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
        className='ml-4 rounded-lg shadow-lg bg-transparent h-full overflow-hidden'
        style={{
          marginLeft: collapsed ? '7rem' : '16rem',
          transition: 'margin-left 0.2s ease-in-out',
          minHeight: '100vh',
          width: collapsed ? 'calc(100vw - 7rem - 1rem)' : 'calc(100vw - 16rem - 1rem)',
          maxWidth: collapsed ? 'calc(100vw - 7rem - 1rem)' : 'calc(100vw - 16rem - 1rem)',
        }}
      >
        <Header style={{ padding: 0 }}>
          <AdminHeader
            handleToggleCollapsed={handleToggleCollapsed}
            userMenuItems={userMenuItems}
            user={user || null}
            collapsed={collapsed}
          />
        </Header>
        <Content className='admin-content p-6 overflow-hidden'>
          <div className='w-full max-w-full overflow-hidden'>
            <AdminRoutes />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export { AdminLayout };
export default AdminLayout;
