import { Button, Card, Space, Statistic, Typography } from 'antd';
import {
  DownloadOutlined,
  EyeOutlined,
  FlagOutlined,
  MessageOutlined,
  PlusOutlined,
  StarOutlined,
} from '@ant-design/icons';

import type { ReviewStats } from '@/types';

const { Title } = Typography;

export interface ReviewsHeaderProps {
  stats: ReviewStats | null;
  statsLoading?: boolean;
  onNewReview?: () => void;
  onExport?: () => void;
}

const ReviewsHeader = ({ stats, statsLoading, onNewReview, onExport }: ReviewsHeaderProps) => {
  return (
    <div className='reviews-header space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <Title level={2} className='mb-2'>
            Reviews Management
          </Title>
          <p className='text-text-light'>Manage and moderate customer reviews across all clinics</p>
        </div>

        <Space>
          <div className='relative'>
            <Button icon={<DownloadOutlined />} onClick={onExport} disabled={statsLoading}>
              Export
            </Button>
            <span className='absolute -top-4 -right-4 text-xs bg-orange-100 text-orange-600 p-1 rounded-md'>
              Soon
            </span>
          </div>
          <Button type='primary' icon={<PlusOutlined />} onClick={onNewReview}>
            Add Review
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='admin-card'>
          <Statistic
            title='Total Reviews'
            value={stats?.totalReviews || 0}
            prefix={<StarOutlined />}
            loading={statsLoading}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>

        <Card className='admin-card'>
          <Statistic
            title='Average Rating'
            value={stats?.averageRating || 0}
            prefix={<StarOutlined />}
            suffix='/5'
            precision={1}
            loading={statsLoading}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>

        <Card className='admin-card'>
          <Statistic
            title='Published Reviews'
            value={stats?.publishedReviews || 0}
            prefix={<EyeOutlined />}
            loading={statsLoading}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>

        <Card className='admin-card'>
          <Statistic
            title='Flagged Reviews'
            value={stats?.flaggedReviews || 0}
            prefix={<FlagOutlined />}
            loading={statsLoading}
            valueStyle={{ color: '#f5222d' }}
          />
        </Card>

        <Card className='admin-card'>
          <Statistic
            title='Verified Reviews'
            value={stats?.verifiedReviews || 0}
            prefix={<MessageOutlined />}
            loading={statsLoading}
            valueStyle={{ color: '#13c2c2' }}
          />
        </Card>

        <Card className='admin-card'>
          <Statistic
            title='Pending Moderation'
            value={stats?.pendingReviews || 0}
            prefix={<FlagOutlined />}
            loading={statsLoading}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>

        <Card className='admin-card'>
          <Statistic
            title='1-Star Reviews'
            value={stats?.ratingDistribution?.[1] || 0}
            loading={statsLoading}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>

        <Card className='admin-card'>
          <Statistic
            title='5-Star Reviews'
            value={stats?.ratingDistribution?.[5] || 0}
            loading={statsLoading}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ReviewsHeader;
