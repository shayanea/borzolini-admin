import { BaseModal } from '@/components/common';
import type { TrainingActivity } from '@/types/training';
import { Typography } from 'antd';
import {
    BasicInfoCard,
    BenefitsCard,
    MediaCard,
    MetadataCard,
    PrerequisitesCard,
    StepsCard,
    TagsCard,
} from './training-details-sections';

const { Text } = Typography;

interface TrainingDetailsModalProps {
  activity: TrainingActivity | null;
  open: boolean;
  onClose: () => void;
}

export function TrainingDetailsModal({ activity, open, onClose }: TrainingDetailsModalProps) {
  if (!activity) {
    return null;
  }

  const thumbnailUrl = activity.thumbnailUrl;

  return (
    <BaseModal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title='Training Activity Details'
      footer={null}
      width={1000}
    >
      <div className='space-y-6'>
        {thumbnailUrl && (
          <div>
            <Text type='secondary' className='block mb-2'>
              Activity Preview
            </Text>
            <div className='mb-4'>
              <img
                src={thumbnailUrl}
                alt={activity.title}
                className='max-w-full h-auto rounded-lg border object-cover'
                style={{ maxHeight: '400px' }}
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
        <BasicInfoCard activity={activity} />
        <StepsCard activity={activity} />
        <BenefitsCard activity={activity} />
        <PrerequisitesCard activity={activity} />
        <MediaCard activity={activity} />
        <TagsCard activity={activity} />
        <MetadataCard activity={activity} />
      </div>
    </BaseModal>
  );
}
