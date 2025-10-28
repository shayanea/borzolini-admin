import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ClinicsService } from '@/services/clinics.service';
import type { ClinicStaff, User } from '@/types';
import { useClinicContext } from '@/hooks/use-clinic-context';

export interface ClinicStaffWithUser extends ClinicStaff {
  user?: User | null;
}

interface ClinicStaffResponse {
  staff: ClinicStaffWithUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseClinicStaffOptions {
  clinicId?: string;
  enabled?: boolean;
}

export function useClinicStaff(
  options: UseClinicStaffOptions = {},
  queryOptions?: UseQueryOptions<
    ClinicStaffResponse,
    unknown,
    ClinicStaffResponse,
    [string, string | undefined]
  >
) {
  const { clinicContext } = useClinicContext();
  const effectiveClinicId = options.clinicId ?? clinicContext?.clinicId;

  return useQuery({
    queryKey: ['clinic-staff', effectiveClinicId],
    queryFn: () => {
      if (!effectiveClinicId) throw new Error('Clinic ID is required to fetch staff');
      return ClinicsService.getClinicStaff(effectiveClinicId) as Promise<ClinicStaffResponse>;
    },
    enabled: Boolean(effectiveClinicId) && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...(queryOptions as object),
  });
}


