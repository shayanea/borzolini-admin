import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from '@/components/layout/admin-layout';
import LoginForm from '@/components/auth/login-form';
import ProtectedRoute from '@/components/auth/protected-route';
import { ROUTES } from './constants';

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<LoginForm />} />

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
