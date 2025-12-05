import type {
    BulkReviewAction,
    CreateReviewData,
    CreateReviewResponseData,
    Review,
    ReviewMetrics,
    ReviewModerationLog,
    ReviewStats,
    ReviewsFilters,
    ReviewsResponse,
    UpdateReviewData,
    UpdateReviewResponseData,
} from '@/types';

import { BaseQueryParams, BaseService, ValidationHelper } from '../core/base.service';

// Export types for use in other files
export type {
    BulkReviewAction,
    CreateReviewData,
    CreateReviewResponseData,
    UpdateReviewData,
    UpdateReviewResponseData
};

// Query params interface for reviews (extends base for API compatibility)
export interface ReviewsQueryParams extends BaseQueryParams {
  clinicId?: string;
  userId?: string;
  appointmentId?: string;
  rating?: number;
  isPublished?: boolean;
  isVerified?: boolean;
  flagged?: boolean;
  requiresModeration?: boolean;
  tagSoon?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export class ReviewsService extends BaseService<Review, CreateReviewData, UpdateReviewData> {
  constructor() {
    super('/reviews');
  }

  protected getEntityName(): string {
    return 'review';
  }

  /**
   * Get all reviews with optional filtering and pagination
   */
  static async getAll(filters: ReviewsFilters = {}): Promise<ReviewsResponse> {
    const service = new ReviewsService();
    // Exclude dateRange from filters as it's not a valid query param type
    const { dateRange, ...queryFilters } = filters;
    const response = await service.getAll(queryFilters as ReviewsQueryParams);

    return {
      reviews: response.data,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    };
  }

  /**
   * Get review by ID
   */
  static async getById(id: string): Promise<Review> {
    const service = new ReviewsService();
    return service.getById(id);
  }

  /**
   * Get reviews by clinic
   */
  static async getByClinic(clinicId: string, filters: ReviewsFilters = {}): Promise<ReviewsResponse> {
    ValidationHelper.requireId(clinicId, 'Clinic');
    const service = new ReviewsService();
    const { dateRange, ...queryFilters } = filters;
    const response = await service.getRequest<ReviewsResponse>(
      `/reviews/clinic/${clinicId}`,
      queryFilters
    );
    return response;
  }

  /**
   * Get reviews by user
   */
  static async getByUser(userId: string, filters: ReviewsFilters = {}): Promise<ReviewsResponse> {
    ValidationHelper.requireId(userId, 'User');
    const service = new ReviewsService();
    const { dateRange, ...queryFilters } = filters;
    const response = await service.getRequest<ReviewsResponse>(
      `/reviews/user/${userId}`,
      queryFilters
    );
    return response;
  }

  /**
   * Get reviews by appointment
   */
  static async getByAppointment(appointmentId: string): Promise<Review[]> {
    ValidationHelper.requireId(appointmentId, 'Appointment');
    const service = new ReviewsService();
    return service.getRequest<Review[]>(`/reviews/appointment/${appointmentId}`);
  }

  /**
   * Create new review
   */
  static async create(data: CreateReviewData): Promise<Review> {
    const isValid = data.userId && data.clinicId && data.rating && data.comment;
    if (!isValid) {
      throw new Error('User ID, Clinic ID, rating, and comment are required');
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const service = new ReviewsService();
    return service.create(data);
  }

  /**
   * Update review
   */
  static async update(id: string, data: UpdateReviewData): Promise<Review> {
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const service = new ReviewsService();
    return service.update(id, data);
  }

  /**
   * Delete review
   */
  static async delete(id: string): Promise<void> {
    const service = new ReviewsService();
    await service.delete(id);
  }

  /**
   * Publish review (admin action)
   */
  static async publish(id: string): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    const service = new ReviewsService();
    return service.patchRequest<Review>(`/reviews/${id}/publish`, {});
  }

  /**
   * Unpublish review (admin action)
   */
  static async unpublish(id: string): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    const service = new ReviewsService();
    return service.patchRequest<Review>(`/reviews/${id}/unpublish`, {});
  }

