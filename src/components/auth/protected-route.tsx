import { Button, Result, Spin } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';

import { AuthBackground } from '@/components/common';
import { ROUTES } from '@/constants';
import { useCurrentUser } from '@/hooks/use-auth';
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
      <AuthBackground variant='default'>
        <div className='text-center'>
          <Spin size='large' className='mb-4' />
          <div className='text-white text-lg'>{t('auth.validatingAuth')}</div>
        </div>
      </AuthBackground>
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

export default ProtectedRoute;
