// Responsive authentication background component
import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'gradient' | 'pattern' | 'modern' | 'geometric' | 'animated';
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const getBackgroundClasses = () => {
    const baseClasses = 'min-h-screen flex items-center justify-center p-4';

    switch (variant) {
      case 'minimal':
        return `${baseClasses} bg-gray-50`;
      case 'gradient':
        return `${baseClasses} bg-[#023e8a]`;
      case 'pattern':
        return `${baseClasses} bg-[#023e8a] relative overflow-hidden`;
      case 'modern':
        return `${baseClasses} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden`;
      case 'geometric':
        return `${baseClasses} bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden`;
      case 'animated':
        return `${baseClasses} bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden`;
      default:
        return `${baseClasses} bg-[#023e8a]`;
    }
  };

  const getPatternOverlay = () => {
    if (variant === 'pattern') {
      const patternUrl =
        "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
      return (
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0 bg-repeat'
            style={{ backgroundImage: `url(${patternUrl})` }}
          ></div>
        </div>
      );
    }
    return null;
  };

  const getModernOverlay = () => {
    switch (variant) {
      case 'modern':
        return (
          <>
            {/* Floating geometric shapes */}
            <div className='absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse'></div>
            <div className='absolute top-40 right-32 w-24 h-24 bg-purple-400/10 rounded-full blur-lg animate-bounce'></div>
            <div className='absolute bottom-32 left-40 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl animate-pulse'></div>
            <div className='absolute bottom-20 right-20 w-28 h-28 bg-indigo-400/10 rounded-full blur-xl animate-bounce'></div>

            {/* Grid pattern */}
            <div className='absolute inset-0 opacity-5'>
              <div
                className='absolute inset-0 bg-repeat'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v1H0V0zm0 0v40h1V0H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
          </>
        );

      case 'geometric':
        return (
          <>
            {/* Geometric shapes */}
            <div className='absolute top-16 left-16 w-20 h-20 bg-white/10 rotate-45 animate-spin'></div>
            <div className='absolute top-32 right-24 w-16 h-16 bg-purple-400/20 rounded-full animate-pulse'></div>
            <div className='absolute bottom-24 left-32 w-24 h-24 bg-pink-400/10 rotate-12 animate-bounce'></div>
            <div className='absolute bottom-16 right-16 w-12 h-12 bg-indigo-400/15 animate-pulse'></div>

            {/* Hexagonal pattern */}
            <div className='absolute inset-0 opacity-5'>
              <div
                className='absolute inset-0 bg-repeat'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30,5 50,20 50,40 30,55 10,40 10,20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
          </>
        );

      case 'animated':
        return (
          <>
            {/* Animated gradient orbs */}
            <div className='absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse'></div>
            <div className='absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-bounce'></div>
            <div className='absolute bottom-20 left-32 w-36 h-36 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse'></div>
            <div className='absolute bottom-32 right-32 w-28 h-28 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-lg animate-bounce'></div>

            {/* Subtle wave pattern */}
            <div className='absolute inset-0 opacity-5'>
              <div
                className='absolute inset-0 bg-repeat'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h80v2H0V0zm0 0v80h2V0H0zm0 0h80v80H0V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${getBackgroundClasses()} ${className}`}>
      {getPatternOverlay()}
      {getModernOverlay()}
      <div className='relative z-10 w-full max-w-md'>{children}</div>
    </div>
  );
};

export default AuthBackground;
