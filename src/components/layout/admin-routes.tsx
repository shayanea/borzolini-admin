import { Route, Routes } from 'react-router-dom';

import {
  ApiHealth,
  Appointments,
  Calendar,
  ClinicForm,
  Clinics,
  Contacts,
  Dashboard,
  PetCases,
  Pets,
  Profile,
  Reports,
  Reviews,
  RoleDemo,
  Settings,
  Users,
} from '@/pages';
import RoleProtectedRoute from '../auth/role-protected-route';

const VETERINARIAN_ROLE_FILTER = 'veterinarian' as const;

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path='dashboard'
        element={
          <RoleProtectedRoute>
            <Dashboard />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='calendar'
        element={
          <RoleProtectedRoute>
            <Calendar />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='appointments'
        element={
          <RoleProtectedRoute>
            <Appointments />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='clinics'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <Clinics />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='clinics/create'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <ClinicForm />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='clinics/edit/:id'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <ClinicForm />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='users'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <Users />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='veterinarians'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <Users roleFilter={VETERINARIAN_ROLE_FILTER} />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='pet-cases'
        element={
          <RoleProtectedRoute>
            <PetCases />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='pets'
        element={
          <RoleProtectedRoute>
            <Pets />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='reports'
        element={
          <RoleProtectedRoute>
            <Reports />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='reviews'
        element={
          <RoleProtectedRoute>
            <Reviews />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='settings'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <Settings />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='profile'
        element={
          <RoleProtectedRoute>
            <Profile />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='contacts'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <Contacts />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='api-health'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <ApiHealth />
          </RoleProtectedRoute>
        }
      />
      <Route
        path='role-demo'
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <RoleDemo />
          </RoleProtectedRoute>
        }
      />
      <Route
        path=''
        element={
          <RoleProtectedRoute requiredRole='admin'>
            <Settings />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
