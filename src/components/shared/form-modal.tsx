import { FC, ReactNode } from 'react';
import { Form, FormInstance, Modal, Typography } from 'antd';

import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface FormModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  /**
   * Modal title
   */
  title: string;
  /**
   * Form instance
   */
  form: FormInstance;
  /**
   * Whether the form is in edit mode
   */
  isEditMode?: boolean;
  /**
   * Loading state for submission
   */
  loading?: boolean;
  /**
   * Modal width
   */
  width?: number;
  /**
   * Form children/content
   */
  children: ReactNode;
  /**
   * Initial form values
   */
  initialValues?: Record<string, any>;
  /**
   * Form layout
   */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /**
   * Whether to show footer (OK/Cancel buttons)
   * If false, you need to provide custom buttons in children
   */
  showFooter?: boolean;
  /**
   * OK button text
   */
  okText?: string;
  /**
   * Cancel button text
   */
  cancelText?: string;
  /**
   * Additional modal class name
   */
  className?: string;
  /**
   * Additional form class name
   */
  formClassName?: string;
  /**
   * Callback when form is submitted
   */
  onSubmit: (values: any) => void | Promise<void>;
  /**
   * Callback when modal is cancelled
   */
  onCancel: () => void;
  /**
   * Whether to destroy form when hidden
   */
  destroyOnHidden?: boolean;
}

/**
 * Reusable form modal wrapper component
 * Reduces boilerplate code for creating form modals
 */
const FormModal: FC<FormModalProps> = ({
  visible,
  title,
  form,
  isEditMode = false,
  loading = false,
  width = 600,
  children,
  initialValues,
  layout = 'vertical',
  showFooter = true,
  okText,
  cancelText,
  className,
  formClassName,
  onSubmit,
  onCancel,
  destroyOnHidden = true,
}) => {
  const { t } = useTranslation('components');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      // Form validation errors are handled automatically by antd
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const defaultOkText =
    okText ?? (isEditMode ? t('forms.common.update') : t('forms.common.create'));
  const defaultCancelText = cancelText ?? t('forms.common.cancel');

  return (
    <Modal
      title={<Title level={4}>{title}</Title>}
      open={visible}
      onCancel={handleCancel}
      onOk={showFooter ? handleSubmit : undefined}
      confirmLoading={loading}
      width={width}
      destroyOnHidden={destroyOnHidden}
      okText={defaultOkText}
      cancelText={defaultCancelText}
      footer={showFooter ? undefined : null}
      className={className}
    >
      <Form
        form={form}
        layout={layout}
        onFinish={onSubmit}
        initialValues={initialValues}
        className={formClassName}
      >
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
