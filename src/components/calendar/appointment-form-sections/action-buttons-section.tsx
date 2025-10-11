import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';

import { ActionButtonsSectionProps } from './types';

export const ActionButtonsSection: FC<ActionButtonsSectionProps> = ({
  onCancel,
  onSubmit,
  loading,
}) => {
  return (
    <div className='flex justify-end space-x-2 mt-6'>
      <Button onClick={onCancel}>Cancel</Button>
      <Button
        type='primary'
        icon={<SaveOutlined />}
        onClick={onSubmit}
        loading={loading}
        className='bg-primary-navy border-primary-navy'
      >
        Update Appointment
      </Button>
    </div>
  );
};

export default ActionButtonsSection;
