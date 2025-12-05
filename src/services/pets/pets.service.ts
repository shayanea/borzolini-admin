import { BaseQueryParams, BaseService } from '../core/base.service';

// Owner interface based on API response structure
export interface PetOwner {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: string;
  avatar: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  preferredLanguage: string;
  timezone: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  medicalHistory: string;
  allergies: string;
  medications: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  insuranceExpiryDate?: string;
  notes?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  emailVerificationToken?: string;
  emailVerificationExpiresAt?: string;
  phoneVerificationOTP?: string;
  phoneVerificationExpiresAt?: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: string;
  passwordUpdatedAt?: string;
  loginAttempts: number;
  lockedUntil?: string;
  lastLoginAt?: string;
  profileCompletionPercentage: number;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
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
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner: PetOwner;
}

export interface CreatePetData {
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
  medical_history?: string;
  behavioral_notes?: string;
  dietary_requirements?: string;
  allergies?: string[];
  medications?: string[];
  emergency_contact?: string;
  emergency_phone?: string;
  photo_url?: string;
  is_active?: boolean;
  owner_id: string;
}

export interface UpdatePetData {
  name?: string;
  species?: string;
  breed?: string;
  gender?: string;
  date_of_birth?: string;
  weight?: string;
  size?: string;
  color?: string;
  microchip_number?: string;
  is_spayed_neutered?: boolean;
  is_vaccinated?: boolean;
  medical_history?: string;
  behavioral_notes?: string;
  dietary_requirements?: string;
  allergies?: string[];
  medications?: string[];
  emergency_contact?: string;
  emergency_phone?: string;
  photo_url?: string;
  is_active?: boolean;
  owner_id?: string;
}

export interface PetsQueryParams extends BaseQueryParams {
  species?: string;
  breed?: string;
  gender?: string;
  size?: string;
  isActive?: boolean;
  ownerName?: string;
}

export interface PetsResponse {
  pets: Pet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PetsService extends BaseService<Pet, CreatePetData, UpdatePetData> {
  constructor() {
    super('/pets');
  }

  protected getEntityName(): string {
    return 'pet';
  }

  /**
   * Get all pets with pagination and filters
   */
  static async getPets(params: PetsQueryParams = {}): Promise<PetsResponse> {
    const service = new PetsService();
    const response = await service.getAll(params);
    return {
      pets: response.data,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    };
  }

  /**
   * Get pet by ID
   */
  static async getPetById(id: string): Promise<Pet> {
    const service = new PetsService();
    return service.getById(id);
  }

  /**
   * Get pets by owner
   */
  static async getPetsByOwner(ownerId: string): Promise<Pet[]> {
    const service = new PetsService();
    return service.getRequest<Pet[]>(`/pets/user/${ownerId}`);
  }

  /**
   * Get pets by user ID (admin endpoint)
   */
  static async getPetsByUserId(userId: string): Promise<Pet[]> {
    const service = new PetsService();
    return service.getRequest<Pet[]>(`/pets/user/${userId}`);
  }

  /**
   * Get pets by type/species
   */
  static async getPetsByType(type: string): Promise<Pet[]> {
    const service = new PetsService();
    return service.getRequest<Pet[]>(`/pets/species/${type}`);
  }

  /**
   * Get distinct allergies for tag suggestions
   */
  static async getDistinctAllergies(): Promise<string[]> {
    const service = new PetsService();
    return service.getRequest<string[]>('/pets/distinct/allergies');
  }

  /**
   * Get distinct medications for tag suggestions
   */
  static async getDistinctMedications(): Promise<string[]> {
    const service = new PetsService();
    return service.getRequest<string[]>('/pets/distinct/medications');
  }

  /**
   * Create new pet
   */
  static async createPet(data: CreatePetData): Promise<Pet> {
    const service = new PetsService();
    return service.create(data);
  }

  /**
   * Update pet
   */
  static async updatePet(id: string, data: UpdatePetData): Promise<Pet> {
    const service = new PetsService();
    return service.update(id, data);
  }

  /**
   * Delete pet
   */
  static async deletePet(id: string): Promise<{ message: string }> {
    const service = new PetsService();
    return service.delete(id);
  }

  /**
   * Export pets to CSV
   */
  static async exportPetsToCSV(params: PetsQueryParams = {}): Promise<Blob> {
    const service = new PetsService();
    return service.exportToCSV(params);
  }

  /**
   * Export pets to Excel
   */
  static async exportPetsToExcel(params: PetsQueryParams = {}): Promise<Blob> {
    const service = new PetsService();
    return service.exportToExcel(params);
  }
}

export default PetsService;
