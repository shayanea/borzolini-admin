/* eslint-env browser */

import type { CreatePetData, Pet, UpdatePetData } from '@/services/pets';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, message as antMessage } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { PetsService } from '@/services/pets';
import type { PetFormData } from '@/types';
import dayjs from 'dayjs';

interface UsePetFormReturn {
  form: ReturnType<typeof Form.useForm<PetFormData>>[0];
  isEditing: boolean;
  loading: boolean;
  loadingPet: boolean;
  pet: Pet | null;
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
}

export const usePetForm = (): UsePetFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<PetFormData>();
  const queryClient = useQueryClient();

  const isEditing = !!id;

  const { data: pet, isLoading: loadingPet } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => PetsService.getPetById(id!),
    enabled: isEditing,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePetData) => PetsService.createPet(data),
    onSuccess: () => {
      antMessage.success('Pet created successfully');
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      navigate(ROUTES.PETS);
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error('Error creating pet:', error);
      antMessage.error('Failed to create pet');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ petId, data }: { petId: string; data: UpdatePetData }) =>
      PetsService.updatePet(petId, data),
    onSuccess: () => {
      antMessage.success('Pet updated successfully');
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['pet', id] });
      }
      navigate(ROUTES.PETS);
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error('Error updating pet:', error);
      antMessage.error('Failed to update pet');
    },
  });

  const loading = useMemo(
    () => createMutation.isPending || updateMutation.isPending,
    [createMutation.isPending, updateMutation.isPending]
  );

  if (pet && isEditing) {
    // Initialize form values for edit mode
    form.setFieldsValue({
      name: pet.name,
      owner_id: pet.owner_id,
      species: pet.species,
      breed: pet.breed,
      gender: pet.gender,
      date_of_birth: pet.date_of_birth ? (dayjs(pet.date_of_birth) as unknown as string) : '',
      weight: pet.weight,
      size: pet.size,
      color: pet.color,
      microchip_number: pet.microchip_number,
      is_spayed_neutered: pet.is_spayed_neutered,
      is_vaccinated: pet.is_vaccinated,
      medical_history: pet.medical_history,
      behavioral_notes: pet.behavioral_notes,
      dietary_requirements: pet.dietary_requirements,
      allergies: pet.allergies,
      medications: pet.medications,
      emergency_contact: pet.emergency_contact,
      emergency_phone: pet.emergency_phone,
      photo_url: pet.photo_url,
      is_active: pet.is_active,
    } as PetFormData);
  }

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();

      // Transform form values to API-compatible format
      const apiData = {
        ...values,
        date_of_birth:
          values.date_of_birth && dayjs.isDayjs(values.date_of_birth)
            ? values.date_of_birth.format('YYYY-MM-DD')
            : values.date_of_birth,
        weight: values.weight ? String(values.weight) : '',
        allergies: values.allergies || [],
        medications: values.medications || [],
        is_spayed_neutered: Boolean(values.is_spayed_neutered),
        is_vaccinated: Boolean(values.is_vaccinated),
        is_active: typeof values.is_active === 'boolean' ? values.is_active : true,
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({ petId: id, data: apiData as UpdatePetData });
      } else {
        await createMutation.mutateAsync(apiData as CreatePetData);
      }
    } catch {
      // AntD handles field-level validation errors
    }
  };

  const handleCancel = (): void => {
    navigate(ROUTES.PETS);
  };

  return {
    form,
    isEditing,
    loading,
    loadingPet,
    pet: pet ?? null,
    handleSubmit,
    handleCancel,
  };
};

export default usePetForm;
