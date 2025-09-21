import { User } from '@/types';
import { Avatar, Badge, BellOutlined, Button, Dropdown, MenuOutlined, MenuProps } from '@/ui';

interface AdminHeaderProps {
  handleToggleCollapsed: () => void;
  userMenuItems: MenuProps['items'];
  user: User | null;
  collapsed: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  handleToggleCollapsed,
  userMenuItems,
  user,
  collapsed,
}) => {
  return (
    <div className='admin-header px-6 overflow-hidden'>
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
              <Avatar
                size={40}
                className='bg-primary-navy flex items-center justify-center'
                src='/borzolini-logo.svg'
              />
              {!collapsed && (
                <div className='text-left min-w-0'>
                  <div className='flex items-center space-x-2'>
                    <div className='font-medium text-text-primary truncate'>
                      {user?.firstName} {user?.lastName}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
