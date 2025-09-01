import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import type { PetFormModalProps } from '@/types';

const { Option } = Select;

// Common breeds by type - moved outside component to prevent recreation on every render
const COMMON_BREEDS: Record<string, string[]> = {
  dog: [
    'Labrador',
    'Golden Retriever',
    'German Shepherd',
    'Bulldog',
    'Poodle',
    'Beagle',
    'Rottweiler',
    'Yorkshire Terrier',
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
  const [selectedType, setSelectedType] = useState<string>('');

  // Common pet types - using static list since API endpoint doesn't exist
  const petTypes = [
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

  useEffect(() => {
    if (isVisible) {
      if (editingPet) {
        form.setFieldsValue({
          name: editingPet.name,
          type: editingPet.type,
          breed: editingPet.breed,
          age: editingPet.age,
          weight: editingPet.weight,
          ownerName: editingPet.ownerName,
          ownerEmail: editingPet.ownerEmail,
          ownerPhone: editingPet.ownerPhone,
          microchipId: editingPet.microchipId,
          isActive: editingPet.isActive,
        });
        setSelectedType(editingPet.type);
      } else {
        form.resetFields();
        setSelectedType('');
      }
    }
  }, [editingPet, form, isVisible]);

  useEffect(() => {
    // Use static breeds data since API endpoint doesn't exist
    if (selectedType) {
      setBreeds(COMMON_BREEDS[selectedType] || []);
    } else {
      setBreeds([]);
    }
  }, [selectedType]);

  const handleSubmit = useCallback(
    (values: any) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setSelectedType('');
    onCancel();
  }, [form, onCancel]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setFieldsValue({ breed: undefined }); // Reset breed when type changes
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
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          isActive: true,
        }}
      >
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
              name='type'
              label='Pet Type'
              rules={[{ required: true, message: 'Please select pet type' }]}
            >
              <Select placeholder='Select Pet Type' onChange={handleTypeChange}>
                {petTypes.map(type => (
                  <Option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='breed' label='Breed'>
              <Select placeholder='Select Breed' disabled={!selectedType}>
                {breeds.map(breed => (
                  <Option key={breed} value={breed}>
                    {breed}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='microchipId' label='Microchip ID'>
              <Input placeholder='Microchip ID' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name='age' label='Age (years)'>
              <InputNumber placeholder='Age' min={0} max={50} className='w-full' precision={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='weight' label='Weight (kg)'>
              <InputNumber
                placeholder='Weight'
                min={0}
                max={200}
                className='w-full'
                precision={2}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='isActive' label='Status' valuePropName='checked'>
              <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='ownerName'
              label='Owner Name'
              rules={[{ required: true, message: 'Please enter owner name' }]}
            >
              <Input placeholder='Owner Name' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='ownerPhone' label='Owner Phone'>
              <Input placeholder='Owner Phone' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name='ownerEmail'
          label='Owner Email'
          rules={[{ type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder='Owner Email' />
        </Form.Item>

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
