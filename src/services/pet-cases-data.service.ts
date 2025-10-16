/**
 * Pet Cases Data Service
 * Handles pet case data normalization and validation
 */

import type { CasePriority, CaseStatus, ClinicPetCase } from '@/types/pet-cases';

export const PetCasesDataService = {
  /**
   * Normalize pet cases data ensuring all required fields have valid values
   */
  normalizePetCases: (cases: ClinicPetCase[]): ClinicPetCase[] => {
    if (!Array.isArray(cases)) {
      console.error('normalizePetCases received non-array data:', cases);
      return [];
    }

    return cases
      .filter(petCase => petCase && typeof petCase === 'object' && petCase.id)
      .map(petCase => {
        // Log any problematic cases for debugging
        if (!petCase.case_number || !petCase.pet_id || !petCase.owner_id) {
          console.warn('Pet case missing required fields, applying defaults:', petCase);
        }

        return {
          ...petCase,
          case_number: petCase.case_number || `CASE-${Date.now()}`,
          pet_id: petCase.pet_id || '',
          owner_id: petCase.owner_id || '',
          clinic_id: petCase.clinic_id || '',
          vet_id: petCase.vet_id || '',
          status: petCase.status || 'open',
          priority: petCase.priority || 'normal',
          case_type: petCase.case_type || 'consultation',
          title: petCase.title || '',
          description: petCase.description || '',
          initial_symptoms: Array.isArray(petCase.initial_symptoms) ? petCase.initial_symptoms : [],
          current_symptoms: Array.isArray(petCase.current_symptoms) ? petCase.current_symptoms : [],
          vital_signs: petCase.vital_signs || {},
          diagnosis: petCase.diagnosis || '',
          treatment_plan: petCase.treatment_plan || {},
          attachments: Array.isArray(petCase.attachments) ? petCase.attachments : [],
          timeline: Array.isArray(petCase.timeline) ? petCase.timeline : [],
          ai_insights: petCase.ai_insights || {},
          resolved_at: petCase.resolved_at || '',
          closed_at: petCase.closed_at || '',
          notes: petCase.notes || '',
          resolution_notes: petCase.resolution_notes || '',
          is_active: petCase.is_active ?? true,
          created_at: petCase.created_at || new Date().toISOString(),
          updated_at: petCase.updated_at || new Date().toISOString(),
          pet: petCase.pet || {
            id: '',
            name: 'Unknown Pet',
            species: 'other',
            breed: '',
            gender: 'male',
            age: 0,
            weight: '0',
            photo_url: '',
          },
          owner: petCase.owner || {
            id: '',
            firstName: 'Unknown',
            lastName: 'Owner',
            email: '',
            phone: '',
          },
          veterinarian: petCase.veterinarian || undefined,
          clinic: petCase.clinic || undefined,
        };
      });
  },

  /**
   * Normalize a single pet case
   */
  normalizePetCase: (petCase: ClinicPetCase | null | undefined): ClinicPetCase | null => {
    if (!petCase || typeof petCase !== 'object' || !petCase.id) {
      return null;
    }

    const normalized = PetCasesDataService.normalizePetCases([petCase]);
    return normalized.length > 0 ? normalized[0] : null;
  },

  /**
   * Validate pet case data before submission
   */
  validatePetCaseData: (
    data: Partial<ClinicPetCase>
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!data.pet_id || data.pet_id.trim() === '') {
      errors.pet_id = 'Pet ID is required';
    }

    if (!data.owner_id || data.owner_id.trim() === '') {
      errors.owner_id = 'Owner ID is required';
    }

    if (!data.clinic_id || data.clinic_id.trim() === '') {
      errors.clinic_id = 'Clinic ID is required';
    }

    if (!data.title || data.title.trim() === '') {
      errors.title = 'Case title is required';
    }

    if (!data.description || data.description.trim() === '') {
      errors.description = 'Case description is required';
    }

    if (!data.status) {
      errors.status = 'Case status is required';
    }

    if (!data.priority) {
      errors.priority = 'Case priority is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Get case status display information
   */
  getStatusInfo: (status: CaseStatus): { label: string; color: string; description: string } => {
    const statusMap: Record<CaseStatus, { label: string; color: string; description: string }> = {
      open: {
        label: 'Open',
        color: 'blue',
        description: 'Case has been created and is awaiting action',
      },
      in_progress: {
        label: 'In Progress',
        color: 'orange',
        description: 'Case is actively being worked on',
      },
      pending_consultation: {
        label: 'Pending Consultation',
        color: 'gold',
        description: 'Awaiting veterinarian consultation',
      },
      pending_visit: {
        label: 'Pending Visit',
        color: 'cyan',
        description: 'Scheduled for clinic visit',
      },
      under_observation: {
        label: 'Under Observation',
        color: 'purple',
        description: 'Pet is under medical observation',
      },
      resolved: { label: 'Resolved', color: 'green', description: 'Case has been resolved' },
      closed: { label: 'Closed', color: 'default', description: 'Case is closed' },
      escalated: { label: 'Escalated', color: 'red', description: 'Case has been escalated' },
    };

    return statusMap[status] || { label: status, color: 'default', description: 'Unknown status' };
  },

  /**
   * Get case priority display information
   */
  getPriorityInfo: (
    priority: CasePriority
  ): { label: string; color: string; urgencyScore: number } => {
    const priorityMap: Record<
      CasePriority,
      { label: string; color: string; urgencyScore: number }
    > = {
      low: { label: 'Low', color: 'default', urgencyScore: 1 },
      normal: { label: 'Normal', color: 'blue', urgencyScore: 2 },
      high: { label: 'High', color: 'orange', urgencyScore: 3 },
      urgent: { label: 'Urgent', color: 'volcano', urgencyScore: 4 },
      emergency: { label: 'Emergency', color: 'red', urgencyScore: 5 },
    };

    return priorityMap[priority] || { label: priority, color: 'default', urgencyScore: 0 };
  },

  /**
   * Calculate case duration in days
   */
  calculateCaseDuration: (petCase: ClinicPetCase): number => {
    const startDate = new Date(petCase.created_at);
    const endDate = petCase.closed_at ? new Date(petCase.closed_at) : new Date();

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  },

  /**
   * Get case completion percentage
   */
  getCompletionPercentage: (petCase: ClinicPetCase): number => {
    const checkpoints = [
      !!petCase.current_symptoms && petCase.current_symptoms.length > 0,
      !!petCase.vital_signs && Object.keys(petCase.vital_signs).length > 0,
      !!petCase.diagnosis,
      !!petCase.treatment_plan && Object.keys(petCase.treatment_plan).length > 0,
      petCase.status === 'resolved' || petCase.status === 'closed',
    ];

    const completed = checkpoints.filter(Boolean).length;
    return Math.round((completed / checkpoints.length) * 100);
  },

  /**
   * Format case display name
   */
  formatCaseDisplayName: (petCase: ClinicPetCase): string => {
    return `${petCase.case_number} - ${petCase.pet?.name || 'Unknown Pet'}`;
  },

  /**
   * Get case urgency level (0-5)
   */
  getUrgencyLevel: (petCase: ClinicPetCase): number => {
    const priorityInfo = PetCasesDataService.getPriorityInfo(petCase.priority);
    let urgency = priorityInfo.urgencyScore;

    // Increase urgency for escalated cases
    if (petCase.status === 'escalated') {
      urgency = Math.min(5, urgency + 1);
    }

    return urgency;
  },

  /**
   * Sort cases by urgency
   */
  sortByUrgency: (cases: ClinicPetCase[]): ClinicPetCase[] => {
    return [...cases].sort((a, b) => {
      const urgencyA = PetCasesDataService.getUrgencyLevel(a);
      const urgencyB = PetCasesDataService.getUrgencyLevel(b);
      return urgencyB - urgencyA;
    });
  },

  /**
   * Filter active cases
   */
  filterActiveCases: (cases: ClinicPetCase[]): ClinicPetCase[] => {
    return cases.filter(
      petCase => petCase.is_active && petCase.status !== 'closed' && petCase.status !== 'resolved'
    );
  },

  /**
   * Get cases requiring immediate attention
   */
  getUrgentCases: (cases: ClinicPetCase[]): ClinicPetCase[] => {
    return cases.filter(
      petCase =>
        (petCase.priority === 'urgent' || petCase.priority === 'emergency') &&
        petCase.status !== 'closed' &&
        petCase.status !== 'resolved'
    );
  },
};
