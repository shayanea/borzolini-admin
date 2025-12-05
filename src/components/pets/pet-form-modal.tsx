import { COMMON_BREEDS, PET_GENDERS, PET_SIZES, PET_SPECIES } from '@/constants/pets';
import { useDistinctAllergies, useDistinctMedications } from '@/hooks/pets';
import type { PetFormData, PetFormModalProps } from '@/types';
import { Form } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
    ActionButtonsSection,
    BasicInfoSection,
    CareInfoSection,
    EmergencyContactSection,
    MedicalInfoSection,
    PhotoStatusSection,
} from './pet-form-sections';

import { FormModal } from '@/components/shared/form-modal';
import { usePetOwners } from '@/hooks/pets';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const PetFormModal = ({
  isVisible,
  editingPet,
  loading,
  onCancel,
  onSubmit,
}: PetFormModalProps) => {
  const { t } = useTranslation('components');
  const [form] = Form.useForm();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const { data: allergyOptions = [] } = useDistinctAllergies();
  const { data: medicationOptions = [] } = useDistinctMedications();
  const { data: owners = [], isLoading: loadingOwners } = usePetOwners();

  // Using species, genders, and sizes from constants
  const petSpecies = Object.values(PET_SPECIES);
  const genders = Object.values(PET_GENDERS);
  const sizes = Object.values(PET_SIZES);

  useEffect(() => {
    if (isVisible) {
      if (editingPet) {
        form.setFieldsValue({
          name: editingPet.name,
          owner_id: editingPet.owner_id,
          species: editingPet.species,
          breed: editingPet.breed,
          gender: editingPet.gender,
          date_of_birth: editingPet.date_of_birth ? dayjs(editingPet.date_of_birth) : null,
          weight: editingPet.weight,
          size: editingPet.size,
          color: editingPet.color,
          microchip_number: editingPet.microchip_number,
          is_spayed_neutered: editingPet.is_spayed_neutered,
          is_vaccinated: editingPet.is_vaccinated,
          medical_history: editingPet.medical_history,
          behavioral_notes: editingPet.behavioral_notes,
          dietary_requirements: editingPet.dietary_requirements,
          allergies: editingPet.allergies,
          medications: editingPet.medications,
          emergency_contact: editingPet.emergency_contact,
          emergency_phone: editingPet.emergency_phone,
          photo_url: editingPet.photo_url,
        });
        setSelectedSpecies(editingPet.species);
      } else {
        form.resetFields();
        setSelectedSpecies('');
      }
    }
  }, [editingPet, form, isVisible]);

  useEffect(() => {
    // Use static breeds data
    if (selectedSpecies) {
      setBreeds(COMMON_BREEDS[selectedSpecies] || []);
    } else {
      setBreeds([]);
    }
  }, [selectedSpecies]);

  const handleSubmit = useCallback(
    (values: Record<string, any>) => {
      // Transform form data to match API expectations
      const transformedValues = {
        ...values,
        // Convert dayjs object to ISO string
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : '',
        // Convert weight string to number
        weight: values.weight ? parseFloat(values.weight).toString() : '',
        // Ensure arrays are properly formatted
        allergies: values.allergies || [],
        medications: values.medications || [],
        // Ensure boolean values are properly set
        is_spayed_neutered: Boolean(values.is_spayed_neutered),
        is_vaccinated: Boolean(values.is_vaccinated),
      } as PetFormData;

      onSubmit(transformedValues);
    },
    [onSubmit]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setSelectedSpecies('');
    onCancel();
  }, [form, onCancel]);

  const handleSpeciesChange = (value: string) => {
    setSelectedSpecies(value);
    form.setFieldsValue({ breed: undefined }); // Reset breed when species changes
  };

  return (
    <FormModal
      visible={isVisible}
      title={editingPet ? t('modals.petForm.titleEdit') : t('modals.petForm.titleAdd')}
      form={form}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      loading={loading}
      isEditMode={!!editingPet}
      width={700}
      showFooter={false}
      initialValues={{
        is_spayed_neutered: false,
        is_vaccinated: false,
        allergies: [],
        medications: [],
      }}
    >
      {/* Basic Information */}
      <BasicInfoSection
        form={form}
        petSpecies={petSpecies}
        breeds={breeds}
        genders={genders}
        sizes={sizes}
        selectedSpecies={selectedSpecies}
        onSpeciesChange={handleSpeciesChange}
        owners={owners}
        loadingOwners={loadingOwners}
      />

      {/* Medical Information */}
      <MedicalInfoSection form={form} editingPet={editingPet} />

      {/* Care Information */}
      <CareInfoSection
        form={form}
        allergyOptions={allergyOptions}
        medicationOptions={medicationOptions}
      />

      {/* Emergency Contact */}
      <EmergencyContactSection form={form} />

      {/* Photo and Status */}
      <PhotoStatusSection form={form} />

      <Form.Item className='mb-0'>
        <ActionButtonsSection onCancel={handleCancel} loading={loading} editingPet={editingPet} />
      </Form.Item>
    </FormModal>
  );
};

export { PetFormModal };
export default PetFormModal;
