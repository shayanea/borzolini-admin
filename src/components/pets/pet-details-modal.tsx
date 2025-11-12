import { UserOutlined } from '@ant-design/icons';
import { Avatar, Modal } from 'antd';

import type { PetDetailsModalProps } from '@/types';
import {
  PetBasicInfoCard,
  PetCareInfoCard,
  PetEmergencyContactCard,
  PetMedicalInfoCard,
  PetOwnerInfoCard,
  PetTimestampsCard,
} from './pet-details-sections';

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
        <PetBasicInfoCard pet={pet} />
        <PetMedicalInfoCard pet={pet} />
        <PetCareInfoCard pet={pet} />
        <PetEmergencyContactCard pet={pet} />
        <PetOwnerInfoCard pet={pet} />
        <PetTimestampsCard pet={pet} />
      </div>
    </Modal>
  );
};

export default PetDetailsModal;
