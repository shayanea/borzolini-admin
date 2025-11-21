import type { PetOwnerOption } from '@/hooks/pets';
import { FormInstance } from 'antd';

export interface PetFormSectionProps {
  form: FormInstance;
}

export interface BasicInfoSectionProps extends PetFormSectionProps {
  petSpecies: string[];
  breeds: string[];
  genders: string[];
  sizes: string[];
  selectedSpecies: string;
  onSpeciesChange: (value: string) => void;
  owners: PetOwnerOption[];
  loadingOwners?: boolean;
}

export interface MedicalInfoSectionProps extends PetFormSectionProps {
  editingPet?: any;
}

export interface CareInfoSectionProps extends PetFormSectionProps {
  allergyOptions: string[];
  medicationOptions: string[];
}

export interface EmergencyContactSectionProps extends PetFormSectionProps {}

export interface PhotoStatusSectionProps extends PetFormSectionProps {}

export interface ActionButtonsSectionProps {
  onCancel: () => void;
  loading?: boolean;
  editingPet?: any;
}
