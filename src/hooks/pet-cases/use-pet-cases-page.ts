import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCurrentUser } from '@/hooks/auth';
import { usePetCasesState } from './use-pet-cases-state';
import { usePetCasesModals } from './use-pet-cases-modals';
import { usePetCases, useAllPetCases } from './use-pet-cases';
import { User } from '@/types';
import { CaseStats, ClinicPetCase } from '@/types/pet-cases';

interface UsePetCasesPageReturn {
  user: User | undefined;
  userLoading: boolean;
  clinicId?: string;
  isAdmin: boolean;
  shouldFetchAllCases: boolean;
  state: ReturnType<typeof usePetCasesState>;
  modals: ReturnType<typeof usePetCasesModals>;
  result: {
    cases: ClinicPetCase[];
    total: number;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: any;
  };
  stats?: CaseStats;
  defaultStats: CaseStats & { [key: string]: any };
  handleRefresh: () => void;
}

export const usePetCasesPage = (): UsePetCasesPageReturn => {
  const [searchParams] = useSearchParams();
  const { data: user, isLoading: userLoading } = useCurrentUser() as {
    data: User;
    isLoading: boolean;
  };

  const urlClinicId = searchParams.get('clinicId');
  const clinicId: string | undefined =
    urlClinicId || (user as any)?.clinicId || (user as any)?.clinic_id || (user as any)?.clinic?.id;

  const state = usePetCasesState({ clinicId });
  const modals = usePetCasesModals();

  const isAdmin = (user as any)?.role === 'admin';
  const shouldFetchAllCases = isAdmin && !clinicId;

  const clinicCasesResult = usePetCases(clinicId || '', state.filters, state.page, 10);
  const allCasesResult = useAllPetCases(state.filters, state.page, 10, clinicId ? false : true);

  const resultSource = shouldFetchAllCases ? allCasesResult : clinicCasesResult;
  const { cases, total, page: currentPage, totalPages, isLoading, error, refetch } = resultSource;

  const stats = shouldFetchAllCases ? undefined : clinicCasesResult.stats;

  const defaultStats: CaseStats & { [key: string]: any } = {
    total: 0,
    byStatus: {
      open: 0,
      in_progress: 0,
      pending_consultation: 0,
      pending_visit: 0,
      under_observation: 0,
      resolved: 0,
      closed: 0,
      escalated: 0,
    },
    byPriority: { low: 0, normal: 0, high: 0, urgent: 0, emergency: 0 },
    byType: {
      consultation: 0,
      follow_up: 0,
      emergency: 0,
      preventive: 0,
      chronic_condition: 0,
      post_surgery: 0,
      behavioral: 0,
      nutritional: 0,
    },
    urgent: 0,
    resolved: 0,
    averageResolutionTime: 0,
  } as any;

  const handleRefresh = () => {
    refetch();
    state.handleRefresh();
  };

  useEffect(() => {
    const isNotValid = !userLoading && !clinicId && !isAdmin;
    if (isNotValid) {
      console.error('No clinic ID provided and user is not admin');
    }
  }, [clinicId, userLoading, isAdmin]);

  return {
    user,
    userLoading,
    clinicId,
    isAdmin,
    shouldFetchAllCases,
    state,
    modals,
    result: { cases, total, currentPage, totalPages, isLoading, error },
    stats,
    defaultStats,
    handleRefresh,
  };
};
