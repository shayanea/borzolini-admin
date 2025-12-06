import type {
  CompleteTrainingDto,
  CreateTrainingActivityDto,
  CreateTrainingAssignmentDto,
  DailyTrainingStats,
  TrainingActivity,
  TrainingAssignment,
  TrainingHistoryResponse,
  TrainingSearchParams,
  UpdateTrainingActivityDto,
} from '@/types/training';

import { BaseService } from '../core/base.service';

interface TrainingActivitiesResponse {
  data: TrainingActivity[];
  total: number;
  page: number;
  limit: number;
}

interface TrainingAssignmentsResponse {
  assignments: TrainingAssignment[];
  total?: number;
  page?: number;
  limit?: number;
}

const ADMIN_ACTIVITIES_ENDPOINT = '/training/admin/activities';
const SEARCH_ENDPOINT = '/training/search';
const BY_SPECIES_ENDPOINT = '/training/by-species';
const DAILY_ASSIGNMENTS_ENDPOINT = '/training/daily';
const COMPLETE_ASSIGNMENT_ENDPOINT = (id: string): string => `/training/daily/${id}/complete`;
const HISTORY_ENDPOINT = '/training/history';
const STATS_ENDPOINT = '/training/stats';

export class TrainingService extends BaseService<
  TrainingActivity,
  CreateTrainingActivityDto,
  UpdateTrainingActivityDto
