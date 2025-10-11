import { Avatar, Badge, Button, Space, Table, Tag, Tooltip } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PhoneOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import type { Appointment } from '@/types';
import { TABLE_PAGE_SIZES } from '@/constants';
import {
  formatAppointmentType,
  getAppointmentPriorityColor,
  getAppointmentStatusColor,
  getPetGenderColor,
  getPetSpeciesColor,
} from '@/utils/color-helpers';

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
  onView: (appointment: Appointment) => void;
  onCancel: (id: string) => void;
  onPagination?: (page: number, pageSize: number) => void;
}

const AppointmentsTable = ({
  appointments,
  loading,
  pagination,
  onView,
  onCancel,
  onPagination,
}: AppointmentsTableProps) => {
  const createActionHandlers = (appointment: Appointment) => {
    const handleView = () => {
      onView(appointment);
    };
    const handleCancel = () => onCancel(appointment.id || '');

    return { handleView, handleCancel };
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Pet & Owner',
      key: 'pet_owner',
      width: 280,
      render: (appointment: Appointment) => (
        <div className='flex items-center space-x-3'>
          <Avatar
            size={40}
            src={appointment.pet?.photo_url}
            icon={<UserOutlined />}
            className='bg-gradient-to-r from-cyan-500 to-blue-500'
          />
          <div className='flex-1'>
            <div className='font-medium'>{appointment.pet?.name || 'Unknown Pet'}</div>
            <div className='text-sm text-text-light'>
              {appointment.pet?.breed
                ? `${appointment.pet.breed} ${appointment.pet.species}`
                : appointment.pet?.species || 'Unknown Species'}
            </div>
            <div className='text-xs text-text-light'>
              Owner ID: {appointment.owner_id || 'Unknown'}
            </div>
            {appointment.pet?.emergency_contact && (
              <div className='text-xs text-text-light flex items-center'>
                <PhoneOutlined className='mr-1' />
                {appointment.pet.emergency_contact}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Service & Type',
      key: 'service_type',
      width: 200,
      render: (appointment: Appointment) => (
        <div className='space-y-1'>
          <div>
            <Tag color='blue'>
              {appointment.service?.name ||
                formatAppointmentType(appointment.appointment_type) ||
                'Unknown Service'}
            </Tag>
          </div>
          <div>
            <Tag color={getAppointmentPriorityColor(appointment.priority)}>
              {appointment.priority
                ? appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)
                : 'Normal'}
            </Tag>
          </div>
          {appointment.service?.price && (
            <div className='text-xs text-text-light'>
              ${appointment.service.price} {appointment.service.currency}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      width: 180,
      render: (appointment: Appointment) => (
        <div>
          <div className='font-medium flex items-center'>
            <CalendarOutlined className='mr-1 text-xs' />
            {appointment.scheduled_date
              ? new Date(appointment.scheduled_date).toLocaleDateString()
              : 'No date set'}
          </div>
          <div className='text-sm text-text-light flex items-center'>
            <ClockCircleOutlined className='mr-1 text-xs' />
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
        <div className='space-y-1'>
          <Badge
            status={
              appointment.status === 'confirmed'
                ? 'success'
                : appointment.status === 'pending'
                  ? 'processing'
                  : appointment.status === 'cancelled'
                    ? 'error'
                    : 'default'
            }
            text={
              <Tag color={getAppointmentStatusColor(appointment.status)}>
                {appointment.status
                  ? appointment.status
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  : 'Unknown'}
              </Tag>
            }
          />
          {appointment.status === 'completed' && (
            <div className='flex items-center justify-center space-x-1'>
              {appointment.is_home_visit && <Tag color='blue'>Home Visit</Tag>}
              <Tooltip title='Review status will be shown here'>
                <StarOutlined className='text-yellow-500 text-xs' />
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Clinic & Staff',
      key: 'clinic_staff',
      width: 250,
      render: (appointment: Appointment) => (
        <div className='text-sm'>
          <div className='font-medium flex items-center'>
            <EnvironmentOutlined className='mr-1 text-xs' />
            {appointment.clinic?.name || 'Unknown Clinic'}
          </div>
          <div className='text-text-light'>
            {appointment.clinic?.city && appointment.clinic?.state
              ? `${appointment.clinic.city}, ${appointment.clinic.state}`
              : 'Location not specified'}
          </div>
          <div className='text-xs text-text-light'>
            Staff: {appointment.staff?.specialization || appointment.staff?.role || 'Unassigned'}
          </div>
          {appointment.staff?.license_number && (
            <div className='text-xs text-text-light'>
              License: {appointment.staff.license_number}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Pet Details',
      key: 'pet_details',
      width: 200,
      render: (appointment: Appointment) => (
        <div className='space-y-1'>
          {appointment.pet && (
            <>
              <div className='flex gap-1'>
                <Tag color={getPetSpeciesColor(appointment.pet.species)}>
                  {appointment.pet.species.charAt(0).toUpperCase() +
                    appointment.pet.species.slice(1)}
                </Tag>
                <Tag color={getPetGenderColor(appointment.pet.gender)}>{appointment.pet.gender}</Tag>
              </div>
              <div className='text-xs text-text-light'>Weight: {appointment.pet.weight} kg</div>
              <div className='text-xs text-text-light'>
                Age:{' '}
                {appointment.pet.date_of_birth
                  ? Math.floor(
                      (new Date().getTime() - new Date(appointment.pet.date_of_birth).getTime()) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )
                  : 'Unknown'}{' '}
                years
              </div>
              <div className='flex gap-1'>
                <Tag color={appointment.pet.is_vaccinated ? 'green' : 'red'}>
                  {appointment.pet.is_vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                </Tag>
                <Tag color={appointment.pet.is_spayed_neutered ? 'green' : 'orange'}>
                  {appointment.pet.is_spayed_neutered ? 'Spayed/Neutered' : 'Not Spayed/Neutered'}
                </Tag>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Notes',
      key: 'notes',
      width: 250,
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
        const { handleView, handleCancel } = createActionHandlers(appointment);

        return (
          <Space size='small'>
            <Tooltip title='View Appointment Details'>
              <Button
                type='text'
                icon={<EyeOutlined />}
                size='small'
                className='text-primary-navy hover:text-primary-dark'
                onClick={handleView}
              />
            </Tooltip>
            <Tooltip title='Cancel Appointment'>
              <Button
                type='text'
                icon={<DeleteOutlined />}
                size='small'
                danger
                onClick={handleCancel}
                disabled={
                  !appointment.status ||
                  appointment.status === 'cancelled' ||
                  appointment.status === 'completed'
                }
              />
            </Tooltip>
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

  const handleShowTotal = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} of ${total} appointments`;
  };

  const tablePagination = pagination
    ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: handleShowTotal,
        pageSizeOptions: TABLE_PAGE_SIZES.map(String),
        position: ['bottomCenter'] as (
          | 'topLeft'
          | 'topCenter'
          | 'topRight'
          | 'bottomLeft'
          | 'bottomCenter'
          | 'bottomRight'
        )[],
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
    <div className='admin-card'>
      <Table
        columns={columns}
        dataSource={safeAppointments}
        rowKey={record => record?.id || Math.random().toString()}
        loading={loading}
        size='middle'
        pagination={tablePagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
        className='appointments-table custom-scrollbar'
        rowClassName={() => 'hover:bg-gray-50'}
      />
    </div>
  );
};

export default AppointmentsTable;
