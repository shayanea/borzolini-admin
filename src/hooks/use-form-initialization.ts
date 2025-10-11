import { FormInstance } from 'antd';
import { useEffect } from 'react';

/**
 * Options for form initialization
 */
interface UseFormInitializationOptions<T> {
  /**
   * Whether the modal is visible
   */
  isVisible: boolean;
  /**
   * Form instance from antd
   */
  form: FormInstance;
  /**
   * Editing entity (null for create mode)
   */
  editingEntity: T | null;
  /**
   * Function to transform editing entity to form values
   */
  transformToFormValues?: (entity: T) => Record<string, any>;
  /**
   * Default values for create mode
   */
  defaultValues?: Record<string, any>;
  /**
   * Callback when form is initialized
   */
  onInitialized?: (isEditMode: boolean) => void;
}

/**
 * Custom hook to handle form initialization logic
 * Reduces repetition across form modals
 *
 * @param options - Configuration options
 */
export const useFormInitialization = <T>({
  isVisible,
  form,
  editingEntity,
  transformToFormValues,
  defaultValues = {},
  onInitialized,
}: UseFormInitializationOptions<T>): { isEditMode: boolean } => {
  const isEditMode = !!editingEntity;

  useEffect(() => {
    if (isVisible) {
      if (editingEntity) {
        // Edit mode: populate form with existing entity data
        const formValues = transformToFormValues
          ? transformToFormValues(editingEntity)
          : (editingEntity as Record<string, any>);

        form.setFieldsValue(formValues);
      } else {
        // Create mode: reset form and apply default values
        form.resetFields();
        if (Object.keys(defaultValues).length > 0) {
          form.setFieldsValue(defaultValues);
        }
      }

      // Call optional callback
      if (onInitialized) {
        onInitialized(isEditMode);
      }
    }
  }, [
    isVisible,
    editingEntity,
    form,
    transformToFormValues,
    defaultValues,
    onInitialized,
    isEditMode,
  ]);

  return { isEditMode };
};

/**
 * Hook to handle form cancellation with cleanup
 */
interface UseFormCancellationOptions {
  form: FormInstance;
  onCancel: () => void;
  onCleanup?: () => void;
}

export const useFormCancellation = ({ form, onCancel, onCleanup }: UseFormCancellationOptions) => {
  const handleCancel = () => {
    form.resetFields();
    if (onCleanup) {
      onCleanup();
    }
    onCancel();
  };

  return { handleCancel };
};
