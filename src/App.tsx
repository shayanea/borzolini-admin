import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth, useAuthStatus } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isLoading: isCheckingAuth } = useAuthStatus();

  // Check authentication status on mount
  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      // Try to get auth status from the server
      // This will be handled by the ProtectedRoute component
    }
  }, [isAuthenticated, isCheckingAuth]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-primary-dark">
        <div className="text-center">
          <Spin size="large" className="mb-4" />
          <div className="text-white text-lg">Checking authentication...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginForm />
          )
        }
      />

      {/* Protected admin routes */}
      <Route
        path="/*"
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
