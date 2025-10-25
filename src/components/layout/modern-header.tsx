import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface ModernHeaderProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  userName = 'Dr. Sarah',
  userRole = 'Clinic Manager',
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    if (onLogout) {
      onLogout();
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Side - Welcome Message */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {userName}!</h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}{' '}
            • Ready to help your patients
          </p>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group">
            <Bell size={20} className="text-slate-600 group-hover:text-slate-900" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
              3
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200" />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {userName.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-lg z-50">
                <div className="p-4 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">{userName}</p>
                  <p className="text-xs text-slate-500">{userRole}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                    <User size={16} />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                    <Settings size={16} />
                    Settings
                  </button>
                  <div className="h-px bg-slate-200 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-red-600 text-sm font-medium transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
