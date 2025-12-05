import { useFilterManagement } from '@/hooks/common/use-filter-management';
import ReviewsService, {
    type CreateReviewData,
    type CreateReviewResponseData,
    type UpdateReviewData,
    type UpdateReviewResponseData,
} from '@/services/reviews';
import { useAuthStore } from '@/stores/auth.store';
import type { Review, ReviewMetrics, ReviewStats } from '@/types';
import type { ReviewsFilters } from '@/types/reviews';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  searchText: string;
  filters: ReviewsFilters;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  stats: ReviewStats | null;
  statsLoading: boolean;
  metrics: ReviewMetrics[];
  metricsLoading: boolean;
  pendingReviews: Review[];
  pendingLoading: boolean;
  flaggedReviews: Review[];
  flaggedLoading: boolean;
  handleSearch: (value: string) => void;
  handleFilters: (filters: Partial<ReviewsFilters>) => void;
  handlePagination: (page: number, pageSize: number) => void;
  handleExport: () => Promise<void>;
  handleNewReview: (data: CreateReviewData) => Promise<Review>;
  handleEditReview: (id: string, data: UpdateReviewData) => Promise<Review>;
  handleDeleteReview: (id: string) => Promise<void>;
  handlePublishReview: (id: string) => Promise<Review>;
  handleUnpublishReview: (id: string) => Promise<Review>;
  handleFlagReview: (id: string, reason?: string) => Promise<Review>;
  handleUnflagReview: (id: string) => Promise<Review>;
  handleVerifyReview: (id: string) => Promise<Review>;
  handleAddResponse: (id: string, data: CreateReviewResponseData) => Promise<Review>;
  handleUpdateResponse: (id: string, data: UpdateReviewResponseData) => Promise<Review>;
  handleDeleteResponse: (id: string) => Promise<Review>;
  handleVote: (id: string, isHelpful: boolean) => Promise<Review>;

  refreshReviews: () => void;
  refreshStats: () => void;
  refreshMetrics: () => void;
  refreshPending: () => void;
  refreshFlagged: () => void;
  clearError: () => void;
}

