import { TRAINING_DIFFICULTY, TRAINING_SPECIES } from '@/constants/training';
import type { useTrainingForm } from '@/hooks/training';

export interface TrainingFormSectionProps {
  form: ReturnType<typeof useTrainingForm>;
  speciesOptions: typeof TRAINING_SPECIES;
  difficultyOptions: typeof TRAINING_DIFFICULTY;
}

