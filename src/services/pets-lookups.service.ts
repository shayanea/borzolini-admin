import { apiService } from './api/index';

export class PetsLookupsService {
  static async getDistinctAllergies(): Promise<string[]> {
    return apiService.get<string[]>(`/pets/distinct/allergies`);
  }

  static async getDistinctMedications(): Promise<string[]> {
    return apiService.get<string[]>(`/pets/distinct/medications`);
  }
}

export default PetsLookupsService;
