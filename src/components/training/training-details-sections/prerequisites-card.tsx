import { Card } from 'antd';
import React from 'react';
import type { TrainingActivity } from '@/types/training';

interface PrerequisitesCardProps {
  activity: TrainingActivity;
}

export const PrerequisitesCard: React.FC<PrerequisitesCardProps> = ({ activity }) => {
  if (!activity.prerequisites || activity.prerequisites.length === 0) return null;

  return (
    <Card title='Prerequisites'>
      <div className='space-y-2'>
        {activity.prerequisites.map((prereq, index) => (
          <div key={index} className='flex items-start gap-2'>
            <div className='flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5'>
              <span className='text-xs font-medium text-blue-800'>📚</span>
            </div>
            <p className='text-sm'>{prereq}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

