import React from 'react';
import ModernSidebar from './modern-sidebar';
import ModernHeader from './modern-header';
import AdminRoutes from './admin-routes';

interface ModernAdminLayoutProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const ModernAdminLayout: React.FC<ModernAdminLayoutProps> = ({
  userName = 'Dr. Sarah',
  userRole = 'Clinic Manager',
  onLogout,
}) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <ModernSidebar collapsed={false} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64 transition-all duration-300">
        {/* Header */}
        <ModernHeader userName={userName} userRole={userRole} onLogout={onLogout} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl">
            <AdminRoutes />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernAdminLayout;
