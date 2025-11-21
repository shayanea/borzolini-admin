import { Avatar, Button, Rate, Space, Table, Tag, Tooltip, Typography } from 'antd';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FlagOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import type { Review } from '@/types';
import type { UpdateReviewData } from '@/services/reviews';
import { useTranslation } from 'react-i18next';

const { Paragraph } = Typography;

export interface ReviewsTableProps {
  reviews: Review[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (id: string, data: UpdateReviewData) => Promise<Review>;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onFlag: (id: string) => void;
  onUnflag: (id: string) => void;
  onVerify: (id: string) => void;
  onAddResponse: (id: string) => void;
  onPagination?: (page: number, pageSize: number) => void;
}

const ReviewsTable = ({
  reviews,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onFlag,
  onUnflag,
  onVerify,
  onAddResponse,
  onPagination,
}: ReviewsTableProps) => {
  const { t } = useTranslation('components');
  const createActionHandlers = (review: Review) => {
    const handleEdit = () => {
      const updateData: UpdateReviewData = {
        rating: review.rating,
        comment: review.comment,
        isPublished: review.isPublished,
        isVerified: review.isVerified,
      };
      onEdit(review.id, updateData);
    };

    const handleDelete = () => onDelete(review.id);
    const handlePublish = () => onPublish(review.id);
    const handleUnpublish = () => onUnpublish(review.id);
    const handleFlag = () => onFlag(review.id);
    const handleUnflag = () => onUnflag(review.id);
    const handleVerify = () => onVerify(review.id);
    const handleAddResponse = () => onAddResponse(review.id);

    return {
      handleEdit,
      handleDelete,
      handlePublish,
      handleUnpublish,
      handleFlag,
      handleUnflag,
      handleVerify,
      handleAddResponse,
    };
  };

  const getStatusColor = (review: Review) => {
    if (review.flagged) return 'red';
    if (!review.isPublished) return 'orange';
    if (review.isVerified) return 'green';
    return 'blue';
  };

  const getStatusText = (review: Review) => {
    if (review.flagged) return t('reviewsTable.flagged');
    if (!review.isPublished) return t('reviewsTable.unpublished');
    if (review.isVerified) return t('reviewsTable.verified');
    return t('reviewsTable.published');
  };

  const columns: ColumnsType<Review> = [
    {
      title: t('reviewsTable.userClinic'),
      key: 'user_clinic',
      width: 280,
      render: (review: Review) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <div className='font-medium'>
              {review.userName || review.userId || t('reviewsTable.unknownUser')}
            </div>
            <div className='text-sm text-text-light'>
              {review.clinicName || review.clinicId || t('reviewsTable.unknownClinic')}
            </div>
            {review.appointmentDate && (
              <div className='text-xs text-text-light'>
                {new Date(review.appointmentDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('reviewsTable.ratingComment'),
      key: 'rating_comment',
      width: 300,
      render: (review: Review) => (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Rate disabled value={review.rating} className='text-sm' />
            <span className='text-sm font-medium'>{review.rating}/5</span>
          </div>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
            className='text-sm text-text-light mb-0'
          >
            {review.comment}
          </Paragraph>
        </div>
      ),
    },
    {
      title: t('reviewsTable.status'),
      key: 'status',
      width: 150,
      render: (review: Review) => (
        <div className='space-y-1'>
          <Tag bordered={false} color={getStatusColor(review)}>{getStatusText(review)}</Tag>
          {review.response && (
            <div className='flex items-center space-x-1'>
              <MessageOutlined className='text-xs text-green-600' />
              <span className='text-xs text-green-600'>{t('reviewsTable.responded')}</span>
            </div>
          )}
          {review.helpfulVotes > 0 && (
            <div className='flex items-center space-x-1'>
              <StarOutlined className='text-xs text-yellow-600' />
              <span className='text-xs text-yellow-600'>
                {review.helpfulVotes} {t('reviewsTable.helpful')}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('reviewsTable.date'),
      key: 'date',
      width: 120,
      render: (review: Review) => (
        <div className='text-sm'>
          <div className='font-medium'>{new Date(review.createdAt).toLocaleDateString()}</div>
          <div className='text-text-light'>{new Date(review.createdAt).toLocaleTimeString()}</div>
        </div>
      ),
    },
    {
      title: t('reviewsTable.actions'),
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (review: Review) => {
        const handlers = createActionHandlers(review);

        return (
          <Space size='small'>
            <Tooltip title={t('reviewsTable.editReview')}>
              <Button
                type='text'
                icon={<EditOutlined />}
                onClick={handlers.handleEdit}
                size='small'
              />
            </Tooltip>

            {review.isPublished ? (
              <Tooltip title={t('reviewsTable.unpublishReview')}>
                <Button
                  type='text'
                  icon={<EyeInvisibleOutlined />}
                  onClick={handlers.handleUnpublish}
                  size='small'
                  danger
                />
              </Tooltip>
            ) : (
              <Tooltip title={t('reviewsTable.publishReview')}>
                <Button
                  type='text'
                  icon={<EyeOutlined />}
                  onClick={handlers.handlePublish}
                  size='small'
                  className='text-green-600'
                />
              </Tooltip>
            )}

            {review.flagged ? (
              <Tooltip title={t('reviewsTable.unflagReview')}>
                <Button
                  type='text'
                  icon={<WarningOutlined />}
                  onClick={handlers.handleUnflag}
                  size='small'
                  className='text-orange-600'
                />
              </Tooltip>
            ) : (
              <Tooltip title={t('reviewsTable.flagReview')}>
                <Button
                  type='text'
                  icon={<FlagOutlined />}
                  onClick={handlers.handleFlag}
                  size='small'
                  danger
                />
              </Tooltip>
            )}

            {!review.isVerified && (
              <Tooltip title={t('reviewsTable.verifyReview')}>
                <Button
                  type='text'
                  icon={<CheckCircleOutlined />}
                  onClick={handlers.handleVerify}
                  size='small'
                  className='text-blue-600'
                />
              </Tooltip>
            )}

            {!review.response && (
              <Tooltip title={t('reviewsTable.addResponse')}>
                <Button
                  type='text'
                  icon={<MessageOutlined />}
                  onClick={handlers.handleAddResponse}
                  size='small'
                  className='text-purple-600'
                />
              </Tooltip>
            )}

            <Tooltip title={t('reviewsTable.deleteReview')}>
              <Button
                type='text'
                icon={<DeleteOutlined />}
                onClick={handlers.handleDelete}
                size='small'
                danger
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const tablePagination: TablePaginationConfig = {
    ...pagination,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      t('reviewsTable.showTotal', { start: range[0], end: range[1], total }),
    position: ['bottomCenter'],
    onChange: (page, pageSize) => {
      onPagination?.(page, pageSize);
    },
  };

  return (
    <div className='reviews-table'>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey='id'
        loading={loading}
        pagination={tablePagination}
        scroll={{ x: 1200 }}
        size='middle'
        className='admin-table'
      />
    </div>
  );
};

export { ReviewsTable };
export default ReviewsTable;
