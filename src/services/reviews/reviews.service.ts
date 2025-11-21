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

import { environment } from '@/config/environment';
import { apiService } from '../api/index';
import { reviewsCache } from '../core/cache.service';

// Export types for use in other files
export type {
  BulkReviewAction,
  CreateReviewData,
  CreateReviewResponseData,
  UpdateReviewData,
  UpdateReviewResponseData,
};

export class ReviewsService {
  /**
   * Get all reviews with optional filtering and pagination
   */
  static async getAll(filters: ReviewsFilters = {}): Promise<ReviewsResponse> {
    try {
      const params = apiService.buildQueryParams(filters);
      const queryString = params.toString();
      const url = queryString ? `/reviews?${queryString}` : '/reviews';

      const response = await apiService.get<ReviewsResponse>(url);

      // Validate response data
      if (!response.reviews || !Array.isArray(response.reviews)) {
        throw new Error('Invalid response format: reviews array is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch reviews:', error);
      throw error;
    }
  }

  /**
   * Get review by ID
   */
  static async getById(id: string): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.get<Review>(`/reviews/${id}`);

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch review:', error);
      throw error;
    }
  }

  /**
   * Get reviews by clinic
   */
  static async getByClinic(
    clinicId: string,
    filters: ReviewsFilters = {}
  ): Promise<ReviewsResponse> {
    try {
      if (!clinicId) {
        throw new Error('Clinic ID is required');
      }

      const params = apiService.buildQueryParams({ ...filters, clinicId });
      const queryString = params.toString();
      const url = `/reviews/clinic/${clinicId}${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get<ReviewsResponse>(url);

      if (!response.reviews || !Array.isArray(response.reviews)) {
        throw new Error('Invalid response format: reviews array is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch clinic reviews:', error);
      throw error;
    }
  }

  /**
   * Get reviews by user
   */
  static async getByUser(userId: string, filters: ReviewsFilters = {}): Promise<ReviewsResponse> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const params = apiService.buildQueryParams({ ...filters, userId });
      const queryString = params.toString();
      const url = `/reviews/user/${userId}${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get<ReviewsResponse>(url);

      if (!response.reviews || !Array.isArray(response.reviews)) {
        throw new Error('Invalid response format: reviews array is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch user reviews:', error);
      throw error;
    }
  }

  /**
   * Get reviews by appointment
   */
  static async getByAppointment(appointmentId: string): Promise<Review[]> {
    try {
      if (!appointmentId) {
        throw new Error('Appointment ID is required');
      }

      const response = await apiService.get<Review[]>(`/reviews/appointment/${appointmentId}`);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of reviews');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch appointment reviews:', error);
      throw error;
    }
  }

  /**
   * Create new review
   */
  static async create(data: CreateReviewData): Promise<Review> {
    try {
      const isValid = data.userId && data.clinicId && data.rating && data.comment;
      if (!isValid) {
        throw new Error('User ID, Clinic ID, rating, and comment are required');
      }

      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const response = await apiService.post<Review>('/reviews', data);

      // Clear cache to ensure fresh data
      reviewsCache.clear();

      return response;
    } catch (error: unknown) {
      console.error('Failed to create review:', error);
      throw error;
    }
  }

  /**
   * Update review
   */
  static async update(id: string, data: UpdateReviewData): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
      }

      const response = await apiService.patch<Review>(`/reviews/${id}`, data);

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      // Clear cache to reflect changes
      reviewsCache.clear();

      return response;
    } catch (error: unknown) {
      console.error('Failed to update review:', error);
      throw error;
    }
  }

  /**
   * Delete review
   */
  static async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      await apiService.delete(`/reviews/${id}`);

      // Clear cache to ensure fresh data
      reviewsCache.clear();
    } catch (error: unknown) {
      console.error('Failed to delete review:', error);
      throw error;
    }
  }

  /**
   * Publish review (admin action)
   */
  static async publish(id: string): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.patch<Review>(`/reviews/${id}/publish`, {});

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to publish review:', error);
      throw error;
    }
  }

  /**
   * Unpublish review (admin action)
   */
  static async unpublish(id: string): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.patch<Review>(`/reviews/${id}/unpublish`, {});

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to unpublish review:', error);
      throw error;
    }
  }

  /**
   * Flag review for moderation
   */
  static async flag(id: string, reason?: string): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.patch<Review>(`/reviews/${id}/flag`, { reason });

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to flag review:', error);
      throw error;
    }
  }

  /**
   * Unflag review
   */
  static async unflag(id: string): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.patch<Review>(`/reviews/${id}/unflag`, {});

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to unflag review:', error);
      throw error;
    }
  }

  /**
   * Verify review (mark as legitimate)
   */
  static async verify(id: string): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.patch<Review>(`/reviews/${id}/verify`, {});

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to verify review:', error);
      throw error;
    }
  }

  /**
   * Add response to review
   */
  static async addResponse(id: string, data: CreateReviewResponseData): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      if (!data.responseText?.trim()) {
        throw new Error('Response text is required');
      }

      const response = await apiService.post<Review>(`/reviews/${id}/response`, data);

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to add review response:', error);
      throw error;
    }
  }

  /**
   * Update review response
   */
  static async updateResponse(id: string, data: UpdateReviewResponseData): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      if (!data.responseText?.trim()) {
        throw new Error('Response text is required');
      }

      const response = await apiService.patch<Review>(`/reviews/${id}/response`, data);

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to update review response:', error);
      throw error;
    }
  }

  /**
   * Delete review response
   */
  static async deleteResponse(id: string): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.delete<Review>(`/reviews/${id}/response`);

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      reviewsCache.clear();
      return response;
    } catch (error: unknown) {
      console.error('Failed to delete review response:', error);
      throw error;
    }
  }

  /**
   * Vote on review helpfulness
   */
  static async vote(id: string, isHelpful: boolean): Promise<Review> {
    try {
      if (!id) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.post<Review>(`/reviews/${id}/vote`, { isHelpful });

      if (!response.id) {
        throw new Error('Invalid response format: review ID is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to vote on review:', error);
      throw error;
    }
  }

  /**
   * Get review statistics
   */
  static async getStats(clinicId?: string): Promise<ReviewStats> {
    try {
      const url = clinicId ? `/reviews/stats?clinicId=${clinicId}` : '/reviews/stats';
      const response = await apiService.get<ReviewStats>(url);

      // Validate response structure
      if (typeof response.totalReviews !== 'number') {
        throw new Error('Invalid response format: stats data is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch review stats:', error);
      throw error;
    }
  }

  /**
   * Get review metrics for dashboard
   */
  static async getMetrics(clinicId?: string): Promise<ReviewMetrics[]> {
    try {
      const url = clinicId ? `/reviews/metrics?clinicId=${clinicId}` : '/reviews/metrics';
      const response = await apiService.get<ReviewMetrics[]>(url);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of metrics');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch review metrics:', error);
      throw error;
    }
  }

  /**
   * Get moderation logs for a review
   */
  static async getModerationLogs(reviewId: string): Promise<ReviewModerationLog[]> {
    try {
      if (!reviewId) {
        throw new Error('Review ID is required');
      }

      const response = await apiService.get<ReviewModerationLog[]>(
        `/reviews/${reviewId}/moderation-logs`
      );

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of moderation logs');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch moderation logs:', error);
      throw error;
    }
  }

  /**
   * Bulk actions on reviews
   */
  static async bulkAction(actionData: BulkReviewAction): Promise<Review[]> {
    try {
      if (!actionData.reviewIds?.length) {
        throw new Error('At least one review ID is required');
      }

      if (!actionData.action) {
        throw new Error('Action is required');
      }

      const response = await apiService.patch<Review[]>('/reviews/bulk-action', actionData);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format: expected array of reviews');
      }

      reviewsCache.clear();

      return response;
    } catch (error: unknown) {
      console.error('Failed to perform bulk action on reviews:', error);
      throw error;
    }
  }

  /**
   * Export reviews
   */
  static async export(
    filters: ReviewsFilters = {},
    format: 'csv' | 'excel' = 'csv'
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      params.append('format', format);

      const response = await window.fetch(
        `${environment.api.baseUrl}/reviews/export?${params.toString()}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error: unknown) {
      console.error('Failed to export reviews:', error);
      throw error;
    }
  }

  /**
   * Get pending reviews (requiring moderation)
   */
  static async getPendingReviews(): Promise<ReviewsResponse> {
    try {
      const response = await apiService.get<ReviewsResponse>('/reviews/pending');

      if (!response.reviews || !Array.isArray(response.reviews)) {
        throw new Error('Invalid response format: reviews array is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch pending reviews:', error);
      throw error;
    }
  }

  /**
   * Get flagged reviews
   */
  static async getFlaggedReviews(): Promise<ReviewsResponse> {
    try {
      const response = await apiService.get<ReviewsResponse>('/reviews/flagged');

      if (!response.reviews || !Array.isArray(response.reviews)) {
        throw new Error('Invalid response format: reviews array is missing');
      }

      return response;
    } catch (error: unknown) {
      console.error('Failed to fetch flagged reviews:', error);
      throw error;
    }
  }
}

export default ReviewsService;
