import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface ModernSidebarProps {
  collapsed?: boolean;
  menuItems?: Array<{ label: string; key: string; icon?: string; href?: string }>;
}

const defaultMenuItems = [
  { label: 'Dashboard', key: 'dashboard', icon: '📊', href: ROUTES.DASHBOARD },
  { label: 'Appointments', key: 'appointments', icon: '📅', href: ROUTES.APPOINTMENTS },
  { label: 'Patients', key: 'patients', icon: '🐾', href: ROUTES.PETS },
  { label: 'Team', key: 'team', icon: '👥', href: ROUTES.CLINIC_STAFF },
  { label: 'Reports', key: 'reports', icon: '📈', href: ROUTES.REPORTS },
  { label: 'Settings', key: 'settings', icon: '⚙️', href: ROUTES.SETTINGS },
];

const ModernSidebar: React.FC<ModernSidebarProps> = ({ collapsed = false, menuItems = defaultMenuItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href?: string): boolean => {
    if (!href) return false;
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-slate-200 transition-all duration-300 ease-out shadow-sm fixed left-0 top-0 h-screen flex flex-col`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        {isCollapsed ? (
          <div className="w-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-slate-900">Borzolini</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <button
              key={item.key}
              onClick={() => item.href && navigate(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                active
                  ? 'bg-emerald-50 text-emerald-600 font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="text-lg flex-shrink-0">{item.icon || '○'}</span>
              {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer - Clinic Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 mb-2 font-semibold">Clinic</p>
          <p className="text-sm font-medium text-slate-900 truncate">Green Valley Clinic</p>
          <p className="text-xs text-slate-500 truncate">San Francisco, CA</p>
        </div>
      )}
    </aside>
  );
};

export default ModernSidebar;
