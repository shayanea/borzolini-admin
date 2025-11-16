import { Card } from 'antd';
import React from 'react';
import type { TrainingActivity } from '@/types/training';

interface StepsCardProps {
  activity: TrainingActivity;
}

export const StepsCard: React.FC<StepsCardProps> = ({ activity }) => {
  return (
    <Card title={`Training Steps (${activity.steps.length})`}>
      <div className='space-y-4'>
        {activity.steps.map((step, index) => (
          <div key={step.id} className='border-l-4 border-primary pl-4'>
            <div className='flex items-start gap-3 mb-2'>
              <div className='flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1'>
                <span className='text-sm font-medium text-primary'>{index + 1}</span>
              </div>
              <div className='flex-1'>
                <h4 className='font-semibold'>{step.title}</h4>
                <p className='text-muted-foreground'>{step.description}</p>
              </div>
            </div>

            {step.tips && step.tips.length > 0 && (
              <div className='ml-9 space-y-1'>
                <h5 className='font-medium text-sm'>Tips:</h5>
                {step.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className='flex items-start gap-2 text-sm'>
                    <span className='text-primary font-medium'>•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

