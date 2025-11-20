import { CASE_PRIORITIES, getCasePriorityOptions, getCaseTypeOptions } from '@/constants/pet-cases';
import {
  CaseActionButtonsSection,
  CaseBasicInfoSection,
  CaseDetailsSection,
} from './pet-case-form-sections';
import { CreatePetCaseRequest, UpdatePetCaseRequest } from '../../types/pet-cases';
import { Divider, Form, Modal } from 'antd';
import { useEffect } from 'react';

import { HeartOutlined } from '@ant-design/icons';
import { useMessage } from '../../hooks/use-message';
import { usePetCases } from '../../hooks/pet-cases';
import { useTranslation } from 'react-i18next';

interface PetCaseFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clinicId: string;
  editCase?: any; // ClinicPetCase
}

function PetCaseFormModal({
  visible,
  onClose,
  onSuccess,
  clinicId,
  editCase,
}: PetCaseFormModalProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation('components');
  const { updateCase, isCreating, isUpdating } = usePetCases(clinicId);
  const { success, error: showError, warning } = useMessage();

  const isEdit = !!editCase;

  // Get case options from constants
  const caseTypeOptions = getCaseTypeOptions();
  const casePriorityOptions = getCasePriorityOptions();

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
        priority: values.priority || CASE_PRIORITIES.NORMAL,
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
          {isEdit ? t('forms.petCaseForm.modalTitleEdit') : t('forms.petCaseForm.modalTitle')}
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
          priority: CASE_PRIORITIES.NORMAL,
          case_type: 'consultation',
        }}
      >
        {/* Basic Information */}
        <CaseBasicInfoSection
          form={form}
          caseTypeLabels={Object.fromEntries(
            caseTypeOptions.map(option => [option.value, option.label])
          )}
          casePriorityLabels={Object.fromEntries(
            casePriorityOptions.map(option => [option.value, option.label])
          )}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />

        {/* Case Details */}
        <CaseDetailsSection form={form} isCreating={isCreating} isUpdating={isUpdating} />

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
}

export { PetCaseFormModal };
export default PetCaseFormModal;
