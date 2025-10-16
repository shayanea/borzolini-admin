import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal, Typography } from 'antd';

import type { User } from '@/types';
import { UserInfoCard, UserPetsCard } from './user-view-sections';

const { Title } = Typography;

interface UserViewModalProps {
  isVisible: boolean;
  user: User | null;
  onClose: () => void;
  hidePetsSection?: boolean;
}

const UserViewModal = ({
  isVisible,
  user,
  onClose,
  hidePetsSection = false,
}: UserViewModalProps) => {
  if (!user) return null;

  return (
    <Modal
      title={
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
      ]}
      width={900}
      destroyOnHidden={true}
    >
      <div className='space-y-6'>
        <UserInfoCard user={user} />
        {!hidePetsSection && <UserPetsCard user={user} isVisible={isVisible} />}
      </div>
    </Modal>
  );
};

export default UserViewModal;
