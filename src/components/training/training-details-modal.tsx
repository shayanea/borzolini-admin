import { Modal } from 'antd';
import React from 'react';
import type { TrainingActivity } from '@/types/training';
import {
  BasicInfoCard,
  StepsCard,
  BenefitsCard,
  PrerequisitesCard,
  MediaCard,
  TagsCard,
  MetadataCard,
} from './training-details-sections';

interface TrainingDetailsModalProps {
  activity: TrainingActivity | null;
  open: boolean;
  onClose: () => void;
}

export const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({
  activity,
  open,
  onClose,
}) => {
  if (!activity) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title='Training Activity Details'
      footer={null}
      width={1000}
    >
      <div className='space-y-6'>
        <BasicInfoCard activity={activity} />
        <StepsCard activity={activity} />
        <BenefitsCard activity={activity} />
        <PrerequisitesCard activity={activity} />
        <MediaCard activity={activity} />
        <TagsCard activity={activity} />
        <MetadataCard activity={activity} />
      </div>
    </Modal>
  );
};

