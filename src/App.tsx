import { Navigate, Route, Routes } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { initializeAuthListener, useAuthActions } from '@/stores/auth.store';

import AdminLayout from '@/components/layout/AdminLayout';
import LoginForm from '@/components/auth/LoginForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

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
        path='/login'
        element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <LoginForm />}
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
    </Routes>
  );
};

export default App;
