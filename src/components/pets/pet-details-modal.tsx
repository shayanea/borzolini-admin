import { CalendarOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Card, Descriptions, Modal, Tag } from 'antd';

import type { PetDetailsModalProps } from '@/types';
import { getPetGenderColor, getPetSizeColor, getPetSpeciesColor } from '@/utils/color-helpers';

const PetDetailsModal = ({ pet, isVisible, onClose }: PetDetailsModalProps) => {
  if (!pet) return null;

  return (
    <Modal
      title={
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            src={pet.photo_url}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <div className='text-lg font-semibold'>{pet.name}</div>
            <div className='text-sm text-text-light'>
              {pet.breed ? `${pet.breed} ${pet.species}` : pet.species}
            </div>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className='space-y-6'>
        {/* Basic Information */}
        <Card title='Basic Information' size='small'>
          <Descriptions column={2} size='small'>
            <Descriptions.Item label='Name'>
              <span className='font-medium'>{pet.name}</span>
            </Descriptions.Item>

            <Descriptions.Item label='Species'>
              <Tag color={getPetSpeciesColor(pet.species)}>
                {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
              </Tag>
            </Descriptions.Item>

            {pet.breed && <Descriptions.Item label='Breed'>{pet.breed}</Descriptions.Item>}

            <Descriptions.Item label='Gender'>
              <Tag color={getPetGenderColor(pet.gender)}>
                {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label='Size'>
              <Tag color={getPetSizeColor(pet.size)}>
                {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label='Date of Birth'>
              <CalendarOutlined className='mr-1' />
              {new Date(pet.date_of_birth).toLocaleDateString()}
            </Descriptions.Item>

            {pet.weight && <Descriptions.Item label='Weight'>{pet.weight} kg</Descriptions.Item>}

            {pet.color && <Descriptions.Item label='Color'>{pet.color}</Descriptions.Item>}

            <Descriptions.Item label='Status'>
              <Badge
                status={pet.is_active ? 'success' : 'error'}
                text={pet.is_active ? 'Active' : 'Inactive'}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Medical Information */}
        <Card title='Medical Information' size='small'>
          <Descriptions column={2} size='small'>
            {pet.microchip_number && (
              <Descriptions.Item label='Microchip Number'>
                <code className='bg-gray-100 px-2 py-1 rounded'>{pet.microchip_number}</code>
              </Descriptions.Item>
            )}

            <Descriptions.Item label='Spayed/Neutered'>
              <Tag color={pet.is_spayed_neutered ? 'green' : 'orange'}>
                {pet.is_spayed_neutered ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label='Vaccinated'>
              <Tag color={pet.is_vaccinated ? 'green' : 'red'}>
                {pet.is_vaccinated ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>

            {pet.medical_history && (
              <Descriptions.Item label='Medical History' span={2}>
                {pet.medical_history}
              </Descriptions.Item>
            )}

            {pet.behavioral_notes && (
              <Descriptions.Item label='Behavioral Notes' span={2}>
                {pet.behavioral_notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Care Information */}
        <Card title='Care Information' size='small'>
          <Descriptions column={2} size='small'>
            {pet.dietary_requirements && (
              <Descriptions.Item label='Dietary Requirements' span={2}>
                {pet.dietary_requirements}
              </Descriptions.Item>
            )}

            {pet.allergies && pet.allergies.length > 0 && (
              <Descriptions.Item label='Allergies'>
                <div className='flex flex-wrap gap-1'>
                  {pet.allergies.map((allergy, index) => (
                    <Tag key={index} color='red'>
                      {allergy}
                    </Tag>
                  ))}
                </div>
              </Descriptions.Item>
            )}

            {pet.medications && pet.medications.length > 0 && (
              <Descriptions.Item label='Medications'>
                <div className='flex flex-wrap gap-1'>
                  {pet.medications.map((medication, index) => (
                    <Tag key={index} color='blue'>
                      {medication}
                    </Tag>
                  ))}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Emergency Contact */}
        <Card title='Emergency Contact' size='small'>
          <Descriptions column={2} size='small'>
            <Descriptions.Item label='Contact Name'>{pet.emergency_contact}</Descriptions.Item>

            <Descriptions.Item label='Contact Phone'>
              <PhoneOutlined className='mr-1' />
              <a href={`tel:${pet.emergency_phone}`} className='text-blue-600'>
                {pet.emergency_phone}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Owner Information */}
        <Card title='Owner Information' size='small'>
          <Descriptions column={2} size='small'>
            <Descriptions.Item label='Name'>
              <span className='font-medium'>
                {pet.owner.firstName} {pet.owner.lastName}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label='Email'>
              <MailOutlined className='mr-1' />
              <a href={`mailto:${pet.owner.email}`} className='text-blue-600'>
                {pet.owner.email}
              </a>
            </Descriptions.Item>

            <Descriptions.Item label='Phone'>
              <PhoneOutlined className='mr-1' />
              <a href={`tel:${pet.owner.phone}`} className='text-blue-600'>
                {pet.owner.phone}
              </a>
            </Descriptions.Item>

            <Descriptions.Item label='Date of Birth'>
              {pet.owner.dateOfBirth ? new Date(pet.owner.dateOfBirth).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>

            <Descriptions.Item label='Address' span={2}>
              {pet.owner.address}, {pet.owner.city}, {pet.owner.postalCode}, {pet.owner.country}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Timestamps */}
        <Card title='Timestamps' size='small'>
          <Descriptions column={2} size='small'>
            <Descriptions.Item label='Created'>
              <CalendarOutlined className='mr-1' />
              {new Date(pet.created_at).toLocaleString()}
            </Descriptions.Item>

            <Descriptions.Item label='Last Updated'>
              <CalendarOutlined className='mr-1' />
              {new Date(pet.updated_at).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </Modal>
  );
};

export default PetDetailsModal;
