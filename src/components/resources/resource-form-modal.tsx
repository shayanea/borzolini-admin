import { Modal } from 'antd';
import React from 'react';
import type { ReturnType } from 'react';
import type { useResourceForm } from '@/hooks/useResourceForm';
import type { Resource } from '@/types/resources';
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

export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({
  open,
  onCancel,
  onSubmit,
  form,
  isLoading,
  isEdit = false,
  resource,
}) => {
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
};

