import { Button, Result, Spin } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';

import { AuthBackground } from '@/components/common';
import { ROUTES } from '@/constants';
import { useCurrentUser } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'veterinarian' | 'staff' | 'patient';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
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
      <AuthBackground variant='gradient'>
        <div className='text-center'>
          <Spin size='large' className='mb-4' />
          <div className='text-white text-lg'>Validating authentication...</div>
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
      <AuthBackground variant='gradient'>
        <Result
          status='403'
          title='Access Denied'
          subTitle="You don't have permission to access this page."
          extra={[
            <Button type='primary' key='dashboard' onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>,
            <Button key='logout' onClick={handleLogout}>
              Logout
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