  /**
   * Flag review for moderation
   */
  static async flag(id: string, reason?: string): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    const service = new ReviewsService();
    return service.patchRequest<Review>(`/reviews/${id}/flag`, { reason });
  }

  /**
   * Unflag review
   */
  static async unflag(id: string): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    const service = new ReviewsService();
    return service.patchRequest<Review>(`/reviews/${id}/unflag`, {});
  }

  /**
   * Verify review (mark as legitimate)
   */
  static async verify(id: string): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    const service = new ReviewsService();
    return service.patchRequest<Review>(`/reviews/${id}/verify`, {});
  }

  /**
   * Add response to review
   */
  static async addResponse(id: string, data: CreateReviewResponseData): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    if (!data.responseText?.trim()) {
      throw new Error('Response text is required');
    }
    const service = new ReviewsService();
    return service.postRequest<Review>(`/reviews/${id}/response`, data);
  }

  /**
   * Update review response
   */
  static async updateResponse(id: string, data: UpdateReviewResponseData): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    if (!data.responseText?.trim()) {
      throw new Error('Response text is required');
    }
    const service = new ReviewsService();
    return service.patchRequest<Review>(`/reviews/${id}/response`, data);
  }

  /**
   * Delete review response
   */
  static async deleteResponse(id: string): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    const service = new ReviewsService();
    return service.deleteRequest<Review>(`/reviews/${id}/response`);
  }

  /**
   * Vote on review helpfulness
   */
  static async vote(id: string, isHelpful: boolean): Promise<Review> {
    ValidationHelper.requireId(id, 'Review');
    const service = new ReviewsService();
    return service.postRequest<Review>(`/reviews/${id}/vote`, { isHelpful });
  }

  /**
   * Get review statistics
   */
  static async getStats(clinicId?: string): Promise<ReviewStats> {
    const service = new ReviewsService();
    const params = clinicId ? { clinicId } : undefined;
    return service.getRequest<ReviewStats>('/reviews/stats', params);
  }

  /**
   * Get review metrics for dashboard
   */
  static async getMetrics(clinicId?: string): Promise<ReviewMetrics[]> {
    const service = new ReviewsService();
    const params = clinicId ? { clinicId } : undefined;
    return service.getRequest<ReviewMetrics[]>('/reviews/metrics', params);
  }

  /**
   * Get moderation logs for a review
   */
  static async getModerationLogs(reviewId: string): Promise<ReviewModerationLog[]> {
    ValidationHelper.requireId(reviewId, 'Review');
    const service = new ReviewsService();
    return service.getRequest<ReviewModerationLog[]>(`/reviews/${reviewId}/moderation-logs`);
  }

  /**
   * Bulk actions on reviews
   */
  static async bulkAction(actionData: BulkReviewAction): Promise<Review[]> {
    ValidationHelper.validateArray(actionData.reviewIds, 'Review IDs');
    ValidationHelper.validateMinLength(actionData.reviewIds, 1, 'Review IDs');
    if (!actionData.action) {
      throw new Error('Action is required');
    }

    const service = new ReviewsService();
    return service.patchRequest<Review[]>('/reviews/bulk-action', actionData);
  }

  /**
   * Export reviews to CSV
   */
  static async exportToCSV(filters: ReviewsFilters = {}): Promise<Blob> {
    const service = new ReviewsService();
    const { dateRange, ...queryFilters } = filters;
    return service.exportToCSV(queryFilters);
  }

  /**
   * Export reviews to Excel
   */
  static async exportToExcel(filters: ReviewsFilters = {}): Promise<Blob> {
    const service = new ReviewsService();
    const { dateRange, ...queryFilters } = filters;
    return service.exportToExcel(queryFilters);
  }

  /**
   * Get pending reviews (requiring moderation)
   */
  static async getPendingReviews(): Promise<ReviewsResponse> {
    const service = new ReviewsService();
    return service.getRequest<ReviewsResponse>('/reviews/pending');
  }

  /**
   * Get flagged reviews
   */
  static async getFlaggedReviews(): Promise<ReviewsResponse> {
    const service = new ReviewsService();
    return service.getRequest<ReviewsResponse>('/reviews/flagged');
  }
}

export default ReviewsService;
