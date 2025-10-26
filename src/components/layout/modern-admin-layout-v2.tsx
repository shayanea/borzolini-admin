import AdminRoutes from './admin-routes';
import ModernHeaderV2 from './modern-header-v2';
import ModernSidebarV2 from './modern-sidebar-v2';
import React from 'react';
import { useAuthStore } from '@/stores/auth.store';

interface ModernAdminLayoutV2Props {
  onLogout?: () => void;
}

const ModernAdminLayoutV2: React.FC<ModernAdminLayoutV2Props> = ({ onLogout }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = (): void => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userRole = user?.role?.name || 'Staff';

  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Sidebar */}
      <ModernSidebarV2 />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <ModernHeaderV2 userName={userName} userRole={userRole} onLogout={handleLogout} />

        {/* Page Content */}
        <main className='flex-1 overflow-auto bg-gradient-to-b from-transparent to-white/50'>
          <div className='p-6 max-w-[1600px] mx-auto w-full'>
            <AdminRoutes />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernAdminLayoutV2;
