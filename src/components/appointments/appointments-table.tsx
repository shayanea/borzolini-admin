import { APPOINTMENT_PRIORITY_COLORS, APPOINTMENT_STATUS_COLORS } from '@/constants/appointments';
import { Avatar, Button, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';

import type { Appointment } from '@/types';
import type { UpdateAppointmentData } from '@/services/appointments.service';

export interface AppointmentsHeaderProps {
  onNewAppointment: (data: any) => void;
}

export interface AppointmentsTableProps {
  appointments: Appointment[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onEdit: (id: string, data: UpdateAppointmentData) => Promise<Appointment>;
  onCancel: (id: string) => void;
  onPagination?: (page: number, pageSize: number) => void;
}

const AppointmentsTable = ({
  appointments,
  loading,
  pagination,
  onEdit,
  onCancel,
  onPagination,
}: AppointmentsTableProps) => {
  const createActionHandlers = (appointment: Appointment) => {
    const handleEdit = () => {
      // Convert Appointment to UpdateAppointmentData by extracting only updatable fields
      const updateData: UpdateAppointmentData = {
        appointment_type: appointment.appointment_type as any, // Cast to AppointmentType
        status: appointment.status || 'pending',
        priority: appointment.priority || 'normal',
        scheduled_date: appointment.scheduled_date || new Date().toISOString(),
        duration_minutes: appointment.duration_minutes || 30,
        notes: appointment.notes || '',
        reason: appointment.reason || '',
        symptoms: appointment.symptoms || '',
        diagnosis: appointment.diagnosis || '',
        treatment_plan: appointment.treatment_plan || '',
        prescriptions: appointment.prescriptions || [],
        follow_up_instructions: appointment.follow_up_instructions || '',
        cost: appointment.cost || 0,
        payment_status: appointment.payment_status || 'pending',
        is_telemedicine: appointment.is_telemedicine || false,
        telemedicine_link: appointment.telemedicine_link || '',
        home_visit_address: appointment.home_visit_address || '',
        is_home_visit: appointment.is_home_visit || false,
        pet_id: appointment.pet_id || '',
        clinic_id: appointment.clinic_id || '',
        staff_id: appointment.staff_id || '',
        service_id: appointment.service_id || '',
      };
      onEdit(appointment.id || '', updateData);
    };
    const handleCancel = () => onCancel(appointment.id || '');

    return { handleEdit, handleCancel };
  };

  const formatAppointmentType = (type: string) => {
    if (!type) return 'Unknown';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Client & Pet',
      key: 'client',
      width: 240,
      render: (appointment: Appointment) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div>
            <div className='font-medium'>Client ID: {appointment.owner_id || 'Unknown'}</div>
            <div className='text-sm text-text-light'>Pet ID: {appointment.pet_id || 'Unknown'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Type & Priority',
      key: 'type_priority',
      width: 180,
      render: (appointment: Appointment) => (
        <div className='space-y-1'>
          <div>
            <Tag color='blue'>
              {appointment.appointment_type
                ? formatAppointmentType(appointment.appointment_type)
                : 'Unknown'}
            </Tag>
          </div>
          <div>
            <Tag color={APPOINTMENT_PRIORITY_COLORS[appointment.priority] || 'default'}>
              {appointment.priority
                ? appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)
                : 'Normal'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      width: 170,
      render: (appointment: Appointment) => (
        <div>
          <div className='font-medium'>
            {appointment.scheduled_date
              ? new Date(appointment.scheduled_date).toLocaleDateString()
              : 'No date set'}
          </div>
          <div className='text-sm text-text-light'>
            {appointment.scheduled_date
              ? new Date(appointment.scheduled_date).toLocaleTimeString()
              : ''}
            {appointment.duration_minutes ? ` (${appointment.duration_minutes} min)` : ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (appointment: Appointment) => (
        <Tag color={APPOINTMENT_STATUS_COLORS[appointment.status] || 'default'}>
          {appointment.status
            ? appointment.status
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            : 'Unknown'}
        </Tag>
      ),
    },
    {
      title: 'Clinic & Staff',
      key: 'clinic_staff',
      width: 220,
      render: (appointment: Appointment) => (
        <div className='text-sm'>
          <div className='font-medium'>Clinic: {appointment.clinic_id || 'Unknown'}</div>
          <div className='text-text-light'>Staff: {appointment.staff_id || 'Unassigned'}</div>
        </div>
      ),
    },
    {
      title: 'Notes',
      key: 'notes',
      width: 300,
      ellipsis: true,
      render: (appointment: Appointment) => (
        <Tooltip title={appointment.notes || 'No notes'}>
          <div className='text-sm text-text-light truncate'>{appointment.notes || 'No notes'}</div>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      align: 'center',
      render: (appointment: Appointment) => {
        const { handleEdit, handleCancel } = createActionHandlers(appointment);

        return (
          <Space size='small'>
            <Button
              type='text'
              icon={<EditOutlined />}
              size='small'
              className='text-primary-navy hover:text-primary-dark'
              title='Edit Appointment'
              onClick={handleEdit}
            />
            <Button
              type='text'
              icon={<DeleteOutlined />}
              size='small'
              danger
              title='Cancel Appointment'
              onClick={handleCancel}
              disabled={
                !appointment.status ||
                appointment.status === 'cancelled' ||
                appointment.status === 'completed'
              }
            />
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

  const tablePagination = pagination
    ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
          `${range[0]}-${range[1]} of ${total} appointments`,
      }
    : false;

  // Ensure appointments is always an array and validate each appointment
  const safeAppointments = Array.isArray(appointments)
    ? appointments
        .filter(appointment => appointment && typeof appointment === 'object' && appointment.id)
        .map(appointment => {
          // Log any problematic appointments for debugging
          if (!appointment.priority || !appointment.status || !appointment.appointment_type) {
            console.warn('Appointment missing required fields:', appointment);
          }

          return appointment;
        })
        .map(appointment => ({
          ...appointment,
          priority: appointment.priority || 'normal',
          status: appointment.status || 'pending',
          appointment_type: appointment.appointment_type || 'consultation',
          scheduled_date: appointment.scheduled_date || new Date().toISOString(),
          duration_minutes: appointment.duration_minutes || 30,
          notes: appointment.notes || '',
          reason: appointment.reason || '',
          symptoms: appointment.symptoms || '',
          diagnosis: appointment.diagnosis || '',
          treatment_plan: appointment.treatment_plan || '',
          prescriptions: appointment.prescriptions || [],
          follow_up_instructions: appointment.follow_up_instructions || '',
          cost: appointment.cost || 0,
          payment_status: appointment.payment_status || 'pending',
          is_telemedicine: appointment.is_telemedicine || false,
          telemedicine_link: appointment.telemedicine_link || '',
          home_visit_address: appointment.home_visit_address || '',
          is_home_visit: appointment.is_home_visit || false,
          reminder_settings: appointment.reminder_settings || {},
          is_active: appointment.is_active ?? true,
          created_at: appointment.created_at || new Date().toISOString(),
          updated_at: appointment.updated_at || new Date().toISOString(),
          owner_id: appointment.owner_id || '',
          pet_id: appointment.pet_id || '',
          clinic_id: appointment.clinic_id || '',
          staff_id: appointment.staff_id || '',
          service_id: appointment.service_id || '',
        }))
    : [];

  // Add additional safety check
  if (!Array.isArray(safeAppointments)) {
    console.error('safeAppointments is not an array:', safeAppointments);
    return <div>Error: Invalid appointments data</div>;
  }

  return (
    <Table
      columns={columns}
      dataSource={safeAppointments}
      rowKey={record => record?.id || Math.random().toString()}
      loading={loading}
      size='middle'
      pagination={tablePagination}
      onChange={handleTableChange}
      scroll={{ x: 1300 }}
      className='appointments-table admin-table'
      rowClassName={() => 'hover:bg-gray-50'}
    />
  );
};

export default AppointmentsTable;
