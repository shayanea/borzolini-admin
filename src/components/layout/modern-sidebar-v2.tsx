import {
  Activity,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const menuItemsConfig = [
  {
    labelKey: 'sidebar.dashboard',
    key: 'dashboard',
    icon: LayoutDashboard,
    href: ROUTES.DASHBOARD,
  },
  {
    labelKey: 'sidebar.appointments',
    key: 'appointments',
    icon: Calendar,
    href: ROUTES.APPOINTMENTS,
  },
  { labelKey: 'sidebar.patients', key: 'patients', icon: Users, href: ROUTES.PETS },
  { labelKey: 'sidebar.petCases', key: 'pet-cases', icon: Stethoscope, href: ROUTES.PET_CASES },
  { labelKey: 'sidebar.clinics', key: 'clinics', icon: Building2, href: ROUTES.CLINICS },
  { labelKey: 'sidebar.reports', key: 'reports', icon: FileText, href: ROUTES.REPORTS },
  { labelKey: 'sidebar.reviews', key: 'reviews', icon: MessageSquare, href: ROUTES.REVIEWS },
];

const quickLinksConfig = [
  { labelKey: 'sidebar.analytics', key: 'analytics', icon: Activity, href: ROUTES.DASHBOARD },
  { labelKey: 'sidebar.trends', key: 'trends', icon: TrendingUp, href: ROUTES.REPORTS },
];

interface ModernSidebarV2Props {
  collapsed?: boolean;
}

const ModernSidebarV2: React.FC<ModernSidebarV2Props> = () => {
  const { t } = useTranslation(['components', 'common']);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
          {isCollapsed ? (
            <div className='w-full flex items-center justify-center'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/30'>
                <span className='text-white font-bold text-lg'>B</span>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/30'>
                <span className='text-white font-bold text-lg'>B</span>
              </div>
              <div>
                <span className='font-bold text-xl text-white block'>Borzolini</span>
                <span className='text-xs text-slate-400 font-medium'>Veterinary Clinic</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Menu Content */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden'>
        {/* Main Navigation */}
        <nav className='p-3 space-y-1'>
          {menuItemsConfig.map(item => {
            const active = isActive(item.href);
            const label = t(`components:${item.labelKey}`);
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                title={isCollapsed ? label : ''}
              >
                <item.icon
                  size={20}
                  className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                    active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && (
                  <span className='text-sm font-medium flex-1 text-left'>{label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Links Section */}
        {!isCollapsed && (
          <div className='p-3 pt-6'>
            <div className='px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider'>
              {t('components:sidebar.quickAccess')}
            </div>
            <div className='space-y-1 mt-2'>
              {quickLinksConfig.map(item => {
                const active = isActive(item.href);
                const label = t(`components:${item.labelKey}`);
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-slate-800 text-cyan-400'
                        : 'text-slate-500 hover:bg-slate-800/30 hover:text-slate-300'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Settings & Collapse Button */}
      <div className='p-3 border-t border-slate-700/50 space-y-1'>
        <button
          onClick={() => handleNavClick(ROUTES.SETTINGS)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive(ROUTES.SETTINGS)
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          }`}
          title={isCollapsed ? t('components:sidebar.settings') : ''}
        >
          <Settings size={18} className='flex-shrink-0' />
          {!isCollapsed && <span>{t('components:sidebar.settings')}</span>}
        </button>

        {/* Collapse Toggle */}
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

export default ModernSidebarV2;
