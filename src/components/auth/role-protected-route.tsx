// Role-based route protection component
import { Button, Result } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';

import { AuthBackground } from '@/components/common';
import { ROUTES } from '@/constants';
import { UserRole } from '@/types';
import { getAccessibleRoutes } from '@/constants/menu-permissions';
import { useCurrentUser } from '@/hooks/use-auth';

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
      <AuthBackground variant='gradient'>
        <div className='text-center'>
          <div className='text-white text-lg'>Validating access...</div>
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
  const hasAccess = accessibleRoutes.includes(currentPath);

  // Check specific role requirement if specified
  if (requiredRole && userRole !== requiredRole) {
    return (
      <AuthBackground variant='gradient'>
        <Result
          status='403'
          title='Access Denied'
          subTitle={`This page requires ${requiredRole} role. Your role: ${userRole}`}
          extra={[
            <Button type='primary' key='dashboard' onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>,
            <Button key='fallback' onClick={handleGoToFallback}>
              Go to Fallback
            </Button>,
          ]}
        />
      </AuthBackground>
    );
  }

  // Check if user has access to the current route based on their role
  if (!hasAccess) {
    // For non-admin users trying to access admin routes, redirect to appointments
    if (userRole !== 'admin' && (currentPath === '/dashboard' || currentPath === '/settings')) {
      return <Navigate to={ROUTES.APPOINTMENTS} replace />;
    }

    // For admin users trying to access dashboard, redirect to settings
    if (userRole === 'admin' && currentPath === '/dashboard') {
      return <Navigate to={ROUTES.SETTINGS} replace />;
    }

    return (
      <AuthBackground variant='gradient'>
        <Result
          status='403'
          title='Access Denied'
          subTitle={`You don't have permission to access this page with your current role (${userRole}).`}
          extra={[
            <Button type='primary' key='dashboard' onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>,
            <Button key='fallback' onClick={handleGoToFallback}>
              Go to Fallback
            </Button>,
          ]}
        />
      </AuthBackground>
    );
  }

  // User has access, render children
  return <>{children}</>;
};

export default RoleProtectedRoute;
