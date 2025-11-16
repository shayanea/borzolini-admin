export const RESOURCE_CATEGORIES = [
  { value: 'health', label: 'Health & Wellness' },
  { value: 'training', label: 'Training & Behavior' },
  { value: 'nutrition', label: 'Nutrition & Diet' },
  { value: 'grooming', label: 'Grooming & Care' },
  { value: 'exercise', label: 'Exercise & Play' },
  { value: 'socialization', label: 'Socialization' },
  { value: 'medical', label: 'Medical Information' },
  { value: 'other', label: 'Other' },
] as const;

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number]['value'];
