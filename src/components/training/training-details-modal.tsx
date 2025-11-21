import { Modal, Typography } from 'antd';
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

const { Text } = Typography;

interface TrainingDetailsModalProps {
  activity: TrainingActivity | null;
  open: boolean;
  onClose: () => void;
}

export function TrainingDetailsModal({
  activity,
  open,
  onClose,
}: TrainingDetailsModalProps) {
  if (!activity) return null;

  const thumbnailUrl = (activity as unknown as { thumbnailUrl?: string }).thumbnailUrl;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title='Training Activity Details'
      footer={null}
      width={1000}
    >
      <div className='space-y-6'>
        {thumbnailUrl && (
          <div>
            <Text type="secondary" className="block mb-2">Activity Preview</Text>
            <div className="mb-4">
              <img
                src={thumbnailUrl}
                alt={activity.title}
                className="max-w-full h-auto rounded-lg border object-cover"
                style={{ maxHeight: '400px' }}
                onError={(e) => {
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
    </Modal>
  );
}

