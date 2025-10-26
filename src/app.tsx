import { ClinicRegister, ClinicRegisterSuccess } from './pages';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoginForm from '@/components/auth/login-form';
import ModernAdminLayoutV2 from '@/components/layout/modern-admin-layout-v2';
import ProtectedRoute from '@/components/auth/protected-route';
import { ROUTES } from './constants';

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
            <ModernAdminLayoutV2 />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for direct access to nested routes */}
      <Route path='*' element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default App;
