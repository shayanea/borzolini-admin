import { Button, Space } from 'antd';
import { FC } from 'react';

import { ActionButtonsSectionProps } from './types';

const ActionButtonsSection: FC<ActionButtonsSectionProps> = ({ 
  onCancel, 
  loading, 
  editingUser 
}) => {
  return (
    <Space className='w-full justify-end'>
      <Button onClick={onCancel}>Cancel</Button>
      <Button
        type='primary'
        htmlType='submit'
        loading={loading}
        className='bg-primary-navy border-primary-navy'
      >
        {editingUser ? 'Update User' : 'Create User'}
      </Button>
    </Space>
  );
};

export default ActionButtonsSection;
