import { Badge, Card, Space } from 'antd';
import type { TrainingActivity } from '@/types/training';

interface TagsCardProps {
  activity: TrainingActivity;
}

export function TagsCard({ activity }: TagsCardProps) {
  if (activity.tags.length === 0) return null;

  return (
    <Card title={`Tags (${activity.tags.length})`}>
      <Space size='small' wrap>
        {activity.tags.map((tag, index) => (
          <Badge key={index} text={tag} />
        ))}
      </Space>
    </Card>
  );
}

