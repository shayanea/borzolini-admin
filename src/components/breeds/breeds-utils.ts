import { ExerciseNeeds, GroomingNeeds, PetSpecies } from '@/types/breeds';

export const getSpeciesIcon = (species: string): string => {
  const icons: Record<string, string> = {
    [PetSpecies.DOG]: '🐕',
    [PetSpecies.CAT]: '🐱',
    [PetSpecies.BIRD]: '🐦',
    [PetSpecies.RABBIT]: '🐰',
    [PetSpecies.HAMSTER]: '🐹',
    [PetSpecies.FISH]: '🐠',
    [PetSpecies.REPTILE]: '🦎',
    [PetSpecies.HORSE]: '🐴',
    [PetSpecies.OTHER]: '🐾',
  };
  return icons[species.toLowerCase()] || '🐾';
};

export const getGroomingColor = (
  grooming?: GroomingNeeds
): 'default' | 'success' | 'warning' | 'error' => {
  if (!grooming) return 'default';
  switch (grooming) {
    case GroomingNeeds.NONE:
      return 'default';
    case GroomingNeeds.LOW:
      return 'success';
    case GroomingNeeds.MODERATE:
      return 'warning';
    case GroomingNeeds.HIGH:
      return 'error';
    default:
      return 'default';
  }
};

export const getExerciseColor = (exercise?: ExerciseNeeds): 'blue' | 'warning' | 'error' => {
  if (!exercise) return 'blue';
  switch (exercise) {
    case ExerciseNeeds.LOW:
      return 'blue';
    case ExerciseNeeds.MODERATE:
      return 'warning';
    case ExerciseNeeds.HIGH:
      return 'error';
    default:
      return 'blue';
  }
};
