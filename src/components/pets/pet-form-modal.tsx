import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import type { PetFormModalProps } from '@/types';
import dayjs from 'dayjs';

const { Option } = Select;

// Common breeds by species - moved outside component to prevent recreation on every render
const COMMON_BREEDS: Record<string, string[]> = {
  dog: [
    'Labrador Retriever',
    'Golden Retriever',
    'German Shepherd',
    'Bulldog',
    'Poodle',
    'Beagle',
    'Rottweiler',
    'Yorkshire Terrier',
    'Border Collie',
    'Cavalier King Charles Spaniel',
  ],
  cat: [
    'Persian',
    'Maine Coon',
    'British Shorthair',
    'Ragdoll',
    'Siamese',
    'American Shorthair',
    'Scottish Fold',
    'Sphynx',
    'Domestic Shorthair',
  ],
  bird: [
    'Canary',
    'Parakeet',
    'Cockatiel',
    'Lovebird',
    'Finch',
    'Cockatoo',
    'Macaw',
    'African Grey',
  ],
  fish: ['Goldfish', 'Betta', 'Guppy', 'Angelfish', 'Tetra', 'Cichlid', 'Molly', 'Platy'],
  rabbit: [
    'Holland Lop',
    'Netherland Dwarf',
    'Mini Rex',
    'Lionhead',
    'Flemish Giant',
    'English Lop',
    'French Lop',
    'American Fuzzy Lop',
  ],
  hamster: ['Syrian', 'Dwarf Campbell', 'Dwarf Winter White', 'Roborovski', 'Chinese', 'European'],
  guinea_pig: [
    'American',
    'Abyssinian',
    'Peruvian',
    'Silkie',
    'Teddy',
    'Texel',
    'Coronet',
    'Lunkarya',
  ],
  reptile: [
    'Bearded Dragon',
    'Leopard Gecko',
    'Ball Python',
    'Corn Snake',
    'Green Iguana',
    'Blue Tongue Skink',
    'Crested Gecko',
    'Tortoise',
  ],
  other: ['Ferret', 'Chinchilla', 'Hedgehog', 'Sugar Glider', 'Rat', 'Mouse', 'Gerbil', 'Degus'],
};

const PetFormModal = ({
  isVisible,
  editingPet,
  loading,
  onCancel,
  onSubmit,
}: PetFormModalProps) => {
  const [form] = Form.useForm();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');

  // Common pet species - using static list
  const petSpecies = [
    'dog',
    'cat',
    'bird',
    'fish',
    'rabbit',
    'hamster',
    'guinea_pig',
    'reptile',
    'other',
  ];

  const genders = ['male', 'female'];
  const sizes = ['small', 'medium', 'large'];

  useEffect(() => {
    if (isVisible) {
      if (editingPet) {
        form.setFieldsValue({
          name: editingPet.name,
          species: editingPet.species,
          breed: editingPet.breed,
          gender: editingPet.gender,
          date_of_birth: editingPet.date_of_birth ? dayjs(editingPet.date_of_birth) : null,
          weight: editingPet.weight,
          size: editingPet.size,
          color: editingPet.color,
          microchip_number: editingPet.microchip_number,
          is_spayed_neutered: editingPet.is_spayed_neutered,
          is_vaccinated: editingPet.is_vaccinated,
          medical_history: editingPet.medical_history,
          behavioral_notes: editingPet.behavioral_notes,
          dietary_requirements: editingPet.dietary_requirements,
          allergies: editingPet.allergies,
          medications: editingPet.medications,
          emergency_contact: editingPet.emergency_contact,
          emergency_phone: editingPet.emergency_phone,
          photo_url: editingPet.photo_url,
          is_active: editingPet.is_active,
          owner_id: editingPet.owner_id,
        });
        setSelectedSpecies(editingPet.species);
      } else {
        form.resetFields();
        setSelectedSpecies('');
      }
    }
  }, [editingPet, form, isVisible]);

  useEffect(() => {
    // Use static breeds data
    if (selectedSpecies) {
      setBreeds(COMMON_BREEDS[selectedSpecies] || []);
    } else {
      setBreeds([]);
    }
  }, [selectedSpecies]);

  const handleSubmit = useCallback(
    (values: any) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setSelectedSpecies('');
    onCancel();
  }, [form, onCancel]);

  const handleSpeciesChange = (value: string) => {
    setSelectedSpecies(value);
    form.setFieldsValue({ breed: undefined }); // Reset breed when species changes
  };

  // Don't render the form if modal is not visible
  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      title={editingPet ? 'Edit Pet' : 'Add New Pet'}
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnHidden={true}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          is_active: true,
          is_spayed_neutered: false,
          is_vaccinated: false,
          allergies: [],
          medications: [],
        }}
      >
        {/* Basic Information */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Basic Information</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='name'
                label='Pet Name'
                rules={[{ required: true, message: 'Please enter pet name' }]}
              >
                <Input placeholder='Pet Name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='species'
                label='Species'
                rules={[{ required: true, message: 'Please select species' }]}
              >
                <Select placeholder='Select Species' onChange={handleSpeciesChange}>
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
              <Form.Item name='breed' label='Breed'>
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
              <Form.Item name='weight' label='Weight (kg)'>
                <Input placeholder='Weight in kg' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='color' label='Color'>
                <Input placeholder='Pet color' />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Medical Information */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Medical Information</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='microchip_number' label='Microchip Number'>
                <Input placeholder='Microchip number' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='is_spayed_neutered' label='Spayed/Neutered' valuePropName='checked'>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='is_vaccinated' label='Vaccinated' valuePropName='checked'>
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='medical_history' label='Medical History'>
            <Input.TextArea placeholder='Medical history and notes' rows={3} />
          </Form.Item>

          <Form.Item name='behavioral_notes' label='Behavioral Notes'>
            <Input.TextArea placeholder='Behavioral notes and temperament' rows={3} />
          </Form.Item>
        </div>

        {/* Care Information */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Care Information</h3>
          <Form.Item name='dietary_requirements' label='Dietary Requirements'>
            <Input.TextArea placeholder='Dietary requirements and preferences' rows={2} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='allergies' label='Allergies'>
                <Select mode='tags' placeholder='Enter allergies' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='medications' label='Medications'>
                <Select mode='tags' placeholder='Enter medications' />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Emergency Contact */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Emergency Contact</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='emergency_contact'
                label='Emergency Contact Name'
                rules={[{ required: true, message: 'Please enter emergency contact name' }]}
              >
                <Input placeholder='Emergency contact name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='emergency_phone'
                label='Emergency Phone'
                rules={[{ required: true, message: 'Please enter emergency phone' }]}
              >
                <Input placeholder='Emergency phone number' />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Owner Information */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Owner Information</h3>
          <Form.Item
            name='owner_id'
            label='Owner ID'
            rules={[{ required: true, message: 'Please enter owner ID' }]}
          >
            <Input placeholder='Owner ID' />
          </Form.Item>
        </div>

        {/* Photo and Status */}
        <div className='mb-6'>
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item name='photo_url' label='Photo URL'>
                <Input placeholder='Photo URL' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='is_active' label='Active Status' valuePropName='checked'>
                <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Form.Item className='mb-0'>
          <Space className='w-full justify-end'>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              className='bg-primary-navy border-primary-navy'
            >
              {editingPet ? 'Update Pet' : 'Add Pet'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PetFormModal;
