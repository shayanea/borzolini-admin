import { apiService } from './api/index';

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

export interface PetsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  species?: string;
  breed?: string;
  gender?: string;
  size?: string;
  isActive?: boolean;
  ownerName?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class PetsService {
  // Get all pets with pagination and filters
  static async getPets(params: PetsQueryParams = {}): Promise<{
    pets: Pet[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.species) queryParams.append('species', params.species);
    if (params.breed) queryParams.append('breed', params.breed);
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.size) queryParams.append('size', params.size);
    if (params.ownerName) queryParams.append('ownerName', params.ownerName);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/pets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get(url);
  }

  // Get pet by ID
  static async getPetById(id: string): Promise<Pet> {
    return apiService.get<Pet>(`/pets/${id}`);
  }

  // Get pets by owner
  static async getPetsByOwner(ownerId: string): Promise<Pet[]> {
    return apiService.get<Pet[]>(`/pets/user/${ownerId}`);
  }

  // Get pets by user ID (admin endpoint)
  static async getPetsByUserId(userId: string): Promise<Pet[]> {
    return apiService.get<Pet[]>(`/pets/user/${userId}`);
  }

  // Get pets by type
  static async getPetsByType(type: string): Promise<Pet[]> {
    // API uses species endpoint instead of type
    return apiService.get<Pet[]>(`/pets/species/${type}`);
  }

  // Distinct lists for tag suggestions
  static async getDistinctAllergies(): Promise<string[]> {
    return apiService.get<string[]>(`/pets/distinct/allergies`);
  }

  static async getDistinctMedications(): Promise<string[]> {
    return apiService.get<string[]>(`/pets/distinct/medications`);
  }

  // Create new pet
  static async createPet(
    data: Omit<Pet, 'id' | 'created_at' | 'updated_at' | 'owner'>
  ): Promise<Pet> {
    return apiService.post<Pet>('/pets', data);
  }

  // Update pet
  static async updatePet(
    id: string,
    data: Partial<Omit<Pet, 'id' | 'created_at' | 'updated_at' | 'owner'>>
  ): Promise<Pet> {
    return apiService.patch<Pet>(`/pets/${id}`, data);
  }

  // Delete pet
  static async deletePet(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/pets/${id}`);
  }

  // Export pets to CSV
  static async exportPetsToCSV(params: PetsQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.species) queryParams.append('species', params.species);
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.size) queryParams.append('size', params.size);
    if (params.search) queryParams.append('search', params.search);

    const url = `/pets/export/csv${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  // Export pets to Excel
  static async exportPetsToExcel(params: PetsQueryParams = {}): Promise<Blob> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.species) queryParams.append('species', params.species);
    if (params.gender) queryParams.append('gender', params.gender);
    if (params.size) queryParams.append('size', params.size);
    if (params.search) queryParams.append('search', params.search);

    const url = `/pets/export/excel${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }

  // Note: Pet types and breeds endpoints don't exist in the API
  // Using static data in components instead
}

export default PetsService;
