import { initializeAuthListener, useAuthActions } from '@/stores/auth.store';
import { useCallback, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoginForm from '@/components/auth/login-form';
import ProtectedRoute from '@/components/auth/protected-route';
import AdminLayout from '@/components/layout/admin-layout';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from './constants';

const App = () => {
  const { isAuthenticated, user } = useAuth();
  const { clearError, handleAuthFailure } = useAuthActions();

  // Memoize the stale auth check to prevent infinite loops
  const checkStaleAuth = useCallback(() => {
    // If isAuthenticated is true but no user data exists, clear the auth state
    if (isAuthenticated && !user) {
      handleAuthFailure();
      return;
    }

    // Check if localStorage has valid auth data
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        // If localStorage says authenticated but no user data, clear it
        if (parsed.state?.isAuthenticated && !parsed.state?.user) {
          handleAuthFailure();
          return;
        }
      }
    } catch (error) {
      // If localStorage is corrupted, clear auth state
      handleAuthFailure();
      return;
    }
  }, [isAuthenticated, user, handleAuthFailure]);

  // Initialize auth listener and clear any stale state on mount
  useEffect(() => {
    initializeAuthListener();

    // Clear any stale error messages on app initialization
    clearError();

    // Run the check after a short delay to ensure all stores are initialized
    const timeoutId = window.setTimeout(checkStaleAuth, 100);

    return () => window.clearTimeout(timeoutId);
  }, [clearError, checkStaleAuth]);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginForm />}
      />

      {/* Protected admin routes */}
      <Route
        path='/*'
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for direct access to nested routes */}
      <Route path='*' element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default App;