export const useReviews = (): UseReviewsReturn => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Use the shared filter management hook
  const {
    filters,
    setFilters,
    searchText,
    handleSearch: onSearch,
  } = useFilterManagement<ReviewsFilters>({
    initialFilters: {},
    resetToPage1: () => setPagination(prev => ({ ...prev, current: 1 })),
  });

  // Get authentication state from the store
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const queryClient = useQueryClient();

  // Convert filters to API format
  const getApiFilters = useCallback(() => {
    const apiFilters: ReviewsFilters = { ...filters };
    if (filters.dateFrom) {
      apiFilters.date_from = filters.dateFrom;
    }
    if (filters.dateTo) {
      apiFilters.date_to = filters.dateTo;
    }
    // Include search text in filters if set
    if (searchText) {
      apiFilters.search = searchText;
    }
    return apiFilters;
  }, [filters, searchText]);

  // Query for reviews
  const {
    data: reviewsData,
    isLoading: loading,
    error: queryError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['reviews', filters, searchText, pagination.current, pagination.pageSize],
    queryFn: async () => {
      if (!isAuthenticated) return { reviews: [], total: 0, totalPages: 0 };

      const apiFilters = getApiFilters();
      const response = await ReviewsService.getAll({
        ...apiFilters,
        page: pagination.current,
        limit: pagination.pageSize,
      });

      // Update pagination total
      setPagination(prev => ({ ...prev, total: response.total }));

      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query for review stats
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      return await ReviewsService.getStats();
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for review metrics
  const {
    data: metrics = [],
    isLoading: metricsLoading,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ['review-metrics'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      return await ReviewsService.getMetrics();
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query for pending reviews
  const {
    data: pendingData,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      if (!isAuthenticated) return { reviews: [], total: 0, totalPages: 0 };
      return await ReviewsService.getPendingReviews();
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for flagged reviews
  const {
    data: flaggedData,
    isLoading: flaggedLoading,
    refetch: refetchFlagged,
  } = useQuery({
    queryKey: ['flagged-reviews'],
    queryFn: async () => {
      if (!isAuthenticated) return { reviews: [], total: 0, totalPages: 0 };
      return await ReviewsService.getFlaggedReviews();
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createReviewMutation = useMutation({
    mutationFn: ReviewsService.create,
    onSuccess: () => {
      message.success('Review created successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create review';
      message.error(errorMessage);
      throw error;
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
      ReviewsService.update(id, data),
    onSuccess: () => {
      message.success('Review updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update review';
      message.error(errorMessage);
      throw error;
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: ReviewsService.delete,
    onSuccess: () => {
      message.success('Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete review';
      message.error(errorMessage);
      throw error;
    },
  });

  const publishReviewMutation = useMutation({
    mutationFn: ReviewsService.publish,
    onSuccess: () => {
      message.success('Review published successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish review';
      message.error(errorMessage);
      throw error;
    },
  });

  const unpublishReviewMutation = useMutation({
    mutationFn: ReviewsService.unpublish,
    onSuccess: () => {
      message.success('Review unpublished successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unpublish review';
      message.error(errorMessage);
      throw error;
    },
  });

  const flagReviewMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ReviewsService.flag(id, reason),
    onSuccess: () => {
      message.success('Review flagged successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to flag review';
      message.error(errorMessage);
      throw error;
    },
  });

  const unflagReviewMutation = useMutation({
    mutationFn: ReviewsService.unflag,
    onSuccess: () => {
      message.success('Review unflagged successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unflag review';
      message.error(errorMessage);
      throw error;
    },
  });

  const verifyReviewMutation = useMutation({
    mutationFn: ReviewsService.verify,
    onSuccess: () => {
      message.success('Review verified successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify review';
      message.error(errorMessage);
      throw error;
    },
  });

  const addResponseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateReviewResponseData }) =>
      ReviewsService.addResponse(id, data),
    onSuccess: () => {
      message.success('Response added successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add response';
      message.error(errorMessage);
      throw error;
    },
  });

  const updateResponseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewResponseData }) =>
      ReviewsService.updateResponse(id, data),
    onSuccess: () => {
      message.success('Response updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update response';
      message.error(errorMessage);
      throw error;
    },
  });

  const deleteResponseMutation = useMutation({
    mutationFn: ReviewsService.deleteResponse,
    onSuccess: () => {
      message.success('Response deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete response';
      message.error(errorMessage);
      throw error;
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ id, isHelpful }: { id: string; isHelpful: boolean }) =>
      ReviewsService.vote(id, isHelpful),
    onSuccess: (_, { isHelpful }) => {
      const voteText = isHelpful ? 'marked as helpful' : 'marked as not helpful';
      message.success(`Review ${voteText}`);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to vote on review';
      message.error(errorMessage);
      throw error;
    },
  });

  const handleSearch = useCallback((value: string) => {
    onSearch(value);
  }, [onSearch]);

  const handleFilters = useCallback((newFilters: Partial<ReviewsFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handlePagination = useCallback((page: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize,
    }));
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const apiFilters = getApiFilters();
      const blob = await ReviewsService.exportToCSV(apiFilters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('Reviews exported successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      message.error(errorMessage);
      throw error;
    }
  }, [getApiFilters]);

  const handleNewReview = useCallback(
    async (data: CreateReviewData): Promise<Review> => {
      return await createReviewMutation.mutateAsync(data);
    },
    [createReviewMutation]
  );

  const handleEditReview = useCallback(
    async (id: string, data: UpdateReviewData): Promise<Review> => {
      return await updateReviewMutation.mutateAsync({ id, data });
    },
    [updateReviewMutation]
  );

  const handleDeleteReview = useCallback(
    async (id: string): Promise<void> => {
      await deleteReviewMutation.mutateAsync(id);
    },
    [deleteReviewMutation]
  );

  const handlePublishReview = useCallback(
    async (id: string): Promise<Review> => {
      return await publishReviewMutation.mutateAsync(id);
    },
    [publishReviewMutation]
  );

  const handleUnpublishReview = useCallback(
    async (id: string): Promise<Review> => {
      return await unpublishReviewMutation.mutateAsync(id);
    },
    [unpublishReviewMutation]
  );

  const handleFlagReview = useCallback(
    async (id: string, reason?: string): Promise<Review> => {
      return await flagReviewMutation.mutateAsync({ id, reason });
    },
    [flagReviewMutation]
  );

  const handleUnflagReview = useCallback(
    async (id: string): Promise<Review> => {
      return await unflagReviewMutation.mutateAsync(id);
    },
    [unflagReviewMutation]
  );

  const handleVerifyReview = useCallback(
    async (id: string): Promise<Review> => {
      return await verifyReviewMutation.mutateAsync(id);
    },
    [verifyReviewMutation]
  );

  const handleAddResponse = useCallback(
    async (id: string, data: CreateReviewResponseData): Promise<Review> => {
      return await addResponseMutation.mutateAsync({ id, data });
    },
    [addResponseMutation]
  );

  const handleUpdateResponse = useCallback(
    async (id: string, data: UpdateReviewResponseData): Promise<Review> => {
      return await updateResponseMutation.mutateAsync({ id, data });
    },
    [updateResponseMutation]
  );

  const handleDeleteResponse = useCallback(
    async (id: string): Promise<Review> => {
      return await deleteResponseMutation.mutateAsync(id);
    },
    [deleteResponseMutation]
  );

  const handleVote = useCallback(
    async (id: string, isHelpful: boolean): Promise<Review> => {
      return await voteMutation.mutateAsync({ id, isHelpful });
    },
    [voteMutation]
  );

  const refreshReviews = useCallback(() => {
    refetchReviews();
  }, [refetchReviews]);

  const refreshStats = useCallback(() => {
    refetchStats();
  }, [refetchStats]);

  const refreshMetrics = useCallback(() => {
    refetchMetrics();
  }, [refetchMetrics]);

  const refreshPending = useCallback(() => {
    refetchPending();
  }, [refetchPending]);

  const refreshFlagged = useCallback(() => {
    refetchFlagged();
  }, [refetchFlagged]);

  const clearError = useCallback(() => {
    // React Query handles errors automatically
  }, []);

  // Extract and validate data from queries
  const reviews = (reviewsData?.reviews || []).map(review => ({
    ...review,
    rating: review.rating || 1,
    comment: review.comment || '',
    isPublished: review.isPublished ?? false,
    isVerified: review.isVerified ?? false,
    helpfulVotes: review.helpfulVotes || 0,
    totalVotes: review.totalVotes || 0,
    createdAt: review.createdAt || new Date().toISOString(),
    updatedAt: review.updatedAt || new Date().toISOString(),
  }));

  const pendingReviews = pendingData?.reviews || [];
  const flaggedReviews = flaggedData?.reviews || [];

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : 'An error occurred'
    : null;

  return {
    reviews,
    loading,
    error,
    searchText,
    filters,
    pagination,
    stats: stats || null,
    statsLoading,
    metrics,
    metricsLoading,
    pendingReviews,
    pendingLoading,
    flaggedReviews,
    flaggedLoading,
    handleSearch,
    handleFilters,
    handlePagination,
    handleExport,
    handleNewReview,
    handleEditReview,
    handleDeleteReview,
    handlePublishReview,
    handleUnpublishReview,
    handleFlagReview,
    handleUnflagReview,
    handleVerifyReview,
    handleAddResponse,
    handleUpdateResponse,
    handleDeleteResponse,
    handleVote,

    refreshReviews,
    refreshStats,
    refreshMetrics,
    refreshPending,
    refreshFlagged,
    clearError,
  };
};
