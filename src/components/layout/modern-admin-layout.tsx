import AdminRoutes from './admin-routes';
import ModernHeader from './modern-header';
import ModernSidebar from './modern-sidebar';
import React from 'react';
import { useAuthStore } from '@/stores/auth.store';

interface ModernAdminLayoutProps {
  onLogout?: () => void;
}

const ModernAdminLayout: React.FC<ModernAdminLayoutProps> = ({ onLogout }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = (): void => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userRole = user?.role || 'Staff';

  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Sidebar */}
      <ModernSidebar />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <ModernHeader userName={userName} userRole={userRole} onLogout={handleLogout} />

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

export default ModernAdminLayout;
