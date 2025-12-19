/* eslint-env browser */

import { Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

import AdminRoutes from './admin-routes';
import ModernHeader from './modern-header';
import ModernSidebar from './modern-sidebar';
import { ROUTES } from '@/constants';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';

interface ModernAdminLayoutProps {
  onLogout?: () => void;
}

function ModernAdminLayout({ onLogout }: ModernAdminLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: ReactKeyboardEvent) => {
      // New Appointment: Ctrl+N
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        navigate(ROUTES.APPOINTMENTS + '?showCreate=true');
      }

      // Command Palette: Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleCommandSelect = (value: string) => {
    navigate(value);
    setShowCommandPalette(false);
  };

  const commands = [
    { label: 'Dashboard', value: ROUTES.DASHBOARD },
    { label: 'Appointments', value: ROUTES.APPOINTMENTS },
    { label: 'Calendar', value: ROUTES.CALENDAR },
    { label: 'Patients', value: ROUTES.PATIENTS },
    { label: 'New Appointment', value: ROUTES.APPOINTMENTS + '?showCreate=true' },
    { label: 'Reports', value: ROUTES.REPORTS },
    { label: 'Settings', value: ROUTES.SETTINGS },
  ];

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
      {/* Command Palette Modal */}
      <Modal
        open={showCommandPalette}
        onCancel={() => setShowCommandPalette(false)}
        footer={null}
        closable={false}
        maskClosable={true}
        className='command-palette-modal top-20'
        width={600}
        styles={{ content: { padding: 0, borderRadius: '12px', overflow: 'hidden' } }}
      >
        <div className='flex items-center px-4 py-3 border-b border-slate-100'>
          <Search className='text-slate-400 mr-3' size={20} />
          <Select
            showSearch
            placeholder='Type a command or search...'
            defaultOpen
            autoFocus
            className='w-full !border-none !shadow-none'
            style={{ width: '100%' }}
            variant='borderless'
            optionFilterProp='label'
            onChange={handleCommandSelect}
            options={commands}
            size='large'
            suffixIcon={null}
          />
          <div className='flex gap-2 ml-2'>
            <kbd className='hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-md'>
              Esc
            </kbd>
          </div>
        </div>
        <div className='bg-slate-50 px-4 py-2 text-xs text-slate-500 flex justify-between'>
          <span>Quick Navigation</span>
          <div className='flex gap-3'>
            <span>
              <kbd className='font-sans'>Ctrl</kbd> + <kbd className='font-sans'>N</kbd> New
              Appointment
            </span>
            <span>
              <kbd className='font-sans'>Ctrl</kbd> + <kbd className='font-sans'>F</kbd> Search
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { ModernAdminLayout };
export default ModernAdminLayout;
