import { Badge, Card, Typography } from 'antd';
import type { TrainingActivity } from '@/types/training';
import { formatDate } from '@/lib/utils';

const { Text } = Typography;

interface MetadataCardProps {
  activity: TrainingActivity;
}

export function MetadataCard({ activity }: MetadataCardProps) {
  return (
    <Card title='Activity Information'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
        <div>
          <Text type='secondary'>Created</Text>
          <div className='font-medium'>{formatDate(activity.createdAt)}</div>
        </div>
        <div>
          <Text type='secondary'>Updated</Text>
          <div className='font-medium'>{formatDate(activity.updatedAt)}</div>
        </div>
        <div>
          <Text type='secondary'>Status</Text>
          <div>
            <Badge
              color={activity.isActive ? 'success' : 'default'}
              text={activity.isActive ? 'Published' : 'Draft'}
            />
          </div>
        </div>
        <div>
          <Text type='secondary'>Total Steps</Text>
          <div className='font-medium'>{activity.steps.length}</div>
        </div>
      </div>
    </Card>
  );
}

