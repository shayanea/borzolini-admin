import { Modal } from 'antd';
import type { ReturnType } from 'react';
import type { useBreedForm } from '@/hooks/breeds';
import type { Breed } from '@/types/breeds';
import { BreedForm } from './breed-form';

interface BreedFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<boolean>;
  form: ReturnType<typeof useBreedForm>;
  isLoading: boolean;
  isEdit?: boolean;
  breed?: Breed | null;
}

export function BreedFormModal({
  open,
  onCancel,
  onSubmit,
  form,
  isLoading,
  isEdit = false,
  breed,
}: BreedFormModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? 'Edit Breed' : 'Create New Breed'}
      footer={null}
      width={900}
    >
      <BreedForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        breed={breed}
        onCancel={onCancel}
      />
    </Modal>
  );
}

