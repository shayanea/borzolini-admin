import { useCallback, useState } from 'react';
import {
  ExerciseNeeds,
  GroomingNeeds,
  PetSize,
  PetSpecies,
  type Breed,
  type CreateBreedDto,
  type UpdateBreedDto,
} from '../../types/breeds';

interface FormErrors {
  name?: string;
  species?: string;
}

export const useBreedForm = (initialData?: Breed) => {
  const [formData, setFormData] = useState<CreateBreedDto | UpdateBreedDto>(
    initialData
      ? {
          name: initialData.name,
          species: initialData.species,
          size_category: initialData.size_category,
          temperament: initialData.temperament,
          health_risks: initialData.health_risks,
          life_expectancy_min: initialData.life_expectancy_min,
          life_expectancy_max: initialData.life_expectancy_max,
          weight_min: initialData.weight_min,
          weight_max: initialData.weight_max,
          origin_country: initialData.origin_country,
          origin_history: initialData.origin_history,
          description: initialData.description,
          image_url: initialData.image_url,
          resources: initialData.resources,
          grooming_needs: initialData.grooming_needs,
          exercise_needs: initialData.exercise_needs,
          care_specifics: initialData.care_specifics,
          average_vitals: initialData.average_vitals,
          is_active: initialData.is_active,
          is_popular: initialData.is_popular,
        }
      : {
          name: '',
          species: PetSpecies.DOG,
          size_category: undefined,
          temperament: '',
          health_risks: [],
          life_expectancy_min: undefined,
          life_expectancy_max: undefined,
          weight_min: undefined,
          weight_max: undefined,
          origin_country: '',
          origin_history: '',
          description: '',
          image_url: '',
          resources: [],
          grooming_needs: undefined,
          exercise_needs: undefined,
          care_specifics: {
            diet: '',
            housing: '',
            social_needs: '',
            common_stressors: [],
          },
          average_vitals: {
            temperature_f: { min: 0, max: 0 },
            heart_rate_bpm: { min: 0, max: 0 },
            respiratory_rate_rpm: { min: 0, max: 0 },
            weight_kg: { min: 0, max: 0 },
          },
          is_active: true,
          is_popular: false,
        }
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.species) {
      newErrors.species = 'Species is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (
      field: keyof CreateBreedDto,
      value:
        | string
        | string[]
        | number
        | boolean
        | PetSpecies
        | PetSize
        | GroomingNeeds
        | ExerciseNeeds
        | undefined
    ) => {
      setFormData((prev: CreateBreedDto | UpdateBreedDto) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors((prev: FormErrors) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (onSubmit: (data: CreateBreedDto | UpdateBreedDto) => Promise<void>) => {
      if (!validateForm()) {
        return false;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData as CreateBreedDto | UpdateBreedDto);
        return true;
      } catch (error) {
        console.error('Form submission error:', error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  const addHealthRisk = useCallback(() => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => ({
      ...prev,
      health_risks: [...(prev.health_risks || []), ''],
    }));
  }, []);

  const updateHealthRisk = useCallback((index: number, value: string) => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => ({
      ...prev,
      health_risks: (prev.health_risks || []).map((risk, i) => (i === index ? value : risk)),
    }));
  }, []);

  const deleteHealthRisk = useCallback((index: number) => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => ({
      ...prev,
      health_risks: (prev.health_risks || []).filter((_, i) => i !== index),
    }));
  }, []);

  const addResource = useCallback(() => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => ({
      ...prev,
      resources: [...(prev.resources || []), ''],
    }));
  }, []);

  const updateResource = useCallback((index: number, value: string) => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => ({
      ...prev,
      resources: (prev.resources || []).map((resource, i) => (i === index ? value : resource)),
    }));
  }, []);

  const addCommonStressor = useCallback(() => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => {
      const current = prev.care_specifics || {
        diet: '',
        housing: '',
        social_needs: '',
        common_stressors: [],
      };
      return {
        ...prev,
        care_specifics: {
          ...current,
          common_stressors: [...(current.common_stressors || []), ''],
        },
      };
    });
  }, []);

  const updateCommonStressor = useCallback((index: number, value: string) => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => {
      const current = prev.care_specifics || {
        diet: '',
        housing: '',
        social_needs: '',
        common_stressors: [],
      };
      return {
        ...prev,
        care_specifics: {
          ...current,
          common_stressors: (current.common_stressors || []).map((s, i) =>
            i === index ? value : s
          ),
        },
      };
    });
  }, []);

  const deleteCommonStressor = useCallback((index: number) => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => {
      const current = prev.care_specifics || {
        diet: '',
        housing: '',
        social_needs: '',
        common_stressors: [],
      };
      return {
        ...prev,
        care_specifics: {
          ...current,
          common_stressors: (current.common_stressors || []).filter((_, i) => i !== index),
        },
      };
    });
  }, []);

  const handleCareSpecificsChange = useCallback(
    (
      field: keyof Omit<import('../../types/breeds').CareSpecifics, 'common_stressors'>,
      value: string
    ) => {
      setFormData((prev: CreateBreedDto | UpdateBreedDto) => {
        const current = prev.care_specifics || {
          diet: '',
          housing: '',
          social_needs: '',
          common_stressors: [],
        };
        return {
          ...prev,
          care_specifics: {
            ...current,
            [field]: value,
          },
        };
      });
    },
    []
  );

  const handleAverageVitalsChange = useCallback(
    (
      category: keyof import('../../types/breeds').AverageVitals,
      field: 'min' | 'max',
      value: number | undefined
    ) => {
      setFormData((prev: CreateBreedDto | UpdateBreedDto) => {
        // Helper to ensure 'average_vitals' and the specific category exist
        const currentVitals = prev.average_vitals || {
          temperature_f: { min: 0, max: 0 },
          heart_rate_bpm: { min: 0, max: 0 },
          respiratory_rate_rpm: { min: 0, max: 0 },
          weight_kg: { min: 0, max: 0 },
        };

        const currentCategory = currentVitals[category] || { min: 0, max: 0 };

        return {
          ...prev,
          average_vitals: {
            ...currentVitals,
            [category]: {
              ...currentCategory,
              [field]: value,
            },
          },
        };
      });
    },
    []
  );

  const deleteResource = useCallback((index: number) => {
    setFormData((prev: CreateBreedDto | UpdateBreedDto) => ({
      ...prev,
      resources: (prev.resources || []).filter((_, i) => i !== index),
    }));
  }, []);

  const resetForm = useCallback((data?: Breed) => {
    setFormData(
      data
        ? {
            name: data.name,
            species: data.species,
            size_category: data.size_category,
            temperament: data.temperament,
            health_risks: data.health_risks,
            life_expectancy_min: data.life_expectancy_min,
            life_expectancy_max: data.life_expectancy_max,
            weight_min: data.weight_min,
            weight_max: data.weight_max,
            origin_country: data.origin_country,
            origin_history: data.origin_history,
            description: data.description,
            image_url: data.image_url,
            resources: data.resources,
            grooming_needs: data.grooming_needs,
            exercise_needs: data.exercise_needs,
            care_specifics: data.care_specifics,
            average_vitals: data.average_vitals,
            is_active: data.is_active,
            is_popular: data.is_popular,
          }
        : {
            name: '',
            species: PetSpecies.DOG,
            size_category: undefined,
            temperament: '',
            health_risks: [],
            life_expectancy_min: undefined,
            life_expectancy_max: undefined,
            weight_min: undefined,
            weight_max: undefined,
            origin_country: '',
            origin_history: '',
            description: '',
            image_url: '',
            resources: [],
            grooming_needs: undefined,
            exercise_needs: undefined,
            care_specifics: {
              diet: '',
              housing: '',
              social_needs: '',
              common_stressors: [],
            },
            average_vitals: {
              temperature_f: { min: 0, max: 0 },
              heart_rate_bpm: { min: 0, max: 0 },
              respiratory_rate_rpm: { min: 0, max: 0 },
              weight_kg: { min: 0, max: 0 },
            },
            is_active: true,
            is_popular: false,
          }
    );
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    addHealthRisk,
    updateHealthRisk,
    deleteHealthRisk,
    addResource,
    updateResource,
    deleteResource,
    handleSubmit,
    resetForm,
    validateForm,
    addCommonStressor,
    updateCommonStressor,
    deleteCommonStressor,
    handleCareSpecificsChange,
    handleAverageVitalsChange,
  };
};
