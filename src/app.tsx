import { ClinicRegister, ClinicRegisterSuccess } from './pages';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { offAuthRedirect, onAuthRedirect } from '@/services/event-emitter.service';

import LoginForm from '@/components/auth/login-form';
import ModernAdminLayout from '@/components/layout/modern-admin-layout';
import ProtectedRoute from '@/components/auth/protected-route';
import { ROUTES } from './constants';
import { useEffect } from 'react';

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
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<LoginForm />} />
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
  );
};

export default App;
