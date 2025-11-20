// Role-based route protection component
import { Button, Result } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';

import { AuthBackground } from '@/components/common';
import { ROUTES } from '@/constants';
import { UserRole } from '@/types';
import { getAccessibleRoutes } from '@/constants/menu-permissions';
import { useCurrentUser } from '@/hooks/use-auth';
import { useTranslation } from 'react-i18next';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackRoute?: string;
}

const RoleProtectedRoute = ({
  children,
  requiredRole,
  fallbackRoute = ROUTES.APPOINTMENTS,
}: RoleProtectedRouteProps) => {
  const { t } = useTranslation('components');
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useCurrentUser();

  const handleGoToDashboard = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  const handleGoToFallback = useCallback(() => {
    navigate(fallbackRoute);
  }, [navigate, fallbackRoute]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <AuthBackground variant='default'>
        <div className='text-center'>
          <div className='text-white text-lg'>{t('auth.validatingAccess')}</div>
        </div>
      </AuthBackground>
    );
  }

  // Redirect unauthenticated users to login
  if (error || !user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const userRole = user.role as UserRole;
  const accessibleRoutes = getAccessibleRoutes(userRole);
  const currentPath = location.pathname;

  // Check if user has access to current route
  // Handle dynamic routes by checking if current path starts with any accessible route pattern
  const hasAccess = accessibleRoutes.some(route =>
    route.endsWith('/') ? currentPath.startsWith(route) : currentPath === route
  );

  // Check specific role requirement if specified
  // clinic_admin should not have access to admin-only routes
  if (requiredRole && userRole !== requiredRole) {
    // Special case: clinic_admin should be able to access some pages but not admin-specific ones
    const isClinicAdminTryingToAccessAdminRoute =
      userRole === 'clinic_admin' && requiredRole === 'admin';
    if (isClinicAdminTryingToAccessAdminRoute) {
      return (
        <AuthBackground variant='default'>
          <Result
            status='403'
            title={t('auth.accessDenied')}
            subTitle={'You do not have permission to access this section'}
            extra={[
              <Button type='primary' key='dashboard' onClick={handleGoToDashboard}>
                {t('auth.goToDashboard')}
              </Button>,
              <Button key='fallback' onClick={handleGoToFallback}>
                {t('auth.goToFallback')}
              </Button>,
            ]}
          />
        </AuthBackground>
      );
    }
    return (
      <AuthBackground variant='default'>
        <Result
          status='403'
          title={t('auth.accessDenied')}
          subTitle={t('auth.roleRequired', { role: requiredRole, userRole })}
          extra={[
            <Button type='primary' key='dashboard' onClick={handleGoToDashboard}>
              {t('auth.goToDashboard')}
            </Button>,
            <Button key='fallback' onClick={handleGoToFallback}>
              {t('auth.goToFallback')}
            </Button>,
          ]}
        />
      </AuthBackground>
    );
  }

  // Check if user has access to the current route based on their role
  if (!hasAccess) {
    // For non-admin users trying to access admin routes, redirect to appointments
    const isNotValid =
      userRole !== 'admin' && (currentPath === '/dashboard' || currentPath === '/settings');
    if (isNotValid) {
      return <Navigate to={ROUTES.APPOINTMENTS} replace />;
    }

    return (
      <AuthBackground variant='default'>
        <Result
          status='403'
          title={t('auth.accessDenied')}
          subTitle={t('auth.noPermissionRole', { role: userRole })}
          extra={[
            <Button type='primary' key='dashboard' onClick={handleGoToDashboard}>
              {t('auth.goToDashboard')}
            </Button>,
            <Button key='fallback' onClick={handleGoToFallback}>
              {t('auth.goToFallback')}
            </Button>,
          ]}
        />
      </AuthBackground>
    );
  }

  // User has access, render children
  return <>{children}</>;
};

export { RoleProtectedRoute };
export default RoleProtectedRoute;
