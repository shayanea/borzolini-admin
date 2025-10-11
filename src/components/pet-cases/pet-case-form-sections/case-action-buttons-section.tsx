import { Button, Space } from 'antd';
import { FC } from 'react';

import { CaseActionButtonsSectionProps } from './types';

export const CaseActionButtonsSection: FC<CaseActionButtonsSectionProps> = ({
  onClose,
  isCreating,
  isUpdating,
  isEdit,
}) => {
  return (
    <div className='text-right'>
      <Space>
        <Button onClick={onClose}>Cancel</Button>
        <Button type='primary' htmlType='submit' loading={isCreating || isUpdating}>
          {isEdit ? 'Update Case' : 'Create Case'}
        </Button>
      </Space>
    </div>
  );
};

export default CaseActionButtonsSection;
