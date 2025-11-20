// Calendar hooks
export * from './calendar';

// Pet cases hooks
export * from './pet-cases';

// Reusable utility hooks
export { useFilterManagement, type FilterManagementConfig, type FilterState, type UseFilterManagementReturn } from './use-filter-management';
export { useTableManagement, type TableManagementConfig, type UseTableManagementReturn } from './use-table-management';

// Feature-specific hooks
export { useApiHealth } from './use-api-health';
export { useAppointments } from './use-appointments';
export { useAuth } from './use-auth';
export { useClinicContext, useClinicId, useIsClinicAdmin } from './use-clinic-context';
export { useClinicManagement } from './use-clinic-management';
export { useClinicStaff } from './use-clinic-staff';
export { useContacts } from './use-contacts';
export { useDashboard } from './use-dashboard';
export { useMessage } from './use-message';
export { useOperatingHours } from './use-operating-hours';
export { useDistinctAllergies, useDistinctMedications } from './use-pet-lookups';
export { usePetManagement } from './use-pet-management';
export { usePetOwners } from './use-pet-owners';
export { useReports } from './use-reports';
export { useReviews } from './use-reviews';
export { useSettings } from './use-settings';
export { useUserManagement } from './use-user-management';
export { useAuthInitialization } from './useAuthInitialization';

