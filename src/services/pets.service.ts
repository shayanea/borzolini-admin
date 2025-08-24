import { apiService } from './api';

export interface Pet {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface PetsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  ownerName?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class PetsService {
  // Get all pets with pagination and filters
  static async getPets(params: PetsQueryParams = {}): Promise<{
    data: Pet[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.type) queryParams.append('type', params.type);
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
    return apiService.get<Pet[]>(`/pets/owner/${ownerId}`);
  }

  // Get pets by type
  static async getPetsByType(type: string): Promise<Pet[]> {
    return apiService.get<Pet[]>(`/pets/type/${type}`);
  }

  // Create new pet
  static async createPet(data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
    return apiService.post<Pet>('/pets', data);
  }

  // Update pet
  static async updatePet(id: string, data: Partial<Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Pet> {
    return apiService.put<Pet>(`/pets/${id}`, data);
  }

  // Delete pet
  static async deletePet(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/pets/${id}`);
  }

  // Get pet types
  static async getPetTypes(): Promise<string[]> {
    return apiService.get<string[]>('/pets/types');
  }

  // Get pet breeds by type
  static async getPetBreeds(type: string): Promise<string[]> {
    return apiService.get<string[]>(`/pets/breeds/${type}`);
  }
}

export default PetsService;
