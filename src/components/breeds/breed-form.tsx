import { Button, Form, Input, InputNumber, Select, Space, Switch, Typography } from 'antd';
import type { ReturnType } from 'react';
import type { useBreedForm } from '@/hooks/breeds';
import type { Breed } from '@/types/breeds';
import { PetSpecies, PetSize, GroomingNeeds, ExerciseNeeds } from '@/types/breeds';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface BreedFormProps {
  form: ReturnType<typeof useBreedForm>;
  onSubmit: () => Promise<boolean>;
  isLoading: boolean;
  breed?: Breed | null;
  onCancel: () => void;
}

export function BreedForm({
  form,
  onSubmit,
  isLoading,
  breed,
  onCancel
}: BreedFormProps) {
  const isEdit = !!breed;

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Name" required validateStatus={form.errors.name ? 'error' : ''} help={form.errors.name}>
          <Input
            value={form.formData.name}
            onChange={(e) => form.handleInputChange('name', e.target.value)}
            placeholder="Enter breed name"
          />
        </Form.Item>

        <Form.Item label="Species" required validateStatus={form.errors.species ? 'error' : ''} help={form.errors.species}>
          <Select 
            value={form.formData.species} 
            onChange={(value) => form.handleInputChange('species', value)}
            placeholder="Select species"
          >
            <Option value={PetSpecies.DOG}>Dog</Option>
            <Option value={PetSpecies.CAT}>Cat</Option>
            <Option value={PetSpecies.BIRD}>Bird</Option>
            <Option value={PetSpecies.RABBIT}>Rabbit</Option>
            <Option value={PetSpecies.HAMSTER}>Hamster</Option>
            <Option value={PetSpecies.FISH}>Fish</Option>
            <Option value={PetSpecies.REPTILE}>Reptile</Option>
            <Option value={PetSpecies.HORSE}>Horse</Option>
            <Option value={PetSpecies.OTHER}>Other</Option>
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Size Category">
          <Select 
            value={form.formData.size_category} 
            onChange={(value) => form.handleInputChange('size_category', value)}
            placeholder="Select size"
            allowClear
          >
            <Option value={PetSize.TINY}>Tiny</Option>
            <Option value={PetSize.SMALL}>Small</Option>
            <Option value={PetSize.MEDIUM}>Medium</Option>
            <Option value={PetSize.LARGE}>Large</Option>
            <Option value={PetSize.GIANT}>Giant</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Image URL (optional)">
          <Input
            type="url"
            value={form.formData.image_url || ''}
            onChange={(e) => form.handleInputChange('image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </Form.Item>
      </div>

      <Form.Item label="Description">
        <TextArea
          value={form.formData.description || ''}
          onChange={(e) => form.handleInputChange('description', e.target.value)}
          placeholder="Enter breed description (optional)"
          rows={4}
        />
      </Form.Item>

      <Form.Item label="Temperament">
        <TextArea
          value={form.formData.temperament || ''}
          onChange={(e) => form.handleInputChange('temperament', e.target.value)}
          placeholder="Enter temperament and personality traits (optional)"
          rows={3}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Grooming Needs">
          <Select 
            value={form.formData.grooming_needs} 
            onChange={(value) => form.handleInputChange('grooming_needs', value)}
            placeholder="Select grooming needs"
            allowClear
          >
            <Option value={GroomingNeeds.LOW}>Low</Option>
            <Option value={GroomingNeeds.MODERATE}>Moderate</Option>
            <Option value={GroomingNeeds.HIGH}>High</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Exercise Needs">
          <Select 
            value={form.formData.exercise_needs} 
            onChange={(value) => form.handleInputChange('exercise_needs', value)}
            placeholder="Select exercise needs"
            allowClear
          >
            <Option value={ExerciseNeeds.LOW}>Low</Option>
            <Option value={ExerciseNeeds.MODERATE}>Moderate</Option>
            <Option value={ExerciseNeeds.HIGH}>High</Option>
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Life Expectancy Min (years)">
          <InputNumber
            value={form.formData.life_expectancy_min}
            onChange={(value) => form.handleInputChange('life_expectancy_min', value || undefined)}
            placeholder="Min years"
            min={0}
            className="w-full"
          />
        </Form.Item>

        <Form.Item label="Life Expectancy Max (years)">
          <InputNumber
            value={form.formData.life_expectancy_max}
            onChange={(value) => form.handleInputChange('life_expectancy_max', value || undefined)}
            placeholder="Max years"
            min={0}
            className="w-full"
          />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Weight Min (lbs)">
          <InputNumber
            value={form.formData.weight_min}
            onChange={(value) => form.handleInputChange('weight_min', value || undefined)}
            placeholder="Min weight"
            min={0}
            step={0.1}
            className="w-full"
          />
        </Form.Item>

        <Form.Item label="Weight Max (lbs)">
          <InputNumber
            value={form.formData.weight_max}
            onChange={(value) => form.handleInputChange('weight_max', value || undefined)}
            placeholder="Max weight"
            min={0}
            step={0.1}
            className="w-full"
          />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item label="Origin Country">
          <Input
            value={form.formData.origin_country || ''}
            onChange={(e) => form.handleInputChange('origin_country', e.target.value)}
            placeholder="Enter origin country (optional)"
          />
        </Form.Item>
      </div>

      <Form.Item label="Origin History">
        <TextArea
          value={form.formData.origin_history || ''}
          onChange={(e) => form.handleInputChange('origin_history', e.target.value)}
          placeholder="Enter detailed origin history (optional)"
          rows={3}
        />
      </Form.Item>

      <Form.Item>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.formData.is_active ?? true}
              onChange={(checked) => form.handleInputChange('is_active', checked)}
            />
            <Text>Active</Text>
          </div>

          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              {isEdit ? 'Update Breed' : 'Create Breed'}
            </Button>
          </Space>
        </div>
      </Form.Item>
    </Form>
  );
}

