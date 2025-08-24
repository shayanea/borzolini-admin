import { Avatar, Button, Space, Table, Tag, Tooltip } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_PRIORITY_COLORS, APPOINTMENT_TYPES } from '@/constants/appointments';
import type { Appointment } from '@/types';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';

interface AppointmentsTableProps {
  appointments: Appointment[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (id: string, data: any) => void;
  onCancel: (id: string) => void;
  onPagination?: (page: number, pageSize: number) => void;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  loading = false,
  pagination,
  onEdit,
  onCancel,
  onPagination,
}) => {
  const createActionHandlers = (appointment: Appointment) => {
    const handleEdit = () => onEdit(appointment.id, appointment);
    const handleCancel = () => onCancel(appointment.id);

    return { handleEdit, handleCancel };
  };

  const formatAppointmentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const columns = [
    {
      title: 'Client & Pet',
      key: 'client',
      render: (appointment: Appointment) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-primary-orange to-primary-navy'
          />
          <div>
            <div className='font-medium'>Client ID: {appointment.owner_id}</div>
            <div className='text-sm text-text-light'>
              Pet ID: {appointment.pet_id}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Type & Priority',
      key: 'type_priority',
      render: (appointment: Appointment) => (
        <div className='space-y-1'>
          <div>
            <Tag color="blue">{formatAppointmentType(appointment.appointment_type)}</Tag>
          </div>
          <div>
            <Tag color={APPOINTMENT_PRIORITY_COLORS[appointment.priority] || 'default'}>
              {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (appointment: Appointment) => (
        <div>
          <div className='font-medium'>
            {new Date(appointment.scheduled_date).toLocaleDateString()}
          </div>
          <div className='text-sm text-text-light'>
            {new Date(appointment.scheduled_date).toLocaleTimeString()} 
            ({appointment.duration_minutes} min)
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (appointment: Appointment) => (
        <Tag color={APPOINTMENT_STATUS_COLORS[appointment.status] || 'default'}>
          {appointment.status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Tag>
      ),
    },
    {
      title: 'Clinic & Staff',
      key: 'clinic_staff',
      render: (appointment: Appointment) => (
        <div className='text-sm'>
          <div className='font-medium'>Clinic: {appointment.clinic_id}</div>
          <div className='text-text-light'>
            Staff: {appointment.staff_id || 'Unassigned'}
          </div>
        </div>
      ),
    },
    {
      title: 'Notes',
      key: 'notes',
      render: (appointment: Appointment) => (
        <Tooltip title={appointment.notes || 'No notes'}>
          <div className='text-sm text-text-light max-w-xs truncate'>
            {appointment.notes || 'No notes'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (appointment: Appointment) => {
        const { handleEdit, handleCancel } = createActionHandlers(appointment);

        return (
          <Space>
            <Button size='small' onClick={handleEdit}>
              Edit
            </Button>
            <Button 
              size='small' 
              danger 
              onClick={handleCancel}
              disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
            >
              Cancel
            </Button>
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    if (onPagination && paginationConfig.current && paginationConfig.pageSize) {
      onPagination(paginationConfig.current, paginationConfig.pageSize);
    }
  };

  const tablePagination = pagination ? {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) => 
      `${range[0]}-${range[1]} of ${total} appointments`,
  } : false;

  return (
    <Table
      columns={columns}
      dataSource={appointments}
      rowKey='id'
      loading={loading}
      pagination={tablePagination}
      onChange={handleTableChange}
      scroll={{ x: 1200 }}
    />
  );
};

export default AppointmentsTable;
