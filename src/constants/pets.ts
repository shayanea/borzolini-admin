export const PET_SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  FISH: 'fish',
  RABBIT: 'rabbit',
  HAMSTER: 'hamster',
  GUINEA_PIG: 'guinea_pig',
  REPTILE: 'reptile',
  OTHER: 'other',
} as const;

export const PET_SPECIES_COLORS = {
  [PET_SPECIES.DOG]: 'blue',
  [PET_SPECIES.CAT]: 'orange',
  [PET_SPECIES.BIRD]: 'green',
  [PET_SPECIES.FISH]: 'cyan',
  [PET_SPECIES.RABBIT]: 'purple',
  [PET_SPECIES.HAMSTER]: 'magenta',
  [PET_SPECIES.GUINEA_PIG]: 'lime',
  [PET_SPECIES.REPTILE]: 'volcano',
  [PET_SPECIES.OTHER]: 'default',
} as const;

export const PET_GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

export const PET_GENDER_COLORS = {
  [PET_GENDERS.MALE]: 'blue',
  [PET_GENDERS.FEMALE]: 'pink',
} as const;

export const PET_SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  GIANT: 'giant',
} as const;

export const PET_SIZE_COLORS = {
  [PET_SIZES.TINY]: 'cyan',
  [PET_SIZES.SMALL]: 'green',
  [PET_SIZES.MEDIUM]: 'orange',
  [PET_SIZES.LARGE]: 'red',
  [PET_SIZES.GIANT]: 'purple',
} as const;

// Common breeds organized by species
export const COMMON_BREEDS: Record<string, string[]> = {
  [PET_SPECIES.DOG]: [
    'Labrador Retriever',
    'German Shepherd',
    'Golden Retriever',
    'Bulldog',
    'Beagle',
    'Poodle',
    'Rottweiler',
    'Yorkshire Terrier',
    'Boxer',
    'Dachshund',
    'Shih Tzu',
    'Siberian Husky',
    'Doberman Pinscher',
    'Great Dane',
    'Chihuahua',
    'Border Collie',
    'Cavalier King Charles Spaniel',
    'Australian Shepherd',
    'Pembroke Welsh Corgi',
    'Mixed Breed',
  ],
  [PET_SPECIES.CAT]: [
    'Domestic Shorthair',
    'Domestic Longhair',
    'Siamese',
    'Persian',
    'Maine Coon',
    'Ragdoll',
    'Bengal',
    'Sphynx',
    'British Shorthair',
    'Abyssinian',
    'American Shorthair',
    'Scottish Fold',
    'Norwegian Forest Cat',
    'Oriental Shorthair',
    'Devon Rex',
    'Burmese',
    'Russian Blue',
    'Exotic Shorthair',
    'Himalayan',
    'Mixed Breed',
  ],
  [PET_SPECIES.BIRD]: [
    'Parakeet',
    'Cockatiel',
    'Canary',
    'Lovebird',
    'Parrot',
    'African Grey',
    'Cockatoo',
    'Macaw',
    'Finch',
    'Conure',
    'Budgerigar',
    'Amazon Parrot',
    'Dove',
    'Eclectus',
    'Quaker Parrot',
  ],
  [PET_SPECIES.FISH]: [
    'Goldfish',
    'Betta',
    'Guppy',
    'Angelfish',
    'Tetra',
    'Molly',
    'Platy',
    'Discus',
    'Cichlid',
    'Koi',
    'Swordtail',
    'Barb',
    'Danio',
    'Loach',
    'Catfish',
  ],
  [PET_SPECIES.RABBIT]: [
    'Holland Lop',
    'Mini Lop',
    'Dutch',
    'Netherland Dwarf',
    'Rex',
    'Lionhead',
    'Flemish Giant',
    'English Lop',
    'Mini Rex',
    'Polish',
  ],
  [PET_SPECIES.HAMSTER]: [
    'Syrian',
    'Dwarf Campbell Russian',
    'Dwarf Winter White Russian',
    'Roborovski',
    'Chinese',
  ],
  [PET_SPECIES.GUINEA_PIG]: [
    'American',
    'Abyssinian',
    'Peruvian',
    'Silkie',
    'Teddy',
    'Texel',
    'Skinny Pig',
  ],
  [PET_SPECIES.REPTILE]: [
    'Bearded Dragon',
    'Leopard Gecko',
    'Corn Snake',
    'Ball Python',
    'Crested Gecko',
    'Green Anole',
    'Red-Eared Slider',
    'Chameleon',
    'Iguana',
    'Boa Constrictor',
  ],
  [PET_SPECIES.OTHER]: [
    'Ferret',
    'Hedgehog',
    'Sugar Glider',
    'Rat',
    'Mouse',
    'Gerbil',
    'Chinchilla',
    'Turtle',
    'Tortoise',
    'Frog',
  ],
};

// Helper functions to convert constants to options for dropdowns
export const getPetSpeciesOptions = () => {
  return Object.entries(PET_SPECIES).map(([, value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' '),
  }));
};

export const getPetGenderOptions = () => {
  return Object.entries(PET_GENDERS).map(([, value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));
};

export const getPetSizeOptions = () => {
  return Object.entries(PET_SIZES).map(([, value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));
};

export const getPetBreedOptions = (species: string) => {
  return (COMMON_BREEDS[species] || []).map(breed => ({
    value: breed,
    label: breed,
  }));
};
