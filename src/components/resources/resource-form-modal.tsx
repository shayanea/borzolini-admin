import type { useResourceForm } from '@/hooks/resources';
import type { Resource } from '@/types/resources';
import { Modal } from 'antd';
import { ResourceForm } from './resource-form';

interface ResourceFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<boolean>;
  form: ReturnType<typeof useResourceForm>;
  isLoading: boolean;
  isEdit?: boolean;
  resource?: Resource | null;
}

export function ResourceFormModal({
  open,
  onCancel,
  onSubmit,
  form,
  isLoading,
  isEdit = false,
  resource,
}: ResourceFormModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? 'Edit Resource' : 'Create New Resource'}
      footer={null}
      width={800}
    >
      <ResourceForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        resource={resource}
        onCancel={onCancel}
      />
    </Modal>
  );
}

