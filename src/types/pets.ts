import type { Pet, PetsQueryParams } from '@/services/pets.service';

// Re-export service types for convenience
export type { Pet, PetsQueryParams };

// Pet form data for create/update operations
export interface PetFormData {
  name: string;
  type: string;
  breed?: string;
  age?: number;
  weight?: number;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  microchipId?: string;
  isActive: boolean;
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
  selectedType: string;
  selectedOwner: string;
  isActiveFilter: boolean | undefined;
  onSearch: (value: string) => void;
  onTypeFilter: (value: string) => void;
  onOwnerFilter: (value: string) => void;
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
    type: string;
    ownerName: string;
    isActive: boolean | undefined;
  };
  petTypes: string[];
  breeds: string[];
  // Actions
  fetchPets: () => Promise<void>;
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
  handleRowSelectionChange: (selectedRowKeys: React.Key[], selectedRows: Pet[]) => void;
  handleSearch: (value: string) => void;
  handleTypeFilter: (value: string) => void;
  handleOwnerFilter: (value: string) => void;
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
  type: { required: boolean; message: string }[];
  ownerName: { required: boolean; message: string }[];
  ownerEmail?: { type: string; message: string }[];
  age?: { type: string; message: string; min?: number; max?: number }[];
  weight?: { type: string; message: string; min?: number; max?: number }[];
}
