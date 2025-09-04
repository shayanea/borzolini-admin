// Pet Case Form Modal Component
import { HeartOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Row, Select, Space, message } from 'antd';
import React, { useEffect } from 'react';
import { usePetCases } from '../../hooks/use-pet-cases';
import {
  CASE_PRIORITY_LABELS,
  CASE_TYPE_LABELS,
  CreatePetCaseRequest,
  UpdatePetCaseRequest,
} from '../../types/pet-cases';

const { Option } = Select;
const { TextArea } = Input;

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
        message.success('Case updated successfully');
      } else {
        // For create, we need pet_id - this would come from a pet selection
        message.warning('Pet selection required for new cases');
        return;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(`Failed to ${isEdit ? 'update' : 'create'} case: ${error.message}`);
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
      destroyOnClose
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
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label='Case Title'
              name='title'
              rules={[{ required: true, message: 'Please enter a case title' }]}
            >
              <Input placeholder='Brief description of the case' />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label='Case Type'
              name='case_type'
              rules={[{ required: true, message: 'Please select a case type' }]}
            >
              <Select placeholder='Select case type'>
                {Object.entries(CASE_TYPE_LABELS).map(([key, label]) => (
                  <Option key={key} value={key}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label='Priority' name='priority'>
          <Select placeholder='Select priority level'>
            {Object.entries(CASE_PRIORITY_LABELS).map(([key, label]) => (
              <Option key={key} value={key}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          rules={[{ required: true, message: 'Please enter a case description' }]}
        >
          <TextArea rows={4} placeholder='Detailed description of the case and symptoms' />
        </Form.Item>

        <Form.Item
          label='Initial Symptoms (one per line)'
          name='initial_symptoms'
          help='Enter each symptom on a new line'
        >
          <TextArea
            rows={4}
            placeholder='Coughing&#10;Lethargy&#10;Loss of appetite'
          />
        </Form.Item>

        <Form.Item label='Additional Notes' name='notes'>
          <TextArea rows={3} placeholder='Any additional notes or observations' />
        </Form.Item>

        <Divider />

        <Form.Item className='mb-0 text-right'>
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={isCreating || isUpdating}>
              {isEdit ? 'Update Case' : 'Create Case'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PetCaseFormModal;
