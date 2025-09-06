import {
  AddTimelineEventRequest,
  CaseFilters,
  CaseStats,
  ClinicPetCase,
  CreatePetCaseRequest,
  PetCasesResponse,
  UpdatePetCaseRequest,
} from '../types/pet-cases';
// Hook for Pet Cases Management
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PetCasesService } from '../services/pet-cases.service';
import { useMessage } from './use-message';

export const usePetCases = (
  clinicId: string,
  filters: CaseFilters = {},
  page: number = 1,
  limit: number = 10
) => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useMessage();

  // Query for fetching cases
  const {
    data: casesData,
    isLoading,
    error,
    refetch,
  } = useQuery<PetCasesResponse>({
    queryKey: ['pet-cases', clinicId, filters, page, limit],
    queryFn: () => PetCasesService.getCasesByClinic(clinicId, filters, page, limit),
    enabled: !!clinicId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for case statistics
  const { data: statsData, isLoading: statsLoading } = useQuery<CaseStats>({
    queryKey: ['pet-cases-stats', clinicId],
    queryFn: () => PetCasesService.getCaseStats(clinicId),
    enabled: !!clinicId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for creating a case
  const createCaseMutation = useMutation({
    mutationFn: (caseData: CreatePetCaseRequest) => PetCasesService.createCase(clinicId, caseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet-cases', clinicId] });
      queryClient.invalidateQueries({ queryKey: ['pet-cases-stats', clinicId] });
      success('Pet case created successfully');
    },
    onError: (error: any) => {
      showError(`Failed to create case: ${error.message}`);
    },
  });

  // Mutation for updating a case
  const updateCaseMutation = useMutation({
    mutationFn: ({ caseId, updateData }: { caseId: string; updateData: UpdatePetCaseRequest }) =>
      PetCasesService.updateCase(clinicId, caseId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet-cases', clinicId] });
      queryClient.invalidateQueries({ queryKey: ['pet-cases-stats', clinicId] });
      success('Pet case updated successfully');
    },
    onError: (error: any) => {
      showError(`Failed to update case: ${error.message}`);
    },
  });

  // Mutation for adding timeline event
  const addTimelineEventMutation = useMutation({
    mutationFn: ({ caseId, eventData }: { caseId: string; eventData: AddTimelineEventRequest }) =>
      PetCasesService.addTimelineEvent(clinicId, caseId, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet-cases', clinicId] });
      success('Timeline event added successfully');
    },
    onError: (error: any) => {
      showError(`Failed to add timeline event: ${error.message}`);
    },
  });

  return {
    // Data
    cases: casesData?.cases || [],
    total: casesData?.total || 0,
    page: casesData?.page || 1,
    totalPages: casesData?.totalPages || 1,
    stats: statsData,

    // Loading states
    isLoading,
    statsLoading,
    isCreating: createCaseMutation.isPending,
    isUpdating: updateCaseMutation.isPending,
    isAddingEvent: addTimelineEventMutation.isPending,

    // Errors
    error,

    // Actions
    refetch,
    createCase: createCaseMutation.mutate,
    updateCase: updateCaseMutation.mutate,
    addTimelineEvent: addTimelineEventMutation.mutate,

    // Mutation states
    createCaseAsync: createCaseMutation.mutateAsync,
    updateCaseAsync: updateCaseMutation.mutateAsync,
    addTimelineEventAsync: addTimelineEventMutation.mutateAsync,
  };
};

export const usePetCase = (clinicId: string, caseId: string) => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useMessage();

  // Query for fetching a specific case
  const {
    data: caseData,
    isLoading,
    error,
    refetch,
  } = useQuery<ClinicPetCase>({
    queryKey: ['pet-case', clinicId, caseId],
    queryFn: () => PetCasesService.getCaseById(clinicId, caseId),
    enabled: !!clinicId && !!caseId,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for updating the case
  const updateCaseMutation = useMutation({
    mutationFn: (updateData: UpdatePetCaseRequest) =>
      PetCasesService.updateCase(clinicId, caseId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet-case', clinicId, caseId] });
      queryClient.invalidateQueries({ queryKey: ['pet-cases', clinicId] });
      queryClient.invalidateQueries({ queryKey: ['pet-cases-stats', clinicId] });
      success('Pet case updated successfully');
    },
    onError: (error: any) => {
      showError(`Failed to update case: ${error.message}`);
    },
  });

  return {
    case: caseData,
    isLoading,
    error,
    refetch,
    updateCase: updateCaseMutation.mutate,
    updateCaseAsync: updateCaseMutation.mutateAsync,
    isUpdating: updateCaseMutation.isPending,
  };
};

export const useCaseTimeline = (clinicId: string, caseId: string) => {
  const queryClient = useQueryClient();
  const { success, error: showError } = useMessage();

  // Query for fetching case timeline
  const {
    data: timeline,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['case-timeline', clinicId, caseId],
    queryFn: () => PetCasesService.getCaseTimeline(clinicId, caseId),
    enabled: !!clinicId && !!caseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mutation for adding timeline event
  const addEventMutation = useMutation({
    mutationFn: (eventData: AddTimelineEventRequest) =>
      PetCasesService.addTimelineEvent(clinicId, caseId, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-timeline', clinicId, caseId] });
      queryClient.invalidateQueries({ queryKey: ['pet-case', clinicId, caseId] });
      success('Timeline event added successfully');
    },
    onError: (error: any) => {
      showError(`Failed to add timeline event: ${error.message}`);
    },
  });

  return {
    timeline: timeline || [],
    isLoading,
    error,
    refetch,
    addEvent: addEventMutation.mutate,
    addEventAsync: addEventMutation.mutateAsync,
    isAddingEvent: addEventMutation.isPending,
  };
};
