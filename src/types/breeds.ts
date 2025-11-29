export enum PetSpecies {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RABBIT = 'rabbit',
  HAMSTER = 'hamster',
  FISH = 'fish',
  REPTILE = 'reptile',
  HORSE = 'horse',
  OTHER = 'other',
}

export enum PetSize {
  TINY = 'tiny',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  GIANT = 'giant',
}

export enum GroomingNeeds {
  NONE = 'none',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

export enum ExerciseNeeds {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

export interface Breed {
  id: string;
  name: string;
  species: PetSpecies;
  size_category?: PetSize;
  temperament?: string;
  health_risks: string[];
  life_expectancy_min?: number;
  life_expectancy_max?: number;
  weight_min?: number;
  weight_max?: number;
  origin_country?: string;
  origin_history?: string;
  description?: string;
  image_url?: string;
  resources: string[];
  grooming_needs?: GroomingNeeds;
  exercise_needs?: ExerciseNeeds;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBreedDto {
  name: string;
  species: PetSpecies;
  size_category?: PetSize;
  temperament?: string;
  health_risks?: string[];
  life_expectancy_min?: number;
  life_expectancy_max?: number;
  weight_min?: number;
  weight_max?: number;
  origin_country?: string;
  origin_history?: string;
  description?: string;
  image_url?: string;
  resources?: string[];
  grooming_needs?: GroomingNeeds;
  exercise_needs?: ExerciseNeeds;
  is_active?: boolean;
}

export interface UpdateBreedDto {
  name?: string;
  species?: PetSpecies;
  size_category?: PetSize;
  temperament?: string;
  health_risks?: string[];
  life_expectancy_min?: number;
  life_expectancy_max?: number;
  weight_min?: number;
  weight_max?: number;
  origin_country?: string;
  origin_history?: string;
  description?: string;
  image_url?: string;
  resources?: string[];
  grooming_needs?: GroomingNeeds;
  exercise_needs?: ExerciseNeeds;
  is_active?: boolean;
}

export interface BreedResponse {
  data: Breed;
  message: string;
}

export interface BreedsBySpeciesResponse {
  species: string;
  breeds: Breed[];
}

export interface AllBreedsResponse {
  breeds_by_species: BreedsBySpeciesResponse[];
  total_breeds: number;
  total_species: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

