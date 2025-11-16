import { Button, Card, Space, Typography } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import React from 'react';
import type { TrainingActivity } from '@/types/training';

const { Text } = Typography;

interface MediaCardProps {
  activity: TrainingActivity;
}

export const MediaCard: React.FC<MediaCardProps> = ({ activity }) => {
  if (!activity.videoUrl && !activity.thumbnailUrl) return null;

  return (
    <Card title='Media Resources'>
      <div className='space-y-4'>
        {activity.videoUrl && (
          <div>
            <Text strong>Video Tutorial</Text>
            <div className='mt-2'>
              <Button
                type='default'
                icon={<PlayCircleOutlined />}
                href={activity.videoUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Watch Video (
                {activity.videoUrl.length > 50
                  ? `${activity.videoUrl.substring(0, 50)}...`
                  : activity.videoUrl}
                )
              </Button>
            </div>
          </div>
        )}

        {activity.thumbnailUrl && (
          <div>
            <Text strong>Activity Preview</Text>
            <div className='mt-2'>
              <img
                src={activity.thumbnailUrl}
                alt='Training preview'
                className='max-w-md h-32 object-cover rounded-lg border'
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

