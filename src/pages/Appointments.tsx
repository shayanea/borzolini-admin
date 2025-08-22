import React from 'react';
import { Card, Typography, Button, Space, Table, Tag, Avatar, Input } from 'antd';
import { CalendarOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { Appointment } from '@/types';

const { Title, Text } = Typography;
const { Search } = Input;

// Mock data - replace with actual API calls
const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'Diego Rossi',
    petName: 'Bella',
    petType: 'Dog',
    startTime: '2024-01-15T07:30:00Z',
    endTime: '2024-01-15T08:20:00Z',
    veterinarianId: '1',
    veterinarianName: 'Dr. Alfhard Botwright',
    status: 'confirmed',
    notes: 'Regular checkup',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    clientName: 'Isabella Bianchi',
    petName: 'Oscar',
    petType: 'Turtle',
    startTime: '2024-01-15T07:30:00Z',
    endTime: '2024-01-15T08:50:00Z',
    veterinarianId: '2',
    veterinarianName: 'Dr. Faramund Eks',
    status: 'scheduled',
    notes: 'Vaccination appointment',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const Appointments: React.FC = () => {
  const columns = [
    {
      title: 'Client & Pet',
      key: 'client',
      render: (appointment: Appointment) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            icon={<CalendarOutlined />}
            className="bg-gradient-to-r from-primary-orange to-primary-navy"
          />
          <div>
            <div className="font-medium">{appointment.clientName}</div>
            <div className="text-sm text-text-light">
              {appointment.petName} ({appointment.petType})
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (appointment: Appointment) => (
        <div>
          <div className="font-medium">
            {new Date(appointment.startTime).toLocaleDateString()}
          </div>
          <div className="text-sm text-text-light">
            {new Date(appointment.startTime).toLocaleTimeString()} - {new Date(appointment.endTime).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Veterinarian',
      key: 'veterinarian',
      render: (appointment: Appointment) => (
        <div className="font-medium">{appointment.veterinarianName}</div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (appointment: Appointment) => (
        <Tag
          color={
            appointment.status === 'confirmed' ? 'green' :
            appointment.status === 'scheduled' ? 'blue' :
            appointment.status === 'in-progress' ? 'orange' :
            appointment.status === 'completed' ? 'purple' : 'red'
          }
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      key: 'notes',
      render: (appointment: Appointment) => (
        <div className="text-sm text-text-light max-w-xs truncate">
          {appointment.notes || 'No notes'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" danger>Cancel</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Appointments
          </Title>
          <Text className="text-text-light">
            Manage clinic appointments and schedules
          </Text>
        </div>
        
        <Button type="primary" icon={<PlusOutlined />} className="bg-primary-navy border-primary-navy">
          New Appointment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <Search
            placeholder="Search appointments..."
            allowClear
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Space>
            <Button>Filters</Button>
            <Button>Export</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={mockAppointments}
          rowKey="id"
          pagination={{
            total: mockAppointments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} appointments`,
          }}
        />
      </Card>
    </div>
  );
};

export default Appointments;
