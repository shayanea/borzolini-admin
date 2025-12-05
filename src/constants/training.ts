export const TRAINING_PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

export const TRAINING_SORT_DEFAULTS = {
  FIELD: 'created_at',
  ORDER: 'DESC',
} as const;

export const TRAINING_FILTER_DEFAULTS = {
  MAX_TAGS_SELECTION: 3,
};

export const TRAINING_DIFFICULTY = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-orange-100 text-orange-800' }
] as const;

export const TRAINING_SPECIES = [
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'puppy', label: 'Puppies' },
  { value: 'kitten', label: 'Kittens' },
  { value: 'small_dog', label: 'Small Dogs' },
  { value: 'large_dog', label: 'Large Dogs' },
  { value: 'senior_dog', label: 'Senior Dogs' },
  { value: 'working_dog', label: 'Working Dogs' }
] as const;
