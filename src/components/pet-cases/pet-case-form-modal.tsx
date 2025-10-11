import { Divider, Form, Modal } from 'antd';
import React, { useEffect } from 'react';
import {
  CASE_PRIORITY_LABELS,
  CASE_TYPE_LABELS,
  CreatePetCaseRequest,
  UpdatePetCaseRequest,
} from '../../types/pet-cases';

import { HeartOutlined } from '@ant-design/icons';
import { usePetCases } from '../../hooks/pet-cases';
import { useMessage } from '../../hooks/use-message';
import {
  CaseActionButtonsSection,
  CaseBasicInfoSection,
  CaseDetailsSection,
} from './pet-case-form-sections';

interface PetCaseFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clinicId: string;
  editCase?: any; // ClinicPetCase
}

const PetCaseFormModal: React.FC<PetCaseFormModalProps> = ({
  visible,
  onClose,
  onSuccess,
  clinicId,
  editCase,
}) => {
  const [form] = Form.useForm();
  const { updateCase, isCreating, isUpdating } = usePetCases(clinicId);
  const { success, error: showError, warning } = useMessage();

  const isEdit = !!editCase;

  useEffect(() => {
    if (visible) {
      if (isEdit && editCase) {
        // Populate form for editing
        form.setFieldsValue({
          title: editCase.title,
          description: editCase.description,
          case_type: editCase.case_type,
          priority: editCase.priority,
          initial_symptoms: editCase.initial_symptoms?.join('\n') || '',
          notes: editCase.notes,
        });
      } else {
        // Reset form for creating
        form.resetFields();
      }
    }
  }, [visible, isEdit, editCase, form]);

  const handleSubmit = async (values: any) => {
    try {
      const caseData: CreatePetCaseRequest | UpdatePetCaseRequest = {
        title: values.title,
        description: values.description,
        case_type: values.case_type,
        priority: values.priority || 'normal',
        initial_symptoms: values.initial_symptoms
          ? values.initial_symptoms.split('\n').filter((s: string) => s.trim())
          : [],
        ...(values.notes && { notes: values.notes }),
      };

      if (isEdit && editCase) {
        await updateCase({
          caseId: editCase.id,
          updateData: caseData as UpdatePetCaseRequest,
        });
        success('Case updated successfully');
      } else {
        // For create, we need pet_id - this would come from a pet selection
        warning('Pet selection required for new cases');
        return;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      showError(`Failed to ${isEdit ? 'update' : 'create'} case: ${error.message}`);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className='flex items-center gap-2'>
          <HeartOutlined />
          {isEdit ? 'Edit Pet Case' : 'Create New Pet Case'}
        </div>
      }
      open={visible}
      onCancel={handleClose}
      width={800}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          priority: 'normal',
          case_type: 'consultation',
        }}
      >
        {/* Basic Information */}
        <CaseBasicInfoSection
          form={form}
          caseTypeLabels={CASE_TYPE_LABELS}
          casePriorityLabels={CASE_PRIORITY_LABELS}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />

        {/* Case Details */}
        <CaseDetailsSection
          form={form}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />

        <Divider />

        {/* Action Buttons */}
        <CaseActionButtonsSection
          onClose={handleClose}
          isCreating={isCreating}
          isUpdating={isUpdating}
          isEdit={isEdit}
        />
      </Form>
    </Modal>
  );
};

export default PetCaseFormModal;