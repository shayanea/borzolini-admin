import { Navigate, Route, Routes } from 'react-router-dom';

import LoginForm from '@/components/auth/login-form';
import ProtectedRoute from '@/components/auth/protected-route';
import AdminLayout from '@/components/layout/admin-layout';
import { ROUTES } from './constants';
import { ClinicRegister, ClinicRegisterSuccess } from './pages';

const App = () => {
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
