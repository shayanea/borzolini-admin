import { Alert, Empty, Modal } from 'antd';
import type { CreateReviewData, UpdateReviewData } from '@/services/reviews.service';
import { ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import {
  ReviewsFilters,
  ReviewsFormModal,
  ReviewsHeader,
  ReviewsResponseModal,
  ReviewsTable,
} from '@/components/reviews';

import ErrorBoundary from '@/components/common/error-boundary';
import LoadingSpinner from '@/components/common/loading-spinner';
import type { Review } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { useReviews } from '@/hooks/use-reviews';
import { useState } from 'react';

const Reviews = () => {
  const { isAuthenticated } = useAuthStore();

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [respondingReview, setRespondingReview] = useState<Review | null>(null);

  const {
    reviews,
    loading,
    error,
    filters,
    pagination,
    stats,
    statsLoading,

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

    clearError,
  } = useReviews();

  // Show loading spinner for initial load
  if (loading && reviews.length === 0) {
    return <LoadingSpinner fullScreen text='Loading reviews...' />;
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-primary-dark'>
        <div className='text-center text-white'>
          <LockOutlined className='text-6xl mb-4 text-primary-orange' />
          <h1 className='text-2xl font-bold mb-2'>Authentication Required</h1>
          <p className='text-lg text-gray-300 mb-6'>Please log in to view and manage reviews.</p>
          <p className='text-sm text-gray-400'>
            You will be redirected to the login page automatically.
          </p>
        </div>
      </div>
    );
  }

  const handleNewReviewClick = () => {
    setEditingReview(null);
    setFormModalVisible(true);
  };

  const handleEditReviewClick = async (id: string): Promise<Review> => {
    const review = reviews.find(r => r.id === id);
    if (review) {
      setEditingReview(review);
      setFormModalVisible(true);
      // Return the review for the expected return type
      return review;
    }
    throw new Error('Review not found');
  };

  const handleFormModalSubmit = async (
    data: CreateReviewData | UpdateReviewData
  ): Promise<Review> => {
    let result: Review;
    if (editingReview) {
      result = await handleEditReview(editingReview.id, data as UpdateReviewData);
    } else {
      result = await handleNewReview(data as CreateReviewData);
    }
    setFormModalVisible(false);
    setEditingReview(null);
    return result;
  };

  const handleFormModalCancel = () => {
    setFormModalVisible(false);
    setEditingReview(null);
  };

  const handleResponseClick = (id: string) => {
    const review = reviews.find(r => r.id === id);
    if (review) {
      setRespondingReview(review);
      setResponseModalVisible(true);
    }
  };

  const handleResponseModalSubmit = async (
    id: string,
    data: { responseText: string }
  ): Promise<Review> => {
    let result: Review;
    if (respondingReview?.response) {
      result = await handleUpdateResponse(id, data);
    } else {
      result = await handleAddResponse(id, data);
    }
    setResponseModalVisible(false);
    setRespondingReview(null);
    return result;
  };

  const handleResponseModalCancel = () => {
    setResponseModalVisible(false);
    setRespondingReview(null);
  };

  const handleDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: 'Delete Review',
      content: 'Are you sure you want to delete this review? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDeleteReview(id),
    });
  };

  const handlePublishClick = async (id: string) => {
    try {
      await handlePublishReview(id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUnpublishClick = async (id: string) => {
    try {
      await handleUnpublishReview(id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleFlagClick = async (id: string) => {
    try {
      await handleFlagReview(id, 'Flagged for moderation');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUnflagClick = async (id: string) => {
    try {
      await handleUnflagReview(id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleVerifyClick = async (id: string) => {
    try {
      await handleVerifyReview(id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <ErrorBoundary>
      <div className='space-y-6'>
        {/* Error Alert */}
        {error && (
          <Alert
            message='Error Loading Reviews'
            description={error}
            type='error'
            showIcon
            icon={<ExclamationCircleOutlined />}
            closable
            onClose={clearError}
            className='mb-4'
          />
        )}

        {/* Page Header */}
        <ReviewsHeader
          stats={stats}
          statsLoading={statsLoading}
          onNewReview={handleNewReviewClick}
          onExport={handleExport}
        />

        {/* Filters */}
        <ReviewsFilters
          filters={filters}
          onFiltersChange={handleFilters}
          onClearFilters={() => handleFilters({})}
          loading={loading}
        />

        {/* Reviews Table */}
        {reviews.length > 0 ? (
          <ReviewsTable
            reviews={reviews}
            loading={loading}
            pagination={pagination}
            onEdit={handleEditReviewClick}
            onDelete={handleDeleteConfirm}
            onPublish={handlePublishClick}
            onUnpublish={handleUnpublishClick}
            onFlag={handleFlagClick}
            onUnflag={handleUnflagClick}
            onVerify={handleVerifyClick}
            onAddResponse={handleResponseClick}
            onPagination={handlePagination}
          />
        ) : !loading ? (
          <Empty description='No reviews found' className='my-12' />
        ) : null}

        {/* Loading indicator for subsequent loads */}
        {loading && reviews.length > 0 && (
          <div className='text-center py-4'>
            <LoadingSpinner size='small' text='Updating reviews...' />
          </div>
        )}

        {/* Review Form Modal */}
        <ReviewsFormModal
          visible={formModalVisible}
          loading={loading}
          review={editingReview}
          onSubmit={handleFormModalSubmit}
          onCancel={handleFormModalCancel}
        />

        {/* Response Modal */}
        <ReviewsResponseModal
          visible={responseModalVisible}
          loading={loading}
          review={respondingReview}
          onSubmit={handleResponseModalSubmit}
          onCancel={handleResponseModalCancel}
        />
      </div>
    </ErrorBoundary>
  );
};

export { Reviews };
export default Reviews;
