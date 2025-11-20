import { Card } from 'antd';
import { FC } from 'react';

import { SocialMediaFields } from '@/components/shared';

const SocialMediaStep: FC = () => {
  return (
    <Card title='Social Media' className='mb-6'>
      <SocialMediaFields />
    </Card>
  );
};

export { SocialMediaStep };
export default SocialMediaStep;