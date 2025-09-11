import { Button, Descriptions, Divider, Input, Modal, Space, Tag, Timeline } from 'antd';
import {
  CalendarOutlined,
  EditOutlined,
  MailOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { Contact, ContactResponseItem } from '@/types';

import { useState } from 'react';

interface ContactDetailsModalProps {
  visible: boolean;
  contact: Contact | null;
  responses: ContactResponseItem[];
  loading: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
  onAddResponse: (contactId: string, message: string) => void;
}

export const ContactDetailsModal = ({
  visible,
  contact,
  responses,
  // loading,
  onClose,
  onUpdate,
  onAddResponse,
}: ContactDetailsModalProps) => {
  const [responseText, setResponseText] = useState('');
  const [adminNotes, setAdminNotes] = useState(contact?.adminNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!contact) return null;

  const handleAddResponse = () => {
    if (responseText.trim()) {
      onAddResponse(contact.id, responseText.trim());
      setResponseText('');
    }
  };

  const handleUpdateNotes = () => {
    onUpdate(contact.id, { adminNotes });
    setIsEditingNotes(false);
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'in_progress':
        return 'blue';
      case 'resolved':
        return 'green';
      case 'closed':
        return 'gray';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title='Contact Details'
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div className='space-y-6'>
        {/* Contact Information */}
        <Descriptions title='Contact Information' bordered column={2} size='small'>
          <Descriptions.Item label='Name' span={1}>
            <Space>
              <UserOutlined />
              {contact.name}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label='Email' span={1}>
            <Space>
              <MailOutlined />
              {contact.email}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label='Subject' span={2}>
            {contact.subject}
          </Descriptions.Item>
          <Descriptions.Item label='Status' span={1}>
            <Tag color={getStatusColor(contact.status)}>
              {contact.status.replace('_', ' ').toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Date' span={1}>
            <Space>
              <CalendarOutlined />
              {new Date(contact.createdAt).toLocaleString()}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label='IP Address' span={1}>
            {contact.ipAddress || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label='User Agent' span={1}>
            {contact.userAgent ? (
              <span className='text-xs text-gray-500' title={contact.userAgent}>
                {contact.userAgent.substring(0, 50)}...
              </span>
            ) : (
              'N/A'
            )}
          </Descriptions.Item>
        </Descriptions>

        {/* Message */}
        <div>
          <h4 className='font-medium mb-2'>Message</h4>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='whitespace-pre-wrap'>{contact.message}</p>
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='font-medium'>Admin Notes</h4>
            <Button
              type='text'
              size='small'
              icon={<EditOutlined />}
              onClick={() => setIsEditingNotes(!isEditingNotes)}
            >
              {isEditingNotes ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          {isEditingNotes ? (
            <div className='space-y-2'>
              <Input.TextArea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={3}
                placeholder='Add admin notes...'
              />
              <Space>
                <Button type='primary' size='small' onClick={handleUpdateNotes}>
                  Save
                </Button>
                <Button size='small' onClick={() => setIsEditingNotes(false)}>
                  Cancel
                </Button>
              </Space>
            </div>
          ) : (
            <div className='bg-gray-50 p-4 rounded-lg min-h-[60px]'>
              {contact.adminNotes || 'No admin notes'}
            </div>
          )}
        </div>

        <Divider />

        {/* Responses */}
        <div>
          <h4 className='font-medium mb-4'>Responses</h4>

          {/* Add Response */}
          <div className='mb-4'>
            <Input.TextArea
              value={responseText}
              onChange={e => setResponseText(e.target.value)}
              placeholder='Type your response...'
              rows={3}
            />
            <div className='mt-2'>
              <Button
                type='primary'
                icon={<MessageOutlined />}
                onClick={handleAddResponse}
                disabled={!responseText.trim()}
              >
                Send Response
              </Button>
            </div>
          </div>

          {/* Responses Timeline */}
          <Timeline>
            {responses.map(response => (
              <Timeline.Item key={response.id}>
                <div className='bg-blue-50 p-3 rounded-lg'>
                  <div className='flex justify-between items-start mb-1'>
                    <span className='font-medium text-sm'>{response.sentBy}</span>
                    <span className='text-xs text-gray-500'>
                      {new Date(response.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <p className='text-sm'>{response.message}</p>
                </div>
              </Timeline.Item>
            ))}
            {responses.length === 0 && (
              <Timeline.Item>
                <div className='text-gray-500 text-center py-4'>No responses yet</div>
              </Timeline.Item>
            )}
          </Timeline>
        </div>
      </div>
    </Modal>
  );
};
