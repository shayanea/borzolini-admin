import type { useTrainingForm } from '@/hooks/training';
import type { TRAINING_DIFFICULTY, TRAINING_SPECIES } from '@/types/training';

export interface TrainingFormSectionProps {
  form: ReturnType<typeof useTrainingForm>;
  speciesOptions: typeof TRAINING_SPECIES;
  difficultyOptions: typeof TRAINING_DIFFICULTY;
}

