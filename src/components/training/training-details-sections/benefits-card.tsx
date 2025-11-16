import { Card } from 'antd';
import React from 'react';
import type { TrainingActivity } from '@/types/training';

interface BenefitsCardProps {
  activity: TrainingActivity;
}

export const BenefitsCard: React.FC<BenefitsCardProps> = ({ activity }) => {
  if (activity.benefits.length === 0) return null;

  return (
    <Card title='Benefits'>
      <div className='space-y-2'>
        {activity.benefits.map((benefit, index) => (
          <div key={index} className='flex items-start gap-2'>
            <div className='flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5'>
              <span className='text-xs font-medium text-green-800'>✅</span>
            </div>
            <p className='text-sm'>{benefit}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