> {
  constructor() {
    super(ADMIN_ACTIVITIES_ENDPOINT);
  }

  protected getEntityName(): string {
    return 'training activity';
  }

  /**
   * Normalizes API response from snake_case to camelCase
   */
  private static normalizeActivity(activity: any): TrainingActivity {
    if (!activity) {
      throw new Error('Activity data is required');
    }

    // If already normalized, return as is
    if (activity.durationMinutes !== undefined && activity.videoUrl !== undefined) {
      return activity as TrainingActivity;
    }

    // Normalize snake_case to camelCase
    const normalized: TrainingActivity = {
      id: activity.id,
      title: activity.title || '',
      description: activity.description || '',
      summary: activity.summary || activity.summary,
      content_markdown: activity.content_markdown || activity.contentMarkdown,
      difficulty: activity.difficulty || 'easy',
      durationMinutes: activity.durationMinutes ?? activity.avg_duration_minutes ?? 0,
      species: activity.species || [],
      tags: activity.tags || [],
      videoUrl: activity.videoUrl ?? activity.video_url ?? null,
      thumbnailUrl: activity.thumbnailUrl ?? activity.thumbnail_url ?? null,
      steps: activity.steps || [],
      benefits: activity.benefits || [],
      prerequisites: activity.prerequisites || [],
      isActive: activity.isActive ?? activity.is_active ?? true,
      // Legacy properties
      avg_duration_minutes: activity.avg_duration_minutes ?? activity.durationMinutes,
      video_url: activity.video_url ?? activity.videoUrl,
      indoor: activity.indoor,
      equipment: activity.equipment,
      risks: activity.risks,
      enrichment: activity.enrichment,
      source_primary: activity.source_primary,
      source_name: activity.source_name,
      license: activity.license,
      terms_snapshot: activity.terms_snapshot,
      by_species: activity.by_species,
      created_at:
        activity.created_at || activity.createdAt
          ? new Date(activity.created_at || activity.createdAt)
          : new Date(),
      updated_at:
        activity.updated_at || activity.updatedAt
          ? new Date(activity.updated_at || activity.updatedAt)
          : new Date(),
    };

    // Ensure steps is always an array
    if (!normalized.steps || !Array.isArray(normalized.steps)) {
      normalized.steps = [];
    }

    return normalized;
  }

  private static normalizeActivitiesResponse(response: any): TrainingActivitiesResponse {
    if (!response) {
      throw new Error('Training activities response is empty');
    }

    const extract = (data: any[], meta?: Partial<TrainingActivitiesResponse>) => ({
      data: data.map(activity => this.normalizeActivity(activity)),
      total: meta?.total ?? data.length,
      page: meta?.page ?? 1,
      limit: meta?.limit ?? data.length ?? 10,
    });

    if (Array.isArray(response.data)) {
      return extract(response.data, response);
    }

    if (Array.isArray(response.activities)) {
      return extract(response.activities, response);
    }

    if (Array.isArray(response.results)) {
      return extract(response.results, response);
    }

    if (Array.isArray(response)) {
      return extract(response);
    }

    throw new Error('Invalid training activities response format');
  }

  private static buildQueryParams(
    params: TrainingSearchParams = {}
  ): Record<string, string | number> {
    const query: Record<string, string | number> = {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    };

    if (params.q) query.q = params.q;
    if (params.species) query.species = params.species;
    if (params.tags) query.tags = params.tags;
    if (params.difficulty) query.difficulty = params.difficulty;
    if (params.sortBy) query.sortBy = params.sortBy;
    if (params.sortOrder) query.sortOrder = params.sortOrder;

    return query;
  }

  static async getActivities(
    params: TrainingSearchParams = {}
  ): Promise<TrainingActivitiesResponse> {
    const service = new TrainingService();
    const response = await service.getRequest(
      ADMIN_ACTIVITIES_ENDPOINT,
      this.buildQueryParams(params)
    );
    return this.normalizeActivitiesResponse(response);
  }

  static async getActivity(id: string): Promise<TrainingActivity> {
    const service = new TrainingService();
    const endpoint = `${ADMIN_ACTIVITIES_ENDPOINT}/${id}`;

    try {
      const response = await service.getRequest<any>(endpoint);

      // Handle different response formats
      let rawActivity: any;
      if (response?.data && typeof response.data === 'object') {
        rawActivity = response.data;
      } else if (response?.id) {
        rawActivity = response;
      } else {
        throw new Error('Invalid training activity response format');
      }

      // Normalize the activity data
      return this.normalizeActivity(rawActivity);
    } catch (error: any) {
      console.error('Error fetching training activity:', {
        id,
        endpoint,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      });
      throw error;
    }
  }

  static async createActivity(data: CreateTrainingActivityDto): Promise<TrainingActivity> {
    const service = new TrainingService();
    return service.create(data);
  }

  static async updateActivity(
    id: string,
    data: UpdateTrainingActivityDto
  ): Promise<TrainingActivity> {
    const service = new TrainingService();
    return service.update(id, data);
  }

  static async deleteActivity(id: string): Promise<void> {
    const service = new TrainingService();
    await service.delete(id);
  }

  static async searchActivities(
    params: TrainingSearchParams & { q: string }
  ): Promise<TrainingActivitiesResponse> {
    const service = new TrainingService();
    const response = await service.getRequest(SEARCH_ENDPOINT, this.buildQueryParams(params));
    return this.normalizeActivitiesResponse(response);
  }

  static async getActivitiesBySpecies(
    species: string,
    params: Omit<TrainingSearchParams, 'species'> = {}
  ): Promise<TrainingActivitiesResponse> {
    const service = new TrainingService();
    const response = await service.getRequest(BY_SPECIES_ENDPOINT, {
      species,
      ...this.buildQueryParams({ ...params, species }),
    });
    return this.normalizeActivitiesResponse(response);
  }

  static async getDailyAssignments(): Promise<TrainingAssignmentsResponse> {
    const service = new TrainingService();
    const response = await service.getRequest<any>(DAILY_ASSIGNMENTS_ENDPOINT);

    if (Array.isArray(response?.data)) {
      return {
        assignments: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
      };
    }

    if (Array.isArray(response)) {
      return { assignments: response };
    }

    if (Array.isArray(response?.assignments)) {
      return {
        assignments: response.assignments,
        total: response.total,
        page: response.page,
        limit: response.limit,
      };
    }

    throw new Error('Invalid training assignments response format');
  }

  static async createAssignment(data: CreateTrainingAssignmentDto): Promise<TrainingAssignment> {
    const service = new TrainingService();
    return service.postRequest<TrainingAssignment>(DAILY_ASSIGNMENTS_ENDPOINT, data);
  }

  static async completeAssignment(
    id: string,
    data: CompleteTrainingDto
  ): Promise<TrainingAssignment> {
    const service = new TrainingService();
    return service.patchRequest<TrainingAssignment>(COMPLETE_ASSIGNMENT_ENDPOINT(id), data);
  }

  static async getHistory(limit?: number): Promise<TrainingHistoryResponse> {
    const service = new TrainingService();
    const params = limit ? { limit } : undefined;
    return service.getRequest<TrainingHistoryResponse>(HISTORY_ENDPOINT, params);
  }

  static async getStats(): Promise<DailyTrainingStats> {
    const service = new TrainingService();
    const response = await service.getRequest<{ data?: DailyTrainingStats }>(STATS_ENDPOINT);
    if (response?.data) {
      return response.data;
    }
    if (response) {
      return response as DailyTrainingStats;
    }
    throw new Error('Invalid training stats response');
  }
}

export default TrainingService;
