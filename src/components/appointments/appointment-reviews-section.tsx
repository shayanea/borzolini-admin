import { EyeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Rate, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { ReviewsService } from '@/services/reviews';
import type { Review } from '@/types';

const { Text, Paragraph } = Typography;

export interface AppointmentReviewsSectionProps {
  appointmentId: string;
  appointmentType: string;
  isHomeVisit: boolean;
  onViewReview?: (reviewId: string) => void;
}

export function AppointmentReviewsSection({
  appointmentId,
  // appointmentType,
  isHomeVisit,
  onViewReview,
}: AppointmentReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewsData = await ReviewsService.getByAppointment(appointmentId);
      setReviews(reviewsData);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    if (appointmentId) {
      fetchReviews();
    }
  }, [appointmentId, fetchReviews]);

  const getReviewTypeColor = (review: Review) => {
    if (review.flagged) return 'red';
    if (!review.isPublished) return 'orange';
    if (review.isVerified) return 'green';
    return 'blue';
  };

  const getReviewTypeText = (review: Review) => {
    if (review.flagged) return 'Flagged';
    if (!review.isPublished) return 'Unpublished';
    if (review.isVerified) return 'Verified';
    return 'Published';
  };

  if (loading) {
    return (
      <Card title='Reviews' size='small' className='mt-4'>
        <div className='text-center py-4'>
          <Text type='secondary'>Loading reviews...</Text>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title='Reviews' size='small' className='mt-4'>
        <div className='text-center py-4'>
          <Text type='danger'>{error}</Text>
          <br />
          <Button size='small' onClick={fetchReviews} className='mt-2'>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className='flex items-center justify-between'>
          <span>Reviews</span>
          {isHomeVisit && (
            <Tag color='blue' className='ml-2'>
              Home Visit
            </Tag>
          )}
        </div>
      }
      size='small'
      className='mt-4'
    >
      {reviews.length === 0 ? (
        <Empty
          description={
            <div className='text-center'>
              <Text type='secondary'>
                {isHomeVisit
                  ? 'No reviews yet for this home visit'
                  : 'No reviews yet for this appointment'}
              </Text>
              <br />
              <Text type='secondary' className='text-xs'>
                {isHomeVisit
                  ? 'Pet owner will be prompted to leave a review after completion'
                  : 'Reviews help other pet owners make informed decisions'}
              </Text>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className='space-y-3'>
          {reviews.map(review => (
            <div key={review.id} className='border rounded-lg p-3 bg-gray-50'>
              <div className='flex items-start justify-between mb-2'>
                <div className='flex items-center space-x-2'>
                  <Rate disabled value={review.rating} className='text-sm' />
                  <Text strong>{review.rating}/5</Text>
                  <Tag color={getReviewTypeColor(review)}>{getReviewTypeText(review)}</Tag>
                </div>
                <div className='flex items-center space-x-1'>
                  {review.helpfulVotes > 0 && (
                    <div className='flex items-center space-x-1'>
                      <StarOutlined className='text-xs text-yellow-600' />
                      <Text type='secondary' className='text-xs'>
                        {review.helpfulVotes} helpful
                      </Text>
                    </div>
                  )}
                  {review.response && (
                    <div className='flex items-center space-x-1'>
                      <MessageOutlined className='text-xs text-green-600' />
                      <Text type='secondary' className='text-xs'>
                        Responded
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                className='text-sm mb-2'
              >
                {review.comment}
              </Paragraph>

              <div className='flex items-center justify-between text-xs text-gray-500'>
                <span>
                  {review.userName || 'Anonymous'} •{' '}
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <Button
                  type='link'
                  size='small'
                  icon={<EyeOutlined />}
                  onClick={() => onViewReview?.(review.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
