export interface SafetyBySpecies {
  id: string;
  species: string;
  safety: 'safe' | 'caution' | 'dangerous' | 'avoid' | 'unknown';
  preparation?: string | null;
  safeAmount?: string | null;
  frequency?: string | null;
  risks?: string[];
  emergency: boolean;
  treatmentInfo?: string | null;
  citations?: string | null;
}

export interface HouseholdSafetyItem {
  id: string;
  canonical_name: string;
  scientific_name?: string | null;
  category?: string | null;
  safety_overall: 'safe' | 'caution' | 'dangerous' | 'avoid' | 'unknown';
  notes_markdown?: string | null;
  last_reviewed_at?: string | null;
  sourcePrimary?: string | null;
  sourceName?: string | null;
  license?: string | null;
  terms_snapshot?: string | null;
  hash?: string | null;
  citations?: string | null;
  toxicCompounds?: string | null;
  created_at: string;
  updated_at: string;
  safety_by_species?: SafetyBySpecies[];
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
  // Extended fields from API
  canonical_name?: string;
  scientific_name?: string | null;
  safety_overall?: string;
  notes_markdown?: string | null;
  safety_by_species?: SafetyBySpecies[];
  citations?: string | null;
  toxicCompounds?: string | null;
  last_reviewed_at?: string | null;
  sourceName?: string | null;
  license?: string | null;
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
  { value: 'all', label: 'All Species' },
];

export type SafetyLevel =
  | 'safe'
  | 'caution'
  | 'dangerous'
  | 'avoid'
  | 'unknown'
  | 'non-toxic'
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'low'
  | 'medium'
  | 'high';

export interface ApiError {
  message: string;
  statusCode: number;
}
