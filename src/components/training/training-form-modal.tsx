import { Form, Modal } from 'antd';
import type { TrainingActivity } from '@/types/training';
import { TRAINING_DIFFICULTY, TRAINING_SPECIES } from '@/types/training';
import type { ReturnType } from 'react';
import type { useTrainingForm } from '@/hooks/useTraining';
import {
  BasicInfoSection,
  MediaSection,
  TagsSection,
  StepsSection,
  BenefitsSection,
  PrerequisitesSection,
  StatusSection,
} from './training-form-sections';

interface TrainingFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<boolean>;
  form: ReturnType<typeof useTrainingForm>;
  isLoading: boolean;
  isEdit?: boolean;
  activity?: TrainingActivity;
}

export function TrainingFormModal({
  open,
  onCancel,
  onSubmit,
  form,
  isLoading,
  isEdit = false,
  activity,
}: TrainingFormModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? 'Edit Training Activity' : 'Create New Training Activity'}
      footer={null}
      width={1000}
    >
      <Form layout='vertical' onFinish={onSubmit} className='space-y-6'>
        <BasicInfoSection
          form={form}
          speciesOptions={TRAINING_SPECIES}
          difficultyOptions={TRAINING_DIFFICULTY}
        />

        <MediaSection
          form={form}
          speciesOptions={TRAINING_SPECIES}
          difficultyOptions={TRAINING_DIFFICULTY}
        />

        <TagsSection
          form={form}
          speciesOptions={TRAINING_SPECIES}
          difficultyOptions={TRAINING_DIFFICULTY}
        />

        <StepsSection
          form={form}
          speciesOptions={TRAINING_SPECIES}
          difficultyOptions={TRAINING_DIFFICULTY}
        />

        <BenefitsSection
          form={form}
          speciesOptions={TRAINING_SPECIES}
          difficultyOptions={TRAINING_DIFFICULTY}
        />

        <PrerequisitesSection
          form={form}
          speciesOptions={TRAINING_SPECIES}
          difficultyOptions={TRAINING_DIFFICULTY}
        />

        <StatusSection
          form={form}
          onCancel={onCancel}
          isLoading={isLoading}
          isEdit={isEdit}
          speciesOptions={TRAINING_SPECIES}
          difficultyOptions={TRAINING_DIFFICULTY}
        />
      </Form>
    </Modal>
  );
}

