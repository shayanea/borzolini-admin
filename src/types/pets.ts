import type { Pet, PetOwner, PetsQueryParams } from '@/services/pets.service';

// Re-export service types for convenience
export type { Pet, PetOwner, PetsQueryParams };

// Pet form data for create/update operations
export interface PetFormData {
  name: string;
  species: string;
  breed?: string;
  gender: string;
  date_of_birth: string;
  weight: string;
  size: string;
  color: string;
  microchip_number?: string;
  is_spayed_neutered: boolean;
  is_vaccinated: boolean;
  medical_history: string;
  behavioral_notes: string;
  dietary_requirements: string;
  allergies: string[];
  medications: string[];
  emergency_contact: string;
  emergency_phone: string;
  photo_url?: string;
  is_active: boolean;
  owner_id: string;
}

// Pet table props
export interface PetTableProps {
  pets: Pet[];
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  selectedRowKeys?: React.Key[];
  onViewPet: (pet: Pet) => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (petId: string) => void;
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onRowSelectionChange: (selectedRowKeys: React.Key[], selectedRows: Pet[]) => void;
}

// Pet filters props
export interface PetFiltersProps {
  searchText: string;
  selectedSpecies: string | null;
  selectedBreed: string | null;
  selectedGender: string | null;
  selectedSize: string | null;
  isActiveFilter: boolean | undefined;
  onSearch: (value: string) => void;
  onSpeciesFilter: (value: string | null) => void;
  onBreedFilter: (value: string | null) => void;
  onGenderFilter: (value: string | null) => void;
  onSizeFilter: (value: string | null) => void;
  onActiveFilter: (value: boolean | undefined) => void;
  onClearFilters: () => void;
}

// Pet form modal props
export interface PetFormModalProps {
  isVisible: boolean;
  editingPet: Pet | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: PetFormData) => void;
}

// Pet management hook return type
export interface UsePetManagementReturn {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  selectedRowKeys: React.Key[];
  filters: {
    search: string;
    species: string | null;
    breed: string | null;
    gender: string | null;
    size: string | null;
    ownerName: string;
    isActive: boolean | undefined;
  };
  petSpecies: string[];
  breeds: string[];
  genders: string[];
  sizes: string[];
  owners: PetOwner[];
  // Actions
  fetchPets: () => Promise<void>;
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
  handleRowSelectionChange: (selectedRowKeys: React.Key[], selectedRows: Pet[]) => void;
  handleSearch: (value: string) => void;
  handleSpeciesFilter: (value: string | null) => void;
  handleBreedFilter: (value: string | null) => void;
  handleGenderFilter: (value: string | null) => void;
  handleSizeFilter: (value: string | null) => void;
  handleActiveFilter: (value: boolean | undefined) => void;
  handleClearFilters: () => void;
  handleCreatePet: (data: PetFormData) => Promise<void>;
  handleUpdatePet: (id: string, data: PetFormData) => Promise<void>;
  handleDeletePet: (id: string) => Promise<void>;
  handleViewPet: (pet: Pet) => void;
  handleEditPet: (pet: Pet) => void;
}

// Pet bulk actions props
export interface PetBulkActionsProps {
  selectedRowKeys: React.Key[];
  selectedPets: Pet[];
  onBulkDelete: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  loading?: boolean;
}

// Pet page header props
export interface PetPageHeaderProps {
  totalPets: number;
  onAddPet: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

// Pet details modal props
export interface PetDetailsModalProps {
  pet: Pet | null;
  isVisible: boolean;
  onClose: () => void;
}

// Pet statistics
export interface PetStatistics {
  totalPets: number;
  activePets: number;
  inactivePets: number;
  petsByType: Record<string, number>;
  recentPets: Pet[];
}

// Pet form validation rules
export interface PetFormValidation {
  name: { required: boolean; message: string }[];
  species: { required: boolean; message: string }[];
  gender: { required: boolean; message: string }[];
  date_of_birth: { required: boolean; message: string; type: string }[];
  size: { required: boolean; message: string }[];
  color: { required: boolean; message: string }[];
  emergency_contact: { required: boolean; message: string }[];
  emergency_phone: { required: boolean; message: string; pattern?: RegExp }[];
  owner_id: { required: boolean; message: string }[];
  medical_history?: { type: string; message: string }[];
  behavioral_notes?: { type: string; message: string }[];
  dietary_requirements?: { type: string; message: string }[];
}
