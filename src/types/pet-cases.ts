// Pet Cases Types for Admin Dashboard
export type CaseStatus =
  | 'open'
  | 'in_progress'
  | 'pending_consultation'
  | 'pending_visit'
  | 'under_observation'
  | 'resolved'
  | 'closed'
  | 'escalated';

export type CasePriority = 'low' | 'normal' | 'high' | 'urgent' | 'emergency';

export type CaseType =
  | 'consultation'
  | 'follow_up'
  | 'emergency'
  | 'preventive'
  | 'chronic_condition'
  | 'post_surgery'
  | 'behavioral'
  | 'nutritional';

export type TimelineEventType =
  | 'case_created'
  | 'symptoms_updated'
  | 'vital_signs_recorded'
  | 'consultation_scheduled'
  | 'consultation_completed'
  | 'visit_scheduled'
  | 'visit_completed'
  | 'diagnosis_made'
  | 'treatment_prescribed'
  | 'medication_administered'
  | 'follow_up_scheduled'
  | 'ai_insight_generated'
  | 'case_escalated'
  | 'case_resolved'
  | 'case_closed'
  | 'note_added'
  | 'file_attached'
  | 'status_changed'
  | 'priority_changed';

export interface VitalSigns {
  temperature?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  weight?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  recorded_at?: string;
}

export interface TreatmentPlan {
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  procedures?: string[];
  follow_up_instructions?: string;
  dietary_changes?: string;
  activity_restrictions?: string;
}

export interface AiInsights {
  risk_assessment?: number;
  urgency_score?: number;
  suggested_actions?: string[];
  breed_specific_notes?: string;
  pattern_analysis?: any;
}

export interface TimelineEvent {
  timestamp: string;
  event_type: TimelineEventType;
  description: string;
  user_id?: string;
  user_name?: string;
  metadata?: any;
}

export interface Attachment {
  id: string;
  filename: string;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ClinicPetCase {
  id: string;
  case_number: string;
  clinic_id: string;
  pet_id: string;
  owner_id: string;
  vet_id?: string;
  case_type: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  title: string;
  description: string;
  initial_symptoms: string[];
  current_symptoms: string[];
  vital_signs?: VitalSigns;
  diagnosis?: string;
  treatment_plan?: TreatmentPlan;
  ai_insights?: AiInsights;
  timeline: TimelineEvent[];
  attachments: Attachment[];
  notes?: string;
  resolution_notes?: string;
  resolved_at?: string;
  closed_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relations (populated)
  pet?: {
    id: string;
    name: string;
    species: string;
    breed?: string;
    gender: string;
    age?: number;
    weight?: string;
    size?: string;
    color?: string;
    microchip_number?: string;
    photo_url?: string;
  };
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  veterinarian?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  clinic?: {
    id: string;
    name: string;
    city: string;
    state?: string;
  };
}

// API Request/Response Types
export interface CreatePetCaseRequest {
  pet_id: string;
  case_type: CaseType;
  title: string;
  description: string;
  initial_symptoms: string[];
  priority?: CasePriority;
  vet_id?: string;
}

export interface UpdatePetCaseRequest {
  title?: string;
  description?: string;
  current_symptoms?: string[];
  diagnosis?: string;
  treatment_plan?: TreatmentPlan;
  status?: CaseStatus;
  priority?: CasePriority;
  notes?: string;
  vital_signs?: VitalSigns;
}

export interface CaseFilters {
  [key: string]: any;
  status?: CaseStatus[];
  priority?: CasePriority[];
  case_type?: CaseType[];
  pet_id?: string;
  owner_id?: string;
  vet_id?: string;
  is_urgent?: boolean;
  is_resolved?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface PetCasesResponse {
  cases: ClinicPetCase[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CaseStats {
  total: number;
  byStatus: Record<CaseStatus, number>;
  byPriority: Record<CasePriority, number>;
  byType: Record<CaseType, number>;
  urgent: number;
  resolved: number;
  averageResolutionTime: number;
}

export interface AddTimelineEventRequest {
  event_type: TimelineEventType;
  title: string;
  description: string;
  metadata?: any;
}

// Status and Priority Labels
export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending_consultation: 'Pending Consultation',
  pending_visit: 'Pending Visit',
  under_observation: 'Under Observation',
  resolved: 'Resolved',
  closed: 'Closed',
  escalated: 'Escalated',
};

export const CASE_PRIORITY_LABELS: Record<CasePriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
  emergency: 'Emergency',
};

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  consultation: 'Consultation',
  follow_up: 'Follow-up',
  emergency: 'Emergency',
  preventive: 'Preventive Care',
  chronic_condition: 'Chronic Condition',
  post_surgery: 'Post-Surgery',
  behavioral: 'Behavioral',
  nutritional: 'Nutritional',
};

// Status and Priority Colors
export const CASE_STATUS_COLORS: Record<CaseStatus, string> = {
  open: 'blue',
  in_progress: 'orange',
  pending_consultation: 'purple',
  pending_visit: 'indigo',
  under_observation: 'yellow',
  resolved: 'green',
  closed: 'gray',
  escalated: 'red',
};

export const CASE_PRIORITY_COLORS: Record<CasePriority, string> = {
  low: 'gray',
  normal: 'blue',
  high: 'orange',
  urgent: 'red',
  emergency: 'red',
};
