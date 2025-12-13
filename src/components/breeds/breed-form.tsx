import { ExerciseNeeds, GroomingNeeds, PetSize, PetSpecies } from '@/types/breeds';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Select, Space, Switch, Typography } from 'antd';

import type { useBreedForm } from '@/hooks/breeds';
import type { Breed } from '@/types/breeds';

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

export function BreedForm({ form, onSubmit, isLoading, breed, onCancel }: BreedFormProps) {
  const isEdit = !!breed;

  return (
    <Form layout='vertical' onFinish={onSubmit}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item
          label='Name'
          required
          validateStatus={form.errors.name ? 'error' : ''}
          help={form.errors.name}
        >
          <Input
            value={form.formData.name}
            onChange={e => form.handleInputChange('name', e.target.value)}
            placeholder='Enter breed name'
          />
        </Form.Item>

        <Form.Item
          label='Species'
          required
          validateStatus={form.errors.species ? 'error' : ''}
          help={form.errors.species}
        >
          <Select
            value={form.formData.species}
            onChange={value => form.handleInputChange('species', value)}
            placeholder='Select species'
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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item label='Size Category'>
          <Select
            value={form.formData.size_category}
            onChange={value => form.handleInputChange('size_category', value)}
            placeholder='Select size'
            allowClear
          >
            <Option value={PetSize.TINY}>Tiny</Option>
            <Option value={PetSize.SMALL}>Small</Option>
            <Option value={PetSize.MEDIUM}>Medium</Option>
            <Option value={PetSize.LARGE}>Large</Option>
            <Option value={PetSize.GIANT}>Giant</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Image URL (optional)'>
          <Input
            type='url'
            value={form.formData.image_url || ''}
            onChange={e => form.handleInputChange('image_url', e.target.value)}
            placeholder='https://example.com/image.jpg'
          />
        </Form.Item>
      </div>

      <Form.Item label='Description'>
        <TextArea
          value={form.formData.description || ''}
          onChange={e => form.handleInputChange('description', e.target.value)}
          placeholder='Enter breed description (optional)'
          rows={4}
        />
      </Form.Item>

      <Form.Item label='Temperament'>
        <TextArea
          value={form.formData.temperament || ''}
          onChange={e => form.handleInputChange('temperament', e.target.value)}
          placeholder='Enter temperament and personality traits (optional)'
          rows={3}
        />
      </Form.Item>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item label='Grooming Needs'>
          <Select
            value={form.formData.grooming_needs}
            onChange={value => form.handleInputChange('grooming_needs', value)}
            placeholder='Select grooming needs'
            allowClear
          >
            <Option value={GroomingNeeds.NONE}>None</Option>
            <Option value={GroomingNeeds.LOW}>Low</Option>
            <Option value={GroomingNeeds.MODERATE}>Moderate</Option>
            <Option value={GroomingNeeds.HIGH}>High</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Exercise Needs'>
          <Select
            value={form.formData.exercise_needs}
            onChange={value => form.handleInputChange('exercise_needs', value)}
            placeholder='Select exercise needs'
            allowClear
          >
            <Option value={ExerciseNeeds.LOW}>Low</Option>
            <Option value={ExerciseNeeds.MODERATE}>Moderate</Option>
            <Option value={ExerciseNeeds.HIGH}>High</Option>
          </Select>
        </Form.Item>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item label='Life Expectancy Min (years)'>
          <InputNumber
            value={form.formData.life_expectancy_min}
            onChange={value => form.handleInputChange('life_expectancy_min', value || undefined)}
            placeholder='Min years'
            min={0}
            className='w-full'
          />
        </Form.Item>

        <Form.Item label='Life Expectancy Max (years)'>
          <InputNumber
            value={form.formData.life_expectancy_max}
            onChange={value => form.handleInputChange('life_expectancy_max', value || undefined)}
            placeholder='Max years'
            min={0}
            className='w-full'
          />
        </Form.Item>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item label='Weight Min (lbs)'>
          <InputNumber
            value={form.formData.weight_min}
            onChange={value => form.handleInputChange('weight_min', value || undefined)}
            placeholder='Min weight'
            min={0}
            step={0.1}
            className='w-full'
          />
        </Form.Item>

        <Form.Item label='Weight Max (lbs)'>
          <InputNumber
            value={form.formData.weight_max}
            onChange={value => form.handleInputChange('weight_max', value || undefined)}
            placeholder='Max weight'
            min={0}
            step={0.1}
            className='w-full'
          />
        </Form.Item>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Form.Item label='Origin Country'>
          <Input
            value={form.formData.origin_country || ''}
            onChange={e => form.handleInputChange('origin_country', e.target.value)}
            placeholder='Enter origin country (optional)'
          />
        </Form.Item>
      </div>

      <Form.Item label='Origin History'>
        <TextArea
          value={form.formData.origin_history || ''}
          onChange={e => form.handleInputChange('origin_history', e.target.value)}
          placeholder='Enter detailed origin history (optional)'
          rows={3}
        />
      </Form.Item>

      <Form.Item label='Health Risks (Optional)'>
        <div className='space-y-2'>
          {(form.formData.health_risks || []).map((risk, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <span className='text-lg mt-1'>⚠️</span>
              <Input
                value={risk}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.updateHealthRisk(index, e.target.value)
                }
                placeholder='e.g., Hypertrophic cardiomyopathy, Obesity'
                className='flex-1'
              />
              <Button
                type='text'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => form.deleteHealthRisk(index)}
                danger
              />
            </div>
          ))}
          <Button type='default' size='small' icon={<PlusOutlined />} onClick={form.addHealthRisk}>
            Add Health Risk
          </Button>
        </div>
      </Form.Item>

      <Form.Item label='Resources (Optional)'>
        <div className='space-y-2'>
          {(form.formData.resources || []).map((resource, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <span className='text-lg mt-1'>🔗</span>
              <Input
                type='url'
                value={resource}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.updateResource(index, e.target.value)
                }
                placeholder='https://example.com/resource'
                className='flex-1'
              />
              <Button
                type='text'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => form.deleteResource(index)}
                danger
              />
            </div>
          ))}
          <Button type='default' size='small' icon={<PlusOutlined />} onClick={form.addResource}>
            Add Resource
          </Button>
        </div>
      </Form.Item>

      <Typography.Title level={5}>Care Specifics</Typography.Title>
      
      <Form.Item label='Diet'>
        <TextArea
          value={form.formData.care_specifics?.diet || ''}
          onChange={(e) => form.handleCareSpecificsChange('diet', e.target.value)}
          placeholder='Detailed diet information'
          rows={3}
        />
      </Form.Item>

      <Form.Item label='Housing'>
        <TextArea
          value={form.formData.care_specifics?.housing || ''}
          onChange={(e) => form.handleCareSpecificsChange('housing', e.target.value)}
          placeholder='Housing requirements related to the breed'
          rows={3}
        />
      </Form.Item>

      <Form.Item label='Social Needs'>
         <TextArea
          value={form.formData.care_specifics?.social_needs || ''}
          onChange={(e) => form.handleCareSpecificsChange('social_needs', e.target.value)}
          placeholder='Social interaction requirements'
          rows={3}
        />
      </Form.Item>

      <Form.Item label='Common Stressors'>
        <div className='space-y-2'>
          {(form.formData.care_specifics?.common_stressors || []).map((stressor, index) => (
            <div key={index} className='flex gap-2 items-start'>
               <span className='text-lg mt-1'>😟</span>
              <Input
                value={stressor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.updateCommonStressor(index, e.target.value)
                }
                placeholder='e.g., Loud noises, Isolation'
                className='flex-1'
              />
              <Button
                type='text'
                size='small'
                icon={<DeleteOutlined />}
                onClick={() => form.deleteCommonStressor(index)}
                danger
              />
            </div>
          ))}
          <Button type='default' size='small' icon={<PlusOutlined />} onClick={form.addCommonStressor}>
            Add Stressor
          </Button>
        </div>
      </Form.Item>


      <Typography.Title level={5} className="mt-8 mb-4">Average Vitals</Typography.Title>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='border p-4 rounded-lg bg-gray-50'>
          <Typography.Text strong className="block mb-2">Temperature (°F)</Typography.Text>
          <div className='flex gap-2 items-center'>
            <Form.Item className='mb-0 flex-1' label="Min" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.temperature_f?.min}
                onChange={(val) => form.handleAverageVitalsChange('temperature_f', 'min', val || 0)}
                className='w-full'
              />
            </Form.Item>
            <span className="mt-6">-</span>
             <Form.Item className='mb-0 flex-1' label="Max" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.temperature_f?.max}
                onChange={(val) => form.handleAverageVitalsChange('temperature_f', 'max', val || 0)}
                 className='w-full'
              />
            </Form.Item>
          </div>
        </div>

        <div className='border p-4 rounded-lg bg-gray-50'>
          <Typography.Text strong className="block mb-2">Heart Rate (BPM)</Typography.Text>
          <div className='flex gap-2 items-center'>
             <Form.Item className='mb-0 flex-1' label="Min" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.heart_rate_bpm?.min}
                onChange={(val) => form.handleAverageVitalsChange('heart_rate_bpm', 'min', val || 0)}
                className='w-full'
              />
            </Form.Item>
             <span className="mt-6">-</span>
             <Form.Item className='mb-0 flex-1' label="Max" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.heart_rate_bpm?.max}
                onChange={(val) => form.handleAverageVitalsChange('heart_rate_bpm', 'max', val || 0)}
                className='w-full'
              />
            </Form.Item>
          </div>
        </div>

        <div className='border p-4 rounded-lg bg-gray-50'>
          <Typography.Text strong className="block mb-2">Respiratory Rate (RPM)</Typography.Text>
           <div className='flex gap-2 items-center'>
             <Form.Item className='mb-0 flex-1' label="Min" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.respiratory_rate_rpm?.min}
                onChange={(val) => form.handleAverageVitalsChange('respiratory_rate_rpm', 'min', val || 0)}
                className='w-full'
              />
            </Form.Item>
             <span className="mt-6">-</span>
             <Form.Item className='mb-0 flex-1' label="Max" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.respiratory_rate_rpm?.max}
                onChange={(val) => form.handleAverageVitalsChange('respiratory_rate_rpm', 'max', val || 0)}
                className='w-full'
              />
            </Form.Item>
          </div>
        </div>

        <div className='border p-4 rounded-lg bg-gray-50'>
          <Typography.Text strong className="block mb-2">Weight (KG)</Typography.Text>
          <div className='flex gap-2 items-center'>
             <Form.Item className='mb-0 flex-1' label="Min" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.weight_kg?.min}
                onChange={(val) => form.handleAverageVitalsChange('weight_kg', 'min', val || 0)}
                step={0.01}
                className='w-full'
              />
            </Form.Item>
             <span className="mt-6">-</span>
            <Form.Item className='mb-0 flex-1' label="Max" labelCol={{span: 24}}>
              <InputNumber
                value={form.formData.average_vitals?.weight_kg?.max}
                onChange={(val) => form.handleAverageVitalsChange('weight_kg', 'max', val || 0)}
                step={0.01}
                className='w-full'
              />
            </Form.Item>
          </div>
        </div>
      </div>

      <Form.Item>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Switch
              checked={form.formData.is_active ?? true}
              onChange={checked => form.handleInputChange('is_active', checked)}
            />
            <Text>Active</Text>
          </div>

          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              {isEdit ? 'Update Breed' : 'Create Breed'}
            </Button>
          </Space>
        </div>
      </Form.Item>
    </Form>
  );
}
