import { Badge, Space, Typography } from 'antd';
import { ClockCircleOutlined, ExperimentOutlined } from '@ant-design/icons';
import type { TrainingActivity } from '@/types/training';
import { getDifficultyColor, getSpeciesIcon } from '../training-utils';

const { Title, Text } = Typography;

interface BasicInfoCardProps {
  activity: TrainingActivity;
}

export function BasicInfoCard({ activity }: BasicInfoCardProps) {
  return (
    <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg'>
      <div className='text-4xl flex-shrink-0'>
        <ExperimentOutlined className='text-4xl text-blue-600' />
      </div>
      <div className='flex-1'>
        <Title level={3}>{activity.title}</Title>
        <Text type='secondary' className='block mb-4'>
          {activity.description}
        </Text>

        <Space size='small' wrap className='mb-4'>
          <Badge color={getDifficultyColor(activity.difficulty)} text={activity.difficulty} />
          <Space size='small'>
            <ClockCircleOutlined />
            <span>{activity.durationMinutes} minutes</span>
          </Space>
          <Badge
            color={activity.isActive ? 'success' : 'default'}
            text={activity.isActive ? 'Active' : 'Draft'}
          />
        </Space>

        <Space size='small' wrap>
          {activity.species.map(species => (
            <Badge key={species} text={`${getSpeciesIcon(species)} ${species}`} />
          ))}
        </Space>
      </div>
    </div>
  );
}

