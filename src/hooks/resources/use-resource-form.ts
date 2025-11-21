import { useCallback, useState } from 'react';
import { ResourceType, type CreateResourceDto, type Resource, type UpdateResourceDto } from '../../types/resources';

interface FormErrors {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
}

export const useResourceForm = (initialData?: Resource) => {
  const [formData, setFormData] = useState<CreateResourceDto | UpdateResourceDto>(
    initialData 
      ? {
          type: initialData.type,
          title: initialData.title,
          description: initialData.description,
          url: initialData.url,
          cover: initialData.cover,
          is_active: initialData.is_active,
        }
      : {
          type: ResourceType.VIDEO,
          title: '',
          description: '',
          url: '',
          cover: '',
          is_active: true,
        }
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.url?.trim()) {
      newErrors.url = 'URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof CreateResourceDto, value: string | string[]) => {
    setFormData((prev: CreateResourceDto | UpdateResourceDto) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (onSubmit: (data: CreateResourceDto | UpdateResourceDto) => Promise<void>) => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as CreateResourceDto | UpdateResourceDto);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const resetForm = useCallback((data?: Resource) => {
    setFormData(
      data 
        ? {
            type: data.type,
            title: data.title,
            description: data.description,
            url: data.url,
            cover: data.cover,
            is_active: data.is_active,
          }
        : {
            type: ResourceType.VIDEO,
            title: '',
            description: '',
            url: '',
            cover: '',
            is_active: true,
          }
    );
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    validateForm,
  };
};
