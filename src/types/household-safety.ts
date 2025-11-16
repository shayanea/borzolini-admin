export interface FoodItem {
  id: string;
  name: string;
  description: string;
  safetyLevel: 'safe' | 'caution' | 'dangerous' | 'unknown';
  notes?: string;
  createdAt: Date;
}

export interface PlantItem {
  id: string;
  name: string;
  scientificName?: string;
  toxicityLevel: 'non-toxic' | 'mild' | 'moderate' | 'severe';
  symptoms?: string[];
  createdAt: Date;
}

export interface HouseholdItem {
  id: string;
  name: string;
  category: string;
  hazardLevel: 'safe' | 'low' | 'medium' | 'high';
  precautions?: string;
  createdAt: Date;
}

export interface SafetySearchResult {
  id: string;
  type: 'food' | 'plant' | 'household';
  name: string;
  category?: string;
  safetyLevel?: string;
  hazardLevel?: string;
  toxicityLevel?: string;
  speciesSafety?: Array<{
    species: string;
    safety: 'safe' | 'caution' | 'dangerous';
    notes?: string;
  }>;
  createdAt: Date;
}

export interface SafetySearchResponse {
  data: SafetySearchResult[];
  total: number;
  page: number;
  limit: number;
}

export interface SpeciesFilter {
  value: string;
  label: string;
}

export const SPECIES_OPTIONS: SpeciesFilter[] = [
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'bird', label: 'Birds' },
  { value: 'rabbit', label: 'Rabbits' },
  { value: 'small_mammal', label: 'Small Mammals' },
  { value: 'reptile', label: 'Reptiles' },
  { value: 'all', label: 'All Species' }
];

export type SafetyLevel = 'safe' | 'caution' | 'dangerous' | 'unknown' | 'non-toxic' | 'mild' | 'moderate' | 'severe' | 'low' | 'medium' | 'high';

export interface ApiError {
  message: string;
  statusCode: number;
}
