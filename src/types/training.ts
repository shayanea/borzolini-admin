export interface TrainingActivity {
  id: string;
  title: string;
	description: string;
  summary?: string | null;
  content_markdown?: string; // Made optional as it might be replaced by steps
  difficulty: 'easy' | 'moderate' | 'advanced';
  
  // Standardized camelCase properties matching DTO and frontend usage
  durationMinutes: number;
  species: string[];
  tags: string[];
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  steps: Array<{
    id?: string;
    title: string;
    description: string;
    order: number;
    tips?: string[];
  }>;
  benefits: string[];
  prerequisites?: string[];
  isActive: boolean;

  // Legacy/DB properties (kept for compatibility if needed, but made optional)
  avg_duration_minutes?: number | null;
  video_url?: string | null;
  indoor?: boolean | null;
  equipment?: string[] | null;
  risks?: string[];
  enrichment?: string[];
  source_primary?: string | null;
  source_name?: string | null;
  license?: string | null;
  terms_snapshot?: Record<string, unknown> | null;
  by_species?: Array<{
    id: string;
    species: string;
    activity_id: string;
  }>;

  created_at: Date;
  updated_at: Date;
}

export interface TrainingAssignment {
  id: string;
  userId: string;
  petId: string;
  activityId: string;
  activity: TrainingActivity;
  assignedDate: Date;
  dueDate: Date;
  completedDate?: Date;
  completionNotes?: string;
  progress: number; // 0-100
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyTrainingStats {
  todayAssignments: number;
  completedToday: number;
  overdue: number;
  totalActivities: number;
  completionRate: number; // percentage
  streakDays: number;
  lastCompleted?: Date;
}

export interface CreateTrainingActivityDto {
  title: string;
  description: string;
  species: string[];
  difficulty: 'easy' | 'moderate' | 'advanced';
  durationMinutes: number;
  tags: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  steps: Array<{
    title: string;
    description: string;
    order: number;
    tips?: string[];
  }>;
  benefits: string[];
  prerequisites?: string[];
  isActive?: boolean;
}

export interface UpdateTrainingActivityDto {
  title?: string;
  description?: string;
  species?: string[];
  difficulty?: 'easy' | 'moderate' | 'advanced';
  durationMinutes?: number;
  tags?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  steps?: Array<{
    id?: string;
    title: string;
    description: string;
    order: number;
    tips?: string[];
  }>;
  benefits?: string[];
  prerequisites?: string[];
  isActive?: boolean;
}

export interface CreateTrainingAssignmentDto {
  petId: string;
  activityId: string;
  dueDate?: Date;
  completionNotes?: string;
}

export interface CompleteTrainingDto {
  completionNotes?: string;
  progress?: number;
}

export interface TrainingSearchParams {
  q?: string;
  species?: string;
  tags?: string;
  difficulty?: 'easy' | 'moderate' | 'advanced';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TrainingResponse {
  data: TrainingActivity;
  message: string;
}

export interface TrainingsResponse {
  data: TrainingActivity[];
  total: number;
  page: number;
  limit: number;
}

export interface TrainingStatsResponse {
  data: DailyTrainingStats;
  message: string;
}

export interface TrainingHistoryResponse {
  data: TrainingAssignment[];
  total: number;
  page: number;
  limit: number;
}

export interface TrainingFormErrors {
  title?: string;
  description?: string;
  species?: string;
  difficulty?: string;
  durationMinutes?: string;
  tags?: string;
  steps?: string;
  benefits?: string;
}

import { TRAINING_DIFFICULTY, TRAINING_SPECIES } from '@/constants/training';

export type TrainingDifficulty = typeof TRAINING_DIFFICULTY[number]['value'];
export type TrainingSpecies = typeof TRAINING_SPECIES[number]['value'];

export interface ApiError {
  message: string;
  statusCode: number;
}
