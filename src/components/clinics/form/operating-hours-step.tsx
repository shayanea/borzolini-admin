import { Card } from 'antd';
import { FC } from 'react';

import { OperatingHoursFields, DayOfWeek } from '@/components/shared';

interface OperatingHoursStepProps {
  daysOfWeek: DayOfWeek[];
}

const OperatingHoursStep: FC<OperatingHoursStepProps> = ({ daysOfWeek }) => {
  return (
    <Card title='Operating Hours' className='mb-6'>
      <OperatingHoursFields daysOfWeek={daysOfWeek} />
    </Card>
  );
};

export default OperatingHoursStep;