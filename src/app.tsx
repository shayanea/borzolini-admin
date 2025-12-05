import { ClinicRegister, ClinicRegisterSuccess, LoginPage } from '@/pages';
import { offAuthRedirect, onAuthRedirect } from '@/services/core';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import ProtectedRoute from '@/components/auth/protected-route';
import { ErrorBoundary } from '@/components/common/error-boundary';
import ModernAdminLayout from '@/components/layout/modern-admin-layout';
import { useEffect } from 'react';
import { ROUTES } from './constants';

const App = () => {
  const navigate = useNavigate();

  // Listen for global auth redirect events (e.g., after logout)
  useEffect(() => {
    const handler = ({ path }: { path: string }) => {
      navigate(path, { replace: true });
    };

    onAuthRedirect(handler);
    return () => {
      offAuthRedirect(handler);
    };
  }, [navigate]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.CLINIC_REGISTER} element={<ClinicRegister />} />
        <Route path={ROUTES.CLINIC_REGISTER_SUCCESS} element={<ClinicRegisterSuccess />} />

        {/* Protected admin routes */}
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <ModernAdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for direct access to nested routes */}
        <Route path='*' element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export { App };
export default App;

