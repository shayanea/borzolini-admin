import { Form, Input } from 'antd';
import { FC } from 'react';

import { PhotoStatusSectionProps } from './types';

const PhotoStatusSection: FC<PhotoStatusSectionProps> = () => {
  return (
    <div className='mb-6'>
      <Form.Item
        name='photo_url'
        label='Photo URL'
        rules={[{ max: 500, message: 'Photo URL must be less than 500 characters' }]}
      >
        <Input placeholder='Photo URL' maxLength={500} />
      </Form.Item>
    </div>
  );
};

export default PhotoStatusSection;
