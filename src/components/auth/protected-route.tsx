import { Button, Result, Spin } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';

import { AuthBackground } from '@/components/common';
import BG from '@/ui/icons/auth-bg.svg';
import { ROUTES } from '@/constants';
import { useCurrentUser } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'veterinarian' | 'staff' | 'patient';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { t } = useTranslation('components');
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useCurrentUser();

  const handleGoToDashboard = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    // Clear user data and redirect to login
    navigate(ROUTES.LOGIN, { state: { from: location }, replace: true });
  }, [navigate, location]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        className='min-h-screen flex items-center justify-center p-4 w-full bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${BG})` }}
      >
        <div className='text-center bg-white/50 backdrop-blur-sm p-8 rounded-lg'>
          <Spin size='default' className='mb-4' />
          <div className='text-black text-base'>{t('auth.validatingAuth')}</div>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (error || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRole && user.role !== requiredRole) {
    return (
      <AuthBackground variant='default'>
        <Result
          status='403'
          title={t('auth.accessDenied')}
          subTitle={t('auth.noPermission')}
          extra={[
            <Button type='primary' key='dashboard' onClick={handleGoToDashboard}>
              {t('auth.goToDashboard')}
            </Button>,
            <Button key='logout' onClick={handleLogout}>
              {t('header.logout')}
            </Button>,
          ]}
        />
      </AuthBackground>
    );
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
};

export { ProtectedRoute };
export default ProtectedRoute;
