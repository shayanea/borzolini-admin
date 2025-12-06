import type { TrainingActivity } from '@/types/training';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';

const { Text } = Typography;

interface MediaCardProps {
  activity: TrainingActivity;
}

export function MediaCard({ activity }: MediaCardProps) {
  const videoUrl = activity.videoUrl || activity.video_url;
  const thumbnailUrl = activity.thumbnailUrl || activity.thumbnail_url;

  if (!videoUrl && !thumbnailUrl) {
    return null;
  }

  return (
    <Card title='Media Resources'>
      <div className='space-y-4'>
        {thumbnailUrl && (
          <div>
            <Text strong>Thumbnail</Text>
            <div className='mt-2'>
              <img
                src={thumbnailUrl}
                alt={activity.title}
                className='max-w-full h-auto rounded-lg border object-cover'
                style={{ maxHeight: '200px' }}
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
        {videoUrl && (
          <div>
            <Text strong>Video Tutorial</Text>
            <div className='mt-2'>
              <Button
                type='default'
                icon={<PlayCircleOutlined />}
                href={videoUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Watch Video ({videoUrl.length > 50 ? `${videoUrl.substring(0, 50)}...` : videoUrl})
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
