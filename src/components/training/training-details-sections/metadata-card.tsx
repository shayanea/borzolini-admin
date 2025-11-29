import { formatDate } from '@/lib/utils';
import type { TrainingActivity } from '@/types/training';
import { Card, Typography } from 'antd';

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
          <div className='font-medium'>{formatDate(activity.created_at)}</div>
        </div>
        <div>
          <Text type='secondary'>Updated</Text>
          <div className='font-medium'>{formatDate(activity.updated_at)}</div>
        </div>
      </div>
    </Card>
  );
}

