import { Button, Result, Spin } from 'antd';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  emitAuthUnauthorized,
  offAuthUnauthorized,
  onAuthUnauthorized,
  onAuthRedirect,
  offAuthRedirect,
} from '@/services/event-emitter.service';
import { useAuth, useAuthStatus } from '@/hooks/use-auth';

import { AuthService } from '@/services/auth.service';
import { ROUTES } from '@/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'veterinarian' | 'staff' | 'patient';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isLoading: isCheckingAuth } = useAuthStatus();
  const [isValidating, setIsValidating] = useState(false);
  const hasValidatedRef = useRef(false);

  const handleGoToDashboard = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Only validate auth once when user appears to be authenticated
  useEffect(() => {
    // Prevent multiple validations
    if (hasValidatedRef.current || !isAuthenticated) {
      return;
    }

    const validateAuth = async () => {
      setIsValidating(true);
      hasValidatedRef.current = true;

      try {
        // Try to get auth status from server
        const status = await AuthService.getAuthStatus();
        if (!status.isAuthenticated) {
          // User is not authenticated on server, emit auth failure event
          // instead of calling logout directly to prevent infinite loops
          emitAuthUnauthorized();
        }
      } catch (error) {
        // Auth check failed, emit auth failure event
        emitAuthUnauthorized();
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [isAuthenticated]); // Remove logout from dependencies

  // Listen for authentication failure events
  useEffect(() => {
    const handleAuthFailure = () => {
      console.log('ProtectedRoute: Received auth unauthorized event');
      // Clear any local auth state and redirect to login
      navigate(ROUTES.LOGIN, { state: { from: location }, replace: true });
    };

    const handleAuthRedirect = (data: { path: string }) => {
      console.log('ProtectedRoute: Received auth redirect event to:', data.path);
      // Handle redirect events from auth store
      navigate(data.path, { state: { from: location }, replace: true });
    };

    // Subscribe to auth events
    onAuthUnauthorized(handleAuthFailure);
    onAuthRedirect(handleAuthRedirect);

    return () => {
      // Cleanup event listeners
      offAuthUnauthorized(handleAuthFailure);
      offAuthRedirect(handleAuthRedirect);
    };
  }, [navigate, location]);

  // If user is not authenticated, redirect to login immediately
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Show loading while validating authenticated user
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
