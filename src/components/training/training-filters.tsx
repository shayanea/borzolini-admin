import { Button, Card, Input, Select, Typography } from 'antd';
import React from 'react';
import { TRAINING_DIFFICULTY, TRAINING_SPECIES } from '@/types/training';

const { Option } = Select;
const { Title, Text } = Typography;

interface TrainingFiltersProps {
  searchTerm: string;
  selectedSpecies: string[];
  selectedDifficulty: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpeciesChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
}

export function TrainingFilters({
  searchTerm,
  selectedSpecies,
  selectedDifficulty,
  onSearch,
  onSpeciesChange,
  onDifficultyChange,
  onTagsChange,
  onClearFilters,
}: TrainingFiltersProps) {
  return (
    <Card>
      <div className='flex justify-between items-center mb-4'>
        <Title level={4}>Filters</Title>
        <Button type='default' size='small' onClick={onClearFilters}>
          Clear All Filters
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div>
          <Text strong>Search Activities</Text>
          <Input
            placeholder='Search by title or description...'
            value={searchTerm}
            onChange={onSearch}
            className='mt-1'
          />
        </div>

        <div>
          <Text strong>Species</Text>
          <Select
            value={selectedSpecies[0] || undefined}
            onChange={onSpeciesChange}
            placeholder='Select species'
            className='w-full mt-1'
          >
            {TRAINING_SPECIES.map(species => (
              <Option key={species.value} value={species.value}>
                {species.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong>Difficulty</Text>
          <Select
            value={selectedDifficulty || undefined}
            onChange={onDifficultyChange}
            placeholder='All difficulties'
            className='w-full mt-1'
          >
            <Option value=''>All Difficulties</Option>
            {TRAINING_DIFFICULTY.map(difficulty => (
              <Option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong>Tags</Text>
          <Input
            placeholder='Enter tag names (comma-separated)'
            onChange={onTagsChange}
            className='mt-1'
          />
        </div>
      </div>
    </Card>
  );
}

