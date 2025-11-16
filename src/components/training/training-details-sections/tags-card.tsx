import { Badge, Card, Space } from 'antd';
import React from 'react';
import type { TrainingActivity } from '@/types/training';

interface TagsCardProps {
  activity: TrainingActivity;
}

export const TagsCard: React.FC<TagsCardProps> = ({ activity }) => {
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
};

