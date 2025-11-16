export interface TrainingActivity {
  id: string;
  title: string;
  summary?: string | null;
  content_markdown: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  avg_duration_minutes?: number | null;
  indoor?: boolean | null;
  equipment?: string[] | null;
  tags: string[];
  risks: string[];
  enrichment: string[];
  video_url?: string | null;
  source_primary?: string | null;
  source_name?: string | null;
  license?: string | null;
  terms_snapshot?: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
  by_species?: Array<{
    id: string;
    species: string;
    activity_id: string;
  }>;
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

export const TRAINING_DIFFICULTY = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-orange-100 text-orange-800' }
] as const;

export const TRAINING_SPECIES = [
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'puppy', label: 'Puppies' },
  { value: 'kitten', label: 'Kittens' },
  { value: 'small_dog', label: 'Small Dogs' },
  { value: 'large_dog', label: 'Large Dogs' },
  { value: 'senior_dog', label: 'Senior Dogs' },
  { value: 'working_dog', label: 'Working Dogs' }
] as const;

export type TrainingDifficulty = typeof TRAINING_DIFFICULTY[number]['value'];
export type TrainingSpecies = typeof TRAINING_SPECIES[number]['value'];

export interface ApiError {
  message: string;
  statusCode: number;
}
