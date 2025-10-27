import {
  BarChart,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Monitor,
  PawPrint,
  Settings as SettingsIcon,
  Stethoscope,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  '/pets': PawPrint,
  '/pet-cases': Stethoscope,
  '/reports': BarChart,
  '/reviews': MessageSquare,
  '/contacts': Mail,
  '/api-health': Monitor,
  '/role-demo': FlaskConical,
  '/settings': SettingsIcon,
};

interface ModernSidebarProps {
  collapsed?: boolean;
}

const ModernSidebar: React.FC<ModernSidebarProps> = () => {
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(true);
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
        isCollapsed ? 'w-20' : 'w-72'
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 ease-out shadow-xl flex flex-col overflow-hidden`}
    >
      {/* Logo Section */}
      <div className='p-6 border-b border-slate-700/50 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10' />
        <div className='relative flex items-center justify-between'>
          <div className={`flex items-center ${isCollapsed ? 'w-full justify-center' : 'gap-3'}`}>
            <div className='min-w-12 w-12 h-12 rounded-xl bg-[#38a3a5] flex items-center justify-center shadow-lg shadow-[#38a3a5]/30'>
              <span className='text-white font-bold text-lg'>B</span>
            </div>
            <div>
              <span
                className={`font-bold text-xl text-white block whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}
              >
                Borzolini
              </span>
              <span
                className={`text-xs text-slate-400 font-medium whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}
              >
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
          {roleMenuItems.map(item => {
            if (item.hidden) return null;

            const active = isActive(item.key);
            const IconComponent = iconMap[item.key] || FileText;

            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } px-3 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                title={isCollapsed && typeof item.label === 'string' ? (item.label as string) : ''}
              >
                <IconComponent
                  size={20}
                  className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                    active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span
                  className={`text-sm font-medium flex-1 text-left whitespace-nowrap ${isCollapsed ? 'w-0 hidden' : 'w-auto'}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle */}
      <div className='p-3 border-t border-slate-700/50'>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='w-full flex items-center justify-center px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all group'
        >
          {isCollapsed ? (
            <ChevronRight size={18} className='group-hover:scale-110 transition-transform' />
          ) : (
            <ChevronLeft size={18} className='group-hover:scale-110 transition-transform' />
          )}
        </button>
      </div>
    </aside>
  );
};

export default ModernSidebar;
