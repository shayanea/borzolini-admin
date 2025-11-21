import { useCallback, useState } from 'react';

import TrainingService from '@/services/training';

import type {
  ApiError,
  CompleteTrainingDto,
  CreateTrainingActivityDto,
  CreateTrainingAssignmentDto,
  DailyTrainingStats,
  TrainingActivity,
  TrainingAssignment,
  TrainingHistoryResponse,
  TrainingSearchParams,
  TrainingsResponse,
  UpdateTrainingActivityDto,
} from '@/types/training';

const normalizeError = (error: unknown, fallback: string): ApiError => {
  if (error && typeof error === 'object') {
    const errObj = error as Record<string, any>;
    const message = typeof errObj.message === 'string' ? errObj.message : fallback;
    const statusCode =
      typeof errObj.statusCode === 'number'
        ? errObj.statusCode
        : typeof errObj.response?.status === 'number'
          ? errObj.response.status
          : 500;
    return {
      message,
      statusCode,
    };
  }

  return {
    message: fallback,
    statusCode: 500,
  };
};

export const useTraining = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Training Activities CRUD
  const createTrainingActivity = useCallback(
    async (data: CreateTrainingActivityDto): Promise<TrainingActivity | null> => {
      setLoading(true);
      setError(null);
      try {
        return await TrainingService.createActivity(data);
      } catch (err) {
        setError(normalizeError(err, 'Unable to create training activity'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getTrainingActivities = useCallback(async (
    page = 1, 
    limit = 10, 
    search?: string, 
    species?: string, 
    difficulty?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<TrainingsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params: TrainingSearchParams = { page, limit };
      if (search) params.q = search;
      if (species) params.species = species;
      if (difficulty) params.difficulty = difficulty as TrainingSearchParams['difficulty'];
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      return await TrainingService.getActivities(params);
    } catch (err) {
      setError(normalizeError(err, 'Unable to load training activities'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrainingActivity = useCallback(async (id: string): Promise<TrainingActivity | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.getActivity(id);
    } catch (err) {
      setError(normalizeError(err, 'Unable to fetch training activity'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTrainingActivity = useCallback(async (
    id: string, 
    data: UpdateTrainingActivityDto
  ): Promise<TrainingActivity | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.updateActivity(id, data);
    } catch (err) {
      setError(normalizeError(err, 'Unable to update training activity'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTrainingActivity = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await TrainingService.deleteActivity(id);
      return true;
    } catch (err) {
      setError(normalizeError(err, 'Unable to delete training activity'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteTrainingActivities = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(ids.map(id => TrainingService.deleteActivity(id)));
      return true;
    } catch (err) {
      setError(normalizeError(err, 'Unable to delete selected training activities'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Training Assignments
  const createTrainingAssignment = useCallback(async (
    data: CreateTrainingAssignmentDto
  ): Promise<TrainingAssignment | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.createAssignment(data);
    } catch (err) {
      setError(normalizeError(err, 'Unable to create training assignment'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeTrainingAssignment = useCallback(async (
    id: string,
    data: CompleteTrainingDto
  ): Promise<TrainingAssignment | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.completeAssignment(id, data);
    } catch (err) {
      setError(normalizeError(err, 'Unable to complete training assignment'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrainingAssignments = useCallback(async (
    limit?: number
  ): Promise<TrainingHistoryResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.getHistory(limit);
    } catch (err) {
      setError(normalizeError(err, 'Unable to load training history'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Training Statistics
  const getTrainingStats = useCallback(async (): Promise<DailyTrainingStats | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.getStats();
    } catch (err) {
      setError(normalizeError(err, 'Unable to load training stats'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTrainingActivities = useCallback(async (
    query: string,
    species?: string,
    tags?: string,
    difficulty?: string,
    page = 1,
    limit = 10
  ): Promise<TrainingsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.searchActivities({
        q: query,
        species,
        tags,
        difficulty: difficulty as TrainingSearchParams['difficulty'],
        page,
        limit,
      });
    } catch (err) {
      setError(normalizeError(err, 'Unable to search training activities'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrainingActivitiesBySpecies = useCallback(async (
    species: string,
    page = 1,
    limit = 10
  ): Promise<TrainingsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await TrainingService.getActivitiesBySpecies(species, { page, limit });
    } catch (err) {
      setError(normalizeError(err, 'Unable to fetch species specific training activities'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Training Activities
    createTrainingActivity,
    getTrainingActivities,
    getTrainingActivity,
    updateTrainingActivity,
    deleteTrainingActivity,
    bulkDeleteTrainingActivities,
    
    // Training Assignments
    createTrainingAssignment,
    completeTrainingAssignment,
    getTrainingAssignments,
    
    // Statistics
    getTrainingStats,
    
    // Search & Filters
    searchTrainingActivities,
    getTrainingActivitiesBySpecies,
    
    loading,
    error,
    clearError: () => setError(null),
  };
};

export const useTrainingForm = (initialData?: TrainingActivity) => {
  const [formData, setFormData] = useState<CreateTrainingActivityDto | UpdateTrainingActivityDto>(
    initialData 
      ? {
          title: initialData.title,
          description: initialData.description,
          species: initialData.species,
          difficulty: initialData.difficulty,
          durationMinutes: initialData.durationMinutes,
          tags: initialData.tags,
          videoUrl: initialData.videoUrl || '',
          thumbnailUrl: initialData.thumbnailUrl || '',
          steps: initialData.steps,
          benefits: initialData.benefits,
          prerequisites: initialData.prerequisites || [],
          isActive: initialData.isActive,
        }
      : {
          title: '',
          description: '',
          species: [],
          difficulty: 'easy' as const,
          durationMinutes: 0,
          tags: [],
          videoUrl: '',
          thumbnailUrl: '',
          steps: [],
          benefits: [],
          prerequisites: [],
          isActive: true,
        }
  );

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<any[]>([]);

  const validateForm = useCallback((): boolean => {
    const newErrors: any = {};
    const newStepErrors: any[] = [];

    // Basic field validation
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.species || formData.species.length === 0) {
      newErrors.species = 'At least one species is required';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty level is required';
    }

    if (!formData.durationMinutes || formData.durationMinutes <= 0) {
      newErrors.durationMinutes = 'Duration must be greater than 0';
    }

    if (!formData.steps || formData.steps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }

    if (!formData.benefits || formData.benefits.length === 0) {
      newErrors.benefits = 'At least one benefit is required';
    }

    // Step validation
    if (formData.steps) {
      formData.steps.forEach((step, index) => {
        const stepError: any = {};
        if (!step.title?.trim()) {
          stepError.title = 'Step title is required';
        }
        if (!step.description?.trim()) {
          stepError.description = 'Step description is required';
        }
        if (stepError.title || stepError.description) {
          newStepErrors[index] = stepError;
        }
      });
    }

    setErrors(newErrors);
    setStepErrors(newStepErrors);
    
    return Object.keys(newErrors).length === 0 && newStepErrors.length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof CreateTrainingActivityDto, value: any) => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const addStep = useCallback(() => {
    const newStep = {
      id: Date.now().toString(),
      title: '',
      description: '',
      order: (formData.steps?.length || 0) + 1,
      tips: [],
    };
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      steps: [...(prev.steps || []), newStep],
    }));
  }, [formData.steps?.length]);

  const updateStep = useCallback((stepIndex: number, field: string, value: any) => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      steps: (prev.steps || []).map((step, index) => 
        index === stepIndex 
          ? { ...step, [field]: value, order: index + 1 }
          : step
      ),
    }));

    // Clear step error
    setStepErrors(prev => {
      const newErrors = [...prev];
      if (newErrors[stepIndex]) {
        newErrors[stepIndex] = { ...newErrors[stepIndex], [field]: undefined };
        if (Object.keys(newErrors[stepIndex]).length === 0) {
          newErrors[stepIndex] = undefined;
        }
      }
      return newErrors.filter(Boolean);
    });
  }, []);

  const deleteStep = useCallback((stepIndex: number) => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      steps: (prev.steps || []).filter((_, index) => index !== stepIndex).map((step, index) => ({
        ...step,
        order: index + 1,
      })),
    }));

    // Remove step error
    setStepErrors(prev => prev.filter((_, index) => index !== stepIndex));
  }, []);

  const moveStep = useCallback((stepIndex: number, direction: 'up' | 'down') => {
    if (!formData.steps) return;
    const newSteps = [...formData.steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
      
      // Update orders
      newSteps.forEach((step, index) => {
        step.order = index + 1;
      });
      
      setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
        ...prev,
        steps: newSteps,
      }));
    }
  }, [formData.steps]);

  const addBenefit = useCallback(() => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      benefits: [...(prev.benefits || []), ''],
    }));
  }, []);

  const updateBenefit = useCallback((index: number, value: string) => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      benefits: (prev.benefits || []).map((benefit, i) => i === index ? value : benefit),
    }));
  }, []);

  const deleteBenefit = useCallback((index: number) => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index),
    }));
  }, []);

  const addPrerequisite = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...(prev.prerequisites || []), ''],
    }));
  }, []);

  const updatePrerequisite = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: (prev.prerequisites || []).map((prereq, i) => i === index ? value : prereq),
    }));
  }, []);

  const deletePrerequisite = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: (prev.prerequisites || []).filter((_, i) => i !== index),
    }));
  }, []);

  const addTag = useCallback(() => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      tags: [...(prev.tags || []), ''],
    }));
  }, []);

  const updateTag = useCallback((index: number, value: string) => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      tags: (prev.tags || []).map((tag, i) => i === index ? value : tag),
    }));
  }, []);

  const deleteTag = useCallback((index: number) => {
    setFormData((prev: CreateTrainingActivityDto | UpdateTrainingActivityDto) => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(async (onSubmit: (data: CreateTrainingActivityDto | UpdateTrainingActivityDto) => Promise<void>) => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as CreateTrainingActivityDto | UpdateTrainingActivityDto);
      return true;
    } catch (error) {
      console.error('Training form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const resetForm = useCallback((data?: TrainingActivity) => {
    setFormData(
      data 
        ? {
            title: data.title,
            description: data.description,
            species: data.species,
            difficulty: data.difficulty,
            durationMinutes: data.durationMinutes,
            tags: data.tags,
            videoUrl: data.videoUrl || '',
            thumbnailUrl: data.thumbnailUrl || '',
            steps: data.steps,
            benefits: data.benefits,
            prerequisites: data.prerequisites || [],
            isActive: data.isActive,
          }
        : {
            title: '',
            description: '',
            species: [],
            difficulty: 'easy' as const,
            durationMinutes: 0,
            tags: [],
            videoUrl: '',
            thumbnailUrl: '',
            steps: [],
            benefits: [],
            prerequisites: [],
            isActive: true,
          }
    );
    setErrors({});
    setStepErrors([]);
  }, []);

  return {
    formData,
    errors,
    stepErrors,
    isSubmitting,
    handleInputChange,
    addStep,
    updateStep,
    deleteStep,
    moveStep,
    addBenefit,
    updateBenefit,
    deleteBenefit,
    addPrerequisite,
    updatePrerequisite,
    deletePrerequisite,
    addTag,
    updateTag,
    deleteTag,
    handleSubmit,
    resetForm,
    validateForm,
  };
};
