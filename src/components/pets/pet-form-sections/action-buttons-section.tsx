import { Button, Space } from 'antd';
import { FC } from 'react';

import { ActionButtonsSectionProps } from './types';

const ActionButtonsSection: FC<ActionButtonsSectionProps> = ({ onCancel, loading, editingPet }) => {
  return (
    <Space className='w-full justify-end'>
      <Button onClick={onCancel}>Cancel</Button>
      <Button
        type='primary'
        htmlType='submit'
        loading={loading}
        className='bg-primary-navy border-primary-navy'
      >
        {editingPet ? 'Update Pet' : 'Add Pet'}
      </Button>
    </Space>
  );
};

export default ActionButtonsSection;
