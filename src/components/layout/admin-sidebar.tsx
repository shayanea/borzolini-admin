import { Menu, MenuProps, Typography } from '@/ui';

const { Title } = Typography;

interface AdminSidebarProps {
  collapsed: boolean;
  menuItems: MenuProps['items'];
  getSelectedKey: () => string;
}

function AdminSidebar({ collapsed, menuItems, getSelectedKey }: AdminSidebarProps) {
  return (
    <div
      className='admin-sidebar fixed left-0 top-0 h-full z-50 m-4 rounded-xl shadow-lg'
      style={{
        width: collapsed ? '80px' : '220px',
        backgroundColor: '#023e8a',
        height: 'calc(100vh - 2rem)',
        marginTop: '1rem',
        marginBottom: '1rem',
        transition: 'width 0.2s ease-in-out',
      }}
    >
      <div className='absolute inset-0 bg-pattern-dots opacity-10' />
      <div
        className={`py-6 px-4 overflow-hidden ${collapsed ? 'flex items-center justify-center' : ''}`}
      >
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 min-w-10 min-h-10 rounded-lg flex items-center justify-center bg-white'>
            <span className='bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent font-bold text-xl'>
              B
            </span>
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
    </div>
  );
}

export { AdminSidebar };
export default AdminSidebar;
