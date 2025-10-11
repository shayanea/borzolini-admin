import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';

import { BasicInfoSectionProps } from './types';

const { Option } = Select;

const BasicInfoSection: FC<BasicInfoSectionProps> = ({
  form,
  petSpecies,
  breeds,
  genders,
  sizes,
  selectedSpecies,
  onSpeciesChange,
}) => {
  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>Basic Information</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='name'
            label='Pet Name'
            rules={[
              { required: true, message: 'Please enter pet name' },
              { min: 1, message: 'Pet name must be at least 1 character' },
              { max: 100, message: 'Pet name must be less than 100 characters' },
            ]}
          >
            <Input placeholder='Pet Name' maxLength={100} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='species'
            label='Species'
            rules={[{ required: true, message: 'Please select species' }]}
          >
            <Select placeholder='Select Species' onChange={onSpeciesChange}>
              {petSpecies.map(species => (
                <Option key={species} value={species}>
                  {species.charAt(0).toUpperCase() + species.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name='breed'
            label='Breed'
            rules={[{ max: 100, message: 'Breed must be less than 100 characters' }]}
          >
            <Select placeholder='Select Breed' disabled={!selectedSpecies}>
              {breeds.map(breed => (
                <Option key={breed} value={breed}>
                  {breed}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='gender'
            label='Gender'
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder='Select Gender'>
              {genders.map(gender => (
                <Option key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='size'
            label='Size'
            rules={[{ required: true, message: 'Please select size' }]}
          >
            <Select placeholder='Select Size'>
              {sizes.map(size => (
                <Option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name='date_of_birth'
            label='Date of Birth'
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker className='w-full' placeholder='Select date' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='weight'
            label='Weight (kg)'
            rules={[
              {
                validator: (_, value) => {
                  if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
                    return Promise.reject('Weight must be a valid positive number');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder='Weight in kg' type='number' step='0.1' min='0' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='color'
            label='Color'
            rules={[{ max: 100, message: 'Color must be less than 100 characters' }]}
          >
            <Input placeholder='Pet color' maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BasicInfoSection;
