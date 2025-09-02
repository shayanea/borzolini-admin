// Review Types
export interface Review {
  id: string;
  userId: string;
  clinicId: string;
  appointmentId?: string;
  rating: number; // 1-5 stars
  comment: string;
  isPublished: boolean;
  isVerified: boolean; // Review from actual patient/customer
  response?: ReviewResponse;
  helpfulVotes: number;
  totalVotes: number;
  createdAt: string;
  updatedAt: string;

  // Additional user info for display
  userName?: string;
  userEmail?: string;
  clinicName?: string;
  appointmentDate?: string;

  // Admin properties
  isAdminView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  requiresModeration?: boolean;
  flagged?: boolean;
  flagReason?: string;
  tagSoon?: boolean; // Mark review as needing attention soon
}

export interface ReviewResponse {
  id: string;
  responseText: string;
  respondedBy: string; // User ID of staff/admin who responded
  respondedByName: string;
  respondedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  publishedReviews: number;
  pendingReviews: number;
  flaggedReviews: number;
  verifiedReviews: number;
}

export interface CreateReviewData {
  userId: string;
  clinicId: string;
  appointmentId?: string;
  rating: number;
  comment: string;
  isPublished?: boolean;
  isVerified?: boolean;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  isPublished?: boolean;
  isVerified?: boolean;
  flagged?: boolean;
  flagReason?: string;
  tagSoon?: boolean;
}

export interface CreateReviewResponseData {
  responseText: string;
}

export interface UpdateReviewResponseData {
  responseText: string;
}

export interface ReviewsFilters {
  page?: number;
  limit?: number;
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
  search?: string;
  sortBy?: 'createdAt' | 'rating' | 'helpfulVotes' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  dateRange?: [Date | null, Date | null]; // For date picker component
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: ReviewStats;
}

export interface ReviewVote {
  id: string;
  reviewId: string;
  userId: string;
  isHelpful: boolean;
  createdAt: string;
}

export interface BulkReviewAction {
  reviewIds: string[];
  action: 'publish' | 'unpublish' | 'delete' | 'flag' | 'unflag' | 'verify' | 'unverify';
  reason?: string;
}

export interface ReviewModerationLog {
  id: string;
  reviewId: string;
  action: string;
  performedBy: string;
  performedByName: string;
  reason?: string;
  oldData?: Partial<Review>;
  newData?: Partial<Review>;
  performedAt: string;
}

// Utility Types
export type ReviewStatus = 'pending' | 'published' | 'flagged' | 'hidden';
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface ReviewMetrics {
  clinicId: string;
  clinicName: string;
  totalReviews: number;
  averageRating: number;
  ratingTrend: 'up' | 'down' | 'stable';
  responseRate: number; // Percentage of reviews with responses
  verifiedPercentage: number;
  recentReviews: Review[];
  topPositiveAspects: string[];
  topImprovementAreas: string[];
}
