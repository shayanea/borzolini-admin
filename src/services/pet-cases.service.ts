// Pet Cases Service for Admin Dashboard
import {
  AddTimelineEventRequest,
  CaseFilters,
  CaseStats,
  ClinicPetCase,
  CreatePetCaseRequest,
  PetCasesResponse,
  TimelineEvent,
  UpdatePetCaseRequest,
} from '../types/pet-cases';
import { apiService } from './api';

export class PetCasesService {
  private static readonly BASE_URL = '/clinics';

  // Get all pet cases for a clinic
  static async getCasesByClinic(
    clinicId: string,
    filters: CaseFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PetCasesResponse> {
    const params = new URLSearchParams();

    // Add pagination
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    // Add filters
    if (filters.status && filters.status.length > 0) {
      params.append('status', filters.status.join(','));
    }
    if (filters.priority && filters.priority.length > 0) {
      params.append('priority', filters.priority.join(','));
    }
    if (filters.case_type && filters.case_type.length > 0) {
      params.append('case_type', filters.case_type.join(','));
    }
    if (filters.pet_id) params.append('pet_id', filters.pet_id);
    if (filters.owner_id) params.append('owner_id', filters.owner_id);
    if (filters.vet_id) params.append('vet_id', filters.vet_id);
    if (filters.is_urgent !== undefined) params.append('is_urgent', filters.is_urgent.toString());
    if (filters.is_resolved !== undefined)
      params.append('is_resolved', filters.is_resolved.toString());
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);

    const response = await apiService.get<PetCasesResponse>(
      `${this.BASE_URL}/${clinicId}/cases?${params.toString()}`
    );
    return response;
  }

  // Get a specific pet case
  static async getCaseById(clinicId: string, caseId: string): Promise<ClinicPetCase> {
    const response = await apiService.get<ClinicPetCase>(`${this.BASE_URL}/${clinicId}/cases/${caseId}`);
    return response;
  }

  // Create a new pet case
  static async createCase(
    clinicId: string,
    caseData: CreatePetCaseRequest
  ): Promise<ClinicPetCase> {
    const response = await apiService.post<ClinicPetCase>(`${this.BASE_URL}/${clinicId}/cases`, caseData);
    return response;
  }

  // Update a pet case
  static async updateCase(
    clinicId: string,
    caseId: string,
    updateData: UpdatePetCaseRequest
  ): Promise<ClinicPetCase> {
    const response = await apiService.put<ClinicPetCase>(
      `${this.BASE_URL}/${clinicId}/cases/${caseId}`,
      updateData
    );
    return response;
  }

  // Get case timeline
  static async getCaseTimeline(clinicId: string, caseId: string): Promise<TimelineEvent[]> {
    const response = await apiService.get<TimelineEvent[]>(
      `${this.BASE_URL}/${clinicId}/cases/${caseId}/timeline`
    );
    return response;
  }

  // Add timeline event
  static async addTimelineEvent(
    clinicId: string,
    caseId: string,
    eventData: AddTimelineEventRequest
  ): Promise<TimelineEvent> {
    const response = await apiService.post<TimelineEvent>(
      `${this.BASE_URL}/${clinicId}/cases/${caseId}/timeline`,
      eventData
    );
    return response;
  }

  // Get case statistics
  static async getCaseStats(clinicId: string): Promise<CaseStats> {
    const response = await apiService.get<CaseStats>(`${this.BASE_URL}/${clinicId}/cases/stats`);
    return response;
  }

  // Bulk operations
  static async bulkUpdateCases(
    clinicId: string,
    caseIds: string[],
    updateData: Partial<UpdatePetCaseRequest>
  ): Promise<void> {
    await apiService.put(`${this.BASE_URL}/${clinicId}/cases/bulk`, { caseIds, updateData });
  }

  // Export cases
  static async exportCases(
    clinicId: string,
    filters: CaseFilters = {},
    format: 'csv' | 'excel' = 'csv'
  ): Promise<Blob> {
    const params = new URLSearchParams();

    // Add filters
    if (filters.status && filters.status.length > 0) {
      params.append('status', filters.status.join(','));
    }
    if (filters.priority && filters.priority.length > 0) {
      params.append('priority', filters.priority.join(','));
    }
    if (filters.case_type && filters.case_type.length > 0) {
      params.append('case_type', filters.case_type.join(','));
    }
    if (filters.pet_id) params.append('pet_id', filters.pet_id);
    if (filters.owner_id) params.append('owner_id', filters.owner_id);
    if (filters.vet_id) params.append('vet_id', filters.vet_id);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);

    const response = await apiService.get(
      `${this.BASE_URL}/${clinicId}/cases/export/${format}?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response;
  }

  // Utility methods for case management
  private static readonly STATUS_CONFIG = {
    colors: {
      open: 'blue',
      in_progress: 'orange',
      pending_consultation: 'purple',
      pending_visit: 'indigo',
      under_observation: 'yellow',
      resolved: 'green',
      closed: 'gray',
      escalated: 'red',
    },
    labels: {
      open: 'Open',
      in_progress: 'In Progress',
      pending_consultation: 'Pending Consultation',
      pending_visit: 'Pending Visit',
      under_observation: 'Under Observation',
      resolved: 'Resolved',
      closed: 'Closed',
      escalated: 'Escalated',
    },
  };

  private static readonly PRIORITY_CONFIG = {
    colors: {
      low: 'gray',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
      emergency: 'red',
    },
    labels: {
      low: 'Low',
      normal: 'Normal',
      high: 'High',
      urgent: 'Urgent',
      emergency: 'Emergency',
    },
  };

  static getStatusColor(status: string): string {
    return this.STATUS_CONFIG.colors[status as keyof typeof this.STATUS_CONFIG.colors] || 'gray';
  }

  static getPriorityColor(priority: string): string {
    return (
      this.PRIORITY_CONFIG.colors[priority as keyof typeof this.PRIORITY_CONFIG.colors] || 'gray'
    );
  }

  static getStatusLabel(status: string): string {
    return this.STATUS_CONFIG.labels[status as keyof typeof this.STATUS_CONFIG.labels] || status;
  }

  static getPriorityLabel(priority: string): string {
    return (
      this.PRIORITY_CONFIG.labels[priority as keyof typeof this.PRIORITY_CONFIG.labels] || priority
    );
  }

  static isUrgent(priority: string): boolean {
    return priority === 'urgent' || priority === 'emergency';
  }

  static isResolved(status: string): boolean {
    return status === 'resolved' || status === 'closed';
  }

  static calculateDaysOpen(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }
}
