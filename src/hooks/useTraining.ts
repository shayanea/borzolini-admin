import { useState, useCallback } from 'react';
import { api } from '../services/api/core';
import type { 
  TrainingActivity, 
  TrainingAssignment, 
  DailyTrainingStats,
  CreateTrainingActivityDto, 
  UpdateTrainingActivityDto,
  CreateTrainingAssignmentDto,
  CompleteTrainingDto,
  TrainingsResponse,
  TrainingResponse,
  TrainingStatsResponse,
  TrainingHistoryResponse,
  ApiError
} from '../types/training';

export const useTraining = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Training Activities CRUD
  const createTrainingActivity = useCallback(async (data: CreateTrainingActivityDto): Promise<TrainingActivity | null> => {
    setLoading(true);
    setError(null);
    try {
      // Note: API doesn't have create endpoint, this would need to be added
      // For now, return null and log error
      console.warn('Create training activity endpoint not available in API');
      setError({ message: 'Create endpoint not available', statusCode: 501 });
      return null;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (species) params.append('species', species);
      if (difficulty) params.append('difficulty', difficulty);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await api.get<{ activities: TrainingActivity[]; total: number; page: number; totalPages: number }>(`/training/admin/activities?${params.toString()}`);
      return {
        data: response.data.activities,
        total: response.data.total,
        page: response.data.page,
        limit,
      };
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrainingActivity = useCallback(async (id: string): Promise<TrainingActivity | null> => {
    setLoading(true);
    setError(null);
    try {
      // Use search endpoint to find by ID or get from activities list
      const activitiesResponse = await getTrainingActivities(1, 100);
      if (activitiesResponse) {
        const activity = activitiesResponse.data.find(a => a.id === id);
        if (activity) return activity;
      }
      return null;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getTrainingActivities]);

  const updateTrainingActivity = useCallback(async (
    id: string, 
    data: UpdateTrainingActivityDto
  ): Promise<TrainingActivity | null> => {
    setLoading(true);
    setError(null);
    try {
      // Note: API doesn't have update endpoint, this would need to be added
      console.warn('Update training activity endpoint not available in API');
      setError({ message: 'Update endpoint not available', statusCode: 501 });
      return null;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTrainingActivity = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Note: API doesn't have delete endpoint, this would need to be added
      console.warn('Delete training activity endpoint not available in API');
      setError({ message: 'Delete endpoint not available', statusCode: 501 });
      return false;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteTrainingActivities = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Delete activities one by one since API doesn't have bulk delete
      await Promise.all(ids.map(id => deleteTrainingActivity(id)));
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [deleteTrainingActivity]);

  // Training Assignments
  const createTrainingAssignment = useCallback(async (
    data: CreateTrainingAssignmentDto
  ): Promise<TrainingAssignment | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<TrainingResponse>('/training/daily', data);
      return response.data.data as unknown as TrainingAssignment;
    } catch (err) {
      setError(err as ApiError);
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
      const response = await api.patch<TrainingResponse>(`/training/daily/${id}/complete`, data);
      return response.data.data as unknown as TrainingAssignment;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrainingAssignments = useCallback(async (
    userId: string,
    page = 1,
    limit = 10,
    status?: string
  ): Promise<TrainingHistoryResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append('status', status);

      const response = await api.get<TrainingHistoryResponse>(`/training/history/${userId}?${params.toString()}`);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Training Statistics
  const getTrainingStats = useCallback(async (userId: string): Promise<DailyTrainingStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<TrainingStatsResponse>(`/training/stats/${userId}`);
      return response.data.data;
    } catch (err) {
      setError(err as ApiError);
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
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (species) params.append('species', species);
      if (tags) params.append('tags', tags);
      if (difficulty) params.append('difficulty', difficulty);

      const response = await api.get<TrainingsResponse>(`/training/search?${params.toString()}`);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
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
      const params = new URLSearchParams({
        species,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await api.get<TrainingsResponse>(`/training/by-species?${params.toString()}`);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
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
