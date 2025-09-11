import { Button, Card, Col, Modal, Row, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { Contact, ContactFilters as ContactFiltersType } from '@/types';
import { ContactDetailsModal, ContactFilters, ContactTable } from '@/components/contact';

import { useContacts } from '@/hooks/use-contacts';
import { useState } from 'react';

const Contacts = () => {
  const [filters, setFilters] = useState<ContactFiltersType>({});
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    contacts,
    loading,
    stats,
    statsLoading,
    // handleFilters,
    // handlePagination,
    handleUpdateContact,
    handleDeleteContact,
    handleExport,
    handleCreateResponse,
    // clearError,
  } = useContacts({ filters });

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const handleEditContact = (contact: Contact) => {
    // Implement edit functionality
    console.log('Edit contact:', contact);
  };

  const handleDeleteContactConfirm = (id: string) => {
    Modal.confirm({
      title: 'Delete Contact',
      content: 'Are you sure you want to delete this contact? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDeleteContact(id),
    });
  };

  const handleUpdateStatus = (id: string, status: Contact['status']) => {
    handleUpdateContact(id, { status });
  };

  const handleRespond = (contact: Contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const handleAddResponse = (contactId: string, message: string) => {
    handleCreateResponse(contactId, { message });
  };

  const handleUpdateContactData = (id: string, data: any) => {
    handleUpdateContact(id, data);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold'>Contact Messages</h1>
          <p className='text-gray-600'>Manage contact form submissions</p>
        </div>
        <Button type='primary' icon={<PlusOutlined />}>
          New Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Total Messages'
              value={stats?.total || 0}
              prefix={<MessageOutlined />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Pending'
              value={stats?.pending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Resolved'
              value={stats?.resolved || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title='Closed'
              value={stats?.closed || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <ContactFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExport={() => handleExport(filters)}
        onReset={() => setFilters({})}
      />

      {/* Contact Table */}
      <Card>
        <ContactTable
          contacts={contacts}
          loading={loading}
          onEdit={handleEditContact}
          onView={handleViewContact}
          onDelete={handleDeleteContactConfirm}
          onUpdateStatus={handleUpdateStatus}
          onRespond={handleRespond}
        />
      </Card>

      {/* Contact Details Modal */}
      <ContactDetailsModal
        visible={modalVisible}
        contact={selectedContact}
        responses={[]} // You'll need to fetch responses
        loading={false}
        onClose={() => {
          setModalVisible(false);
          setSelectedContact(null);
        }}
        onUpdate={handleUpdateContactData}
        onAddResponse={handleAddResponse}
      />
    </div>
  );
};

export default Contacts;
