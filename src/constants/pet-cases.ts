import {
  CASE_PRIORITY_COLORS,
  CASE_PRIORITY_LABELS,
  CASE_STATUS_COLORS,
  CASE_STATUS_LABELS,
  CASE_TYPE_LABELS,
  CasePriority,
  CaseStatus,
  CaseType,
} from '@/types/pet-cases';

// Case Types
export const CASE_TYPES = {
  CONSULTATION: 'consultation' as CaseType,
  FOLLOW_UP: 'follow_up' as CaseType,
  EMERGENCY: 'emergency' as CaseType,
  PREVENTIVE: 'preventive' as CaseType,
  CHRONIC_CONDITION: 'chronic_condition' as CaseType,
  POST_SURGERY: 'post_surgery' as CaseType,
  BEHAVIORAL: 'behavioral' as CaseType,
  NUTRITIONAL: 'nutritional' as CaseType,
} as const;

// Case Priorities
export const CASE_PRIORITIES = {
  LOW: 'low' as CasePriority,
  NORMAL: 'normal' as CasePriority,
  HIGH: 'high' as CasePriority,
  URGENT: 'urgent' as CasePriority,
  EMERGENCY: 'emergency' as CasePriority,
} as const;

// Case Statuses
export const CASE_STATUSES = {
  OPEN: 'open' as CaseStatus,
  IN_PROGRESS: 'in_progress' as CaseStatus,
  PENDING_CONSULTATION: 'pending_consultation' as CaseStatus,
  PENDING_VISIT: 'pending_visit' as CaseStatus,
  UNDER_OBSERVATION: 'under_observation' as CaseStatus,
  RESOLVED: 'resolved' as CaseStatus,
  CLOSED: 'closed' as CaseStatus,
  ESCALATED: 'escalated' as CaseStatus,
} as const;

// Helper functions to convert constants to options for dropdowns
export const getCaseTypeOptions = () => {
  return Object.entries(CASE_TYPES).map(([_, value]) => ({
    value,
    label: CASE_TYPE_LABELS[value],
  }));
};

export const getCasePriorityOptions = () => {
  return Object.entries(CASE_PRIORITIES).map(([_, value]) => ({
    value,
    label: CASE_PRIORITY_LABELS[value],
  }));
};

export const getCaseStatusOptions = () => {
  return Object.entries(CASE_STATUSES).map(([_, value]) => ({
    value,
    label: CASE_STATUS_LABELS[value],
  }));
};
