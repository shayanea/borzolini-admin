export const getSpeciesIcon = (species: string): string => {
  const icons: Record<string, string> = {
    dog: '🐕',
    cat: '🐱',
    puppy: '🐶',
    kitten: '🐾',
    small_dog: '🐩',
    large_dog: '🐕‍🦺',
    senior_dog: '🐕',
    working_dog: '🐕‍🦺',
  };
  return icons[species] || '🐾';
};

export const getDifficultyColor = (
  difficulty: string
): 'success' | 'warning' | 'error' | 'default' => {
  const colorMap: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    easy: 'success',
    moderate: 'warning',
    advanced: 'error',
  };
  return colorMap[difficulty] || 'default';
};

