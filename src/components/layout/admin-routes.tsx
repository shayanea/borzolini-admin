import {
	Analytics,
	ApiHealth,
	AppointmentFormPage,
	Appointments,
	Breeds,
	Calendar,
	ClinicForm,
	Clinics,
	Contacts,
	Dashboard,
	HouseholdSafety,
	PetCases,
	PetFormPage,
	Pets,
	Profile,
	Reports,
	Resources,
	Reviews,
	RoleDemo,
	Settings,
	Staff,
	Training,
	UserFormPage,
	Users,
} from '@/pages';
import { Route, Routes } from 'react-router-dom';

import { UserRole } from '@/types';
import RoleProtectedRoute from '../auth/role-protected-route';

const VETERINARIAN_ROLE_FILTER = 'veterinarian' as const;
const PATIENT_ROLE_FILTER: UserRole = 'patient';

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
				path='analytics'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<Analytics />
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
				path='appointments/create'
				element={
					<RoleProtectedRoute>
						<AppointmentFormPage />
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
				path='patients'
				element={
					<RoleProtectedRoute>
						<Users roleFilter={PATIENT_ROLE_FILTER} />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='staff'
				element={
					<RoleProtectedRoute>
						<Staff />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='users/create'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<UserFormPage />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='users/edit/:id'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<UserFormPage />
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
				path='pets/create'
				element={
					<RoleProtectedRoute>
						<PetFormPage />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='pets/edit/:id'
				element={
					<RoleProtectedRoute>
						<PetFormPage />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='reports'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<Reports />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='reviews'
				element={
					<RoleProtectedRoute requiredRole='admin'>
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
				path='admin/resources'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<Resources />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='admin/training'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<Training />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='admin/household-safety'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<HouseholdSafety />
					</RoleProtectedRoute>
				}
			/>
			<Route
				path='admin/breeds'
				element={
					<RoleProtectedRoute requiredRole='admin'>
						<Breeds />
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

export { AdminRoutes };
export default AdminRoutes;
