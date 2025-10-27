import { useCurrentUser } from '@/hooks/use-auth';
import { useMemo } from 'react';

/**
 * Hook to get clinic context for clinic_admin and staff users
 * Returns the user's clinic ID and related information
 */
export function useClinicContext() {
  const { data: user, isLoading } = useCurrentUser();

  const clinicContext = useMemo(() => {
    if (!user) {
      console.log('🔍 ClinicContext: No user data');
      return null;
    }

    // Get clinic ID from user object (support multiple field names)
    const clinicId = user.clinicId || user.clinic_id || user.clinic?.id;
    const clinicName = user.clinic?.name;

    const context = {
      clinicId,
      clinicName,
      userRole: user.role,
      isClinicAdmin: user.role === 'clinic_admin',
      // For clinic_admin, they should only access their clinic's data
      shouldFilterByClinic: user.role === 'clinic_admin',
    };

    console.log('🔍 ClinicContext:', {
      userRole: user.role,
      clinicId,
      clinicName,
      isClinicAdmin: context.isClinicAdmin,
      shouldFilterByClinic: context.shouldFilterByClinic,
      userClinicId: user.clinicId,
      userClinic_id: user.clinic_id,
      userClinic: user.clinic,
    });

    return context;
  }, [user]);

  return {
    clinicContext,
    isLoading,
    user,
  };
}

/**
 * Hook to get clinic ID for data filtering
 */
export function useClinicId(): string | undefined {
  const { clinicContext } = useClinicContext();
  return clinicContext?.clinicId;
}

/**
 * Hook to check if current user is a clinic admin
 */
export function useIsClinicAdmin(): boolean {
  const { clinicContext } = useClinicContext();
  return clinicContext?.isClinicAdmin || false;
}
