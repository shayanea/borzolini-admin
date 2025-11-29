import type { TrainingActivity } from '@/types/training';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';

const { Text } = Typography;

interface MediaCardProps {
  activity: TrainingActivity;
}

export function MediaCard({ activity }: MediaCardProps) {
  if (!activity.video_url) return null;

  return (
    <Card title='Media Resources'>
      <div className='space-y-4'>
        {activity.video_url && (
          <div>
            <Text strong>Video Tutorial</Text>
            <div className='mt-2'>
              <Button
                type='default'
                icon={<PlayCircleOutlined />}
                href={activity.video_url}
                target='_blank'
                rel='noopener noreferrer'
              >
                Watch Video (
                {activity.video_url.length > 50
                  ? `${activity.video_url.substring(0, 50)}...`
                  : activity.video_url}
                )
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

