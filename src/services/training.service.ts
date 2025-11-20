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

import { BaseService } from './base.service';

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

  private static normalizeActivitiesResponse(response: any): TrainingActivitiesResponse {
    if (!response) {
      throw new Error('Training activities response is empty');
    }

    const extract = (data: TrainingActivity[], meta?: Partial<TrainingActivitiesResponse>) => ({
      data,
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
    return service.getById(id);
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
