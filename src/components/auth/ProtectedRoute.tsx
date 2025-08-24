import { Button, Result, Spin } from 'antd';
import { Navigate, useLocation } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth, useAuthStatus } from '@/hooks/useAuth';

import { AuthService } from '@/services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'veterinarian' | 'staff' | 'patient';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { isLoading: isCheckingAuth } = useAuthStatus();
  const [isValidating, setIsValidating] = useState(true);

  const handleGoToDashboard = useCallback(() => {
    window.location.href = '/dashboard';
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    const validateAuth = async () => {
      if (!isAuthenticated) {
        try {
          // Try to get auth status from server
          const status = await AuthService.getAuthStatus();
          if (status.isAuthenticated) {
            // User is authenticated on server, update local state
            // This would typically be handled by a refresh token mechanism
            // For now, we'll redirect to login
            setIsValidating(false);
          } else {
            setIsValidating(false);
          }
        } catch (error) {
          // Auth check failed, user needs to login
          setIsValidating(false);
        }
      } else {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [isAuthenticated]);

  // Show loading while validating
  if (isValidating || isCheckingAuth) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-primary-dark'>
        <div className='text-center'>
          <Spin size='large' className='mb-4' />
          <div className='text-white text-lg'>Validating authentication...</div>
        </div>
      </div>
    );
  }

  // User not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  const isAdmin = requiredRole && user && user.role === 'admin';
  if (isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-primary-dark p-4'>
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
      </div>
    );
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
