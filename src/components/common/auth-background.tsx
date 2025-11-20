// Responsive authentication background component
import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'pattern';
}

function AuthBackground({
  children,
  className = '',
  variant = 'default',
}: AuthBackgroundProps) {
  const getBackgroundClasses = () => {
    const baseClasses = 'min-h-screen flex items-center justify-center p-4';

    switch (variant) {
      case 'minimal':
        return `${baseClasses} bg-gray-50`;
      case 'pattern':
        return `${baseClasses} bg-[#023e8a] relative overflow-hidden`;
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
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${getBackgroundClasses()} ${className}`}>
      {getPatternOverlay()}
      <div className='relative z-10 w-full max-w-md'>{children}</div>
    </div>
  );
}

export { AuthBackground };
export default AuthBackground;
