import {
  BarChart,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  HeartPulse,
  Home,
  LayoutDashboard,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  PawPrint,
  Settings as SettingsIcon,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Tooltip } from 'antd';
import { getMenuItemsForRole } from '@/constants/menu-permissions';
import { useAuthStore } from '@/stores/auth.store';

// Icon mapping for menu items
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  '/dashboard': LayoutDashboard,
  '/appointments': ClipboardList,
  '/calendar': CalendarDays,
  '/clinics': Building2,
  '/users': Users,
  '/staff': Users,
  '/veterinarians': HeartPulse,
  '/patients': Users,
  '/pets': PawPrint,
  '/pet-cases': Stethoscope,
  '/reports': BarChart,
  '/reviews': MessageSquare,
  '/contacts': Mail,
  '/api-health': Monitor,
  '/role-demo': FlaskConical,
  '/settings': SettingsIcon,
  '/admin/resources': FileText,
  '/admin/training': BookOpen,
  '/admin/household-safety': Home,
  '/admin/breeds': Layers,
};

interface ModernSidebarProps {
  collapsed?: boolean;
}

function ModernSidebar({ collapsed = false }: ModernSidebarProps) {
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);
  const location = useLocation();
  const navigate = useNavigate();

  // Get role-based menu items
  const userRole =
    (user?.role as 'admin' | 'veterinarian' | 'staff' | 'patient' | 'clinic_admin') || 'admin';
  const roleMenuItems = getMenuItemsForRole(userRole);

  const isActive = (href: string): boolean => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const handleNavClick = (href: string): void => {
    navigate(href);
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-56'
      } bg-slate-900 border-r border-slate-700/50 transition-all duration-500 ease-in-out shadow-xl flex flex-col transform-gpu relative z-50`}
    >
      {/* Logo Section */}
      <div className='p-6 border-b border-slate-700/50 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10' />
        <div className='relative flex items-center justify-between'>
          <div
            className={`flex items-center ${isCollapsed ? 'w-full justify-center' : 'gap-3'} transition-all duration-500 ease-in-out`}
          >
            <div className='min-w-12 w-12 h-12 rounded-xl bg-[#6ecefd] flex items-center justify-center shadow-lg shadow-[#6ecefd]/30 flex-shrink-0'>
              <span className='text-white font-bold text-lg'>B</span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
            >
              <span className='font-bold text-xl text-white block whitespace-nowrap'>
                Borzolini
              </span>
              <span className='text-xs text-slate-400 font-medium whitespace-nowrap'>
                Veterinary Clinic
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Menu Content */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar'>
        {/* Main Navigation */}
        <nav className='p-3 space-y-1'>
          {roleMenuItems
            .filter(
              item =>
                item.key !== '/settings' && item.key !== '/profile' && item.key !== '/role-demo'
            )
            .map(item => {
              if (item.hidden) return null;

              const active = isActive(item.key);
              const IconComponent = iconMap[item.key] || FileText;
              const labelText = typeof item.label === 'string' ? (item.label as string) : undefined;

              const buttonEl = (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center' : 'gap-3'
                  } px-3 py-3 rounded-xl transition-all duration-300 group ${
                    active
                      ? 'bg-[#6ecefd] text-white shadow-lg shadow-primary-gradient/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  } overflow-hidden`}
                >
                  <IconComponent
                    size={20}
                    className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium text-left transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap flex items-center gap-2 ${
                      isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );

              return isCollapsed && labelText ? (
                <Tooltip placement='right' title={labelText} key={item.key}>
                  {buttonEl}
                </Tooltip>
              ) : (
                buttonEl
              );
            })}
        </nav>
      </div>

      {/* Bottom Navigation (Settings & Profile) */}
      <div className='border-t border-slate-700/50 p-3 space-y-1'>
        {roleMenuItems
          .filter(
            item => item.key === '/settings' || item.key === '/profile' || item.key === '/role-demo'
          )
          .map(item => {
            if (item.hidden) return null;

            const active = isActive(item.key);
            const IconComponent = iconMap[item.key] || FileText;
            const labelText = typeof item.label === 'string' ? (item.label as string) : undefined;

            const buttonEl = (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } px-3 py-3 rounded-xl transition-all duration-300 group ${
                  active
                    ? 'bg-[#6ecefd] text-white shadow-lg shadow-primary-gradient/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                } overflow-hidden`}
              >
                <IconComponent
                  size={20}
                  className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span
                  className={`text-sm font-medium text-left transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap flex items-center gap-2 ${
                    isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );

            return isCollapsed && labelText ? (
              <Tooltip placement='right' title={labelText} key={item.key}>
                {buttonEl}
              </Tooltip>
            ) : (
              buttonEl
            );
          })}
      </div>

      {/* Collapse Toggle */}
      <div className='absolute top-1/2 -translate-y-1/2 -right-3 z-20'>
        <Tooltip placement='right' title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <button
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='h-9 w-9 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110'
          >
            {isCollapsed ? (
              <ChevronRight size={18} className='transition-transform duration-500 ease-in-out' />
            ) : (
              <ChevronLeft size={18} className='transition-transform duration-500 ease-in-out' />
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}

export { ModernSidebar };
export default ModernSidebar;
