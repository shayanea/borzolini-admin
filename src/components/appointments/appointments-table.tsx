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
import {
  formatAppointmentType,
  getAppointmentPriorityColor,
  getAppointmentStatusColor,
  getPetGenderColor,
  getPetSpeciesColor,
} from '@/utils/color-helpers';

import type { Appointment } from '@/types';
import { AppointmentsDataService } from '@/services/appointments';
import { TABLE_PAGE_SIZES } from '@/constants';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('components');

  const createActionHandlers = (appointment: Appointment) => {
    const handleView = () => {
      onView(appointment);
    };
    const handleCancel = () => onCancel(appointment.id || '');
    return { handleView, handleCancel };
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: t('appointments.petOwner'),
      key: 'pet_owner',
      width: 300,
      render: (appointment: Appointment) => (
        <div className='flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow'>
          <Avatar
            size={44}
            src={appointment.pet?.photo_url}
            icon={<UserOutlined />}
            className='border-2 border-slate-200 shadow-sm'
            style={{ backgroundColor: '#667eea' }}
          />
          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-sm text-slate-800 truncate'>
              {appointment.pet?.name || t('appointments.unknownPet')}
            </div>
            <div className='text-xs text-slate-600'>
              {appointment.pet?.breed
                ? `${appointment.pet.breed} ${appointment.pet.species}`
                : appointment.pet?.species || t('appointments.unknownSpecies')}
            </div>
            {appointment.pet?.emergency_contact && (
              <div className='text-xs text-slate-500 flex items-center gap-1'>
                <PhoneOutlined className='text-slate-400' />
                {appointment.pet.emergency_contact}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('appointments.serviceType'),
      key: 'service_type',
      width: 220,
      render: (appointment: Appointment) => (
        <div className='space-y-2'>
          <div>
            <Tag 
              className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
              style={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                border: '1px solid #93c5fd',
              }}
            >
              {appointment.service?.name ||
                formatAppointmentType(appointment.appointment_type) ||
                'Unknown Service'}
            </Tag>
          </div>
          <div>
            <Tag 
              className='!border-0 !px-3 !py-1.5 !rounded-full font-bold shadow-sm'
              style={{
                backgroundColor: getAppointmentPriorityColor(appointment.priority) === 'blue' ? '#dbeafe' : 
                               getAppointmentPriorityColor(appointment.priority) === 'orange' ? '#fef3c7' : 
                               '#fee2e2',
                color: getAppointmentPriorityColor(appointment.priority) === 'blue' ? '#1e40af' : 
                       getAppointmentPriorityColor(appointment.priority) === 'orange' ? '#d97706' : 
                       '#dc2626',
                border: getAppointmentPriorityColor(appointment.priority) === 'blue' ? '1px solid #93c5fd' : 
                        getAppointmentPriorityColor(appointment.priority) === 'orange' ? '1px solid #fcd34d' : 
                        '1px solid #fca5a5',
              }}
            >
              {appointment.priority
                ? appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)
                : 'Normal'}
            </Tag>
          </div>
          {appointment.service?.price && (
            <div className='text-xs font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-md inline-block'>
              ${appointment.service.price} {appointment.service.currency}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('appointments.dateTime'),
      key: 'datetime',
      width: 200,
      render: (appointment: Appointment) => (
        <div className='space-y-1'>
          <div className='font-medium text-sm text-slate-800 flex items-center gap-1'>
            <CalendarOutlined className='text-blue-500' />
            {appointment.scheduled_date
              ? new Date(appointment.scheduled_date).toLocaleDateString()
              : 'No date set'}
          </div>
          <div className='text-sm text-slate-600 flex items-center gap-1'>
            <ClockCircleOutlined className='text-slate-500' />
            {appointment.scheduled_date
              ? new Date(appointment.scheduled_date).toLocaleTimeString()
              : ''}
            {appointment.duration_minutes ? ` (${appointment.duration_minutes} min)` : ''}
          </div>
        </div>
      ),
    },
    {
      title: t('common:common.status'),
      key: 'status',
      width: 140,
      align: 'center',
      render: (appointment: Appointment) => (
        <div className='space-y-2'>
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
              <Tag 
                className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
                style={{
                  backgroundColor: getAppointmentStatusColor(appointment.status) === 'green' ? '#d1fae5' :
                                 getAppointmentStatusColor(appointment.status) === 'orange' ? '#fef3c7' :
                                 getAppointmentStatusColor(appointment.status) === 'red' ? '#fee2e2' :
                                 '#f1f5f9',
                  color: getAppointmentStatusColor(appointment.status) === 'green' ? '#047857' :
                         getAppointmentStatusColor(appointment.status) === 'orange' ? '#d97706' :
                         getAppointmentStatusColor(appointment.status) === 'red' ? '#dc2626' :
                         '#475569',
                  border: getAppointmentStatusColor(appointment.status) === 'green' ? '1px solid #a7f3d0' :
                          getAppointmentStatusColor(appointment.status) === 'orange' ? '1px solid #fcd34d' :
                          getAppointmentStatusColor(appointment.status) === 'red' ? '1px solid #fca5a5' :
                          '1px solid #cbd5e1',
                }}
              >
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
            <div className='flex items-center justify-center space-x-2'>
              {appointment.is_home_visit && (
                <Tag 
                  className='!border-0 !px-3 !py-1 !rounded-full shadow-sm'
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    border: '1px solid #93c5fd',
                  }}
                >
                  Home Visit
                </Tag>
              )}
              <Tooltip title='Review status will be shown here'>
                <div className='w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center shadow-sm'>
                  <StarOutlined className='text-yellow-500 text-xs' />
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('appointments.clinicStaff'),
      key: 'clinic_staff',
      width: 260,
      render: (appointment: Appointment) => (
        <div className='space-y-1 text-sm'>
          <div className='font-medium text-slate-800 flex items-center gap-1'>
            <EnvironmentOutlined className='text-slate-500' />
            {appointment.clinic?.name || t('appointments.unknownClinic')}
          </div>
          <div className='text-slate-600'>
            {appointment.clinic?.city && appointment.clinic?.state
              ? `${appointment.clinic.city}, ${appointment.clinic.state}`
              : t('appointments.locationNotSpecified')}
          </div>
          <div className='text-xs text-slate-500'>
            {t('appointments.staff')}:{' '}
            {appointment.staff?.specialization ||
              appointment.staff?.role ||
              t('appointments.unassigned')}
          </div>
          {appointment.staff?.license_number && (
            <div className='text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md inline-block'>
              {t('appointments.license')}: {appointment.staff.license_number}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('appointments.petDetails'),
      key: 'pet_details',
      width: 220,
      render: (appointment: Appointment) => (
        <div className='space-y-2'>
          {appointment.pet && (
            <>
              <div className='flex gap-1'>
                <Tag 
                  className='!border-0 !px-2.5 !py-1 !rounded-full shadow-sm'
                  style={{
                    backgroundColor: getPetSpeciesColor(appointment.pet.species) === 'blue' ? '#dbeafe' :
                                   getPetSpeciesColor(appointment.pet.species) === 'green' ? '#d1fae5' :
                                   '#f1f5f9',
                    color: getPetSpeciesColor(appointment.pet.species) === 'blue' ? '#1e40af' :
                           getPetSpeciesColor(appointment.pet.species) === 'green' ? '#047857' :
                           '#475569',
                    border: getPetSpeciesColor(appointment.pet.species) === 'blue' ? '1px solid #93c5fd' :
                            getPetSpeciesColor(appointment.pet.species) === 'green' ? '1px solid #a7f3d0' :
                            '1px solid #cbd5e1',
                  }}
                >
                  {appointment.pet.species.charAt(0).toUpperCase() +
                    appointment.pet.species.slice(1)}
                </Tag>
                <Tag 
                  className='!border-0 !px-2.5 !py-1 !rounded-full shadow-sm'
                  style={{
                    backgroundColor: getPetGenderColor(appointment.pet.gender) === 'blue' ? '#dbeafe' :
                                   getPetGenderColor(appointment.pet.gender) === 'pink' ? '#fde68a' :
                                   '#f1f5f9',
                    color: getPetGenderColor(appointment.pet.gender) === 'blue' ? '#1e40af' :
                           getPetGenderColor(appointment.pet.gender) === 'pink' ? '#d97706' :
                           '#475569',
                    border: getPetGenderColor(appointment.pet.gender) === 'blue' ? '1px solid #93c5fd' :
                            getPetGenderColor(appointment.pet.gender) === 'pink' ? '1px solid #fcd34d' :
                            '1px solid #cbd5e1',
                  }}
                >
                  {appointment.pet.gender}
                </Tag>
              </div>
              <div className='text-xs text-slate-600'>
                {t('appointments.weight')}: <span className='font-medium'>{appointment.pet.weight} kg</span>
              </div>
              <div className='text-xs text-slate-600'>
                {t('appointments.age')}:{' '}
                <span className='font-medium'>
                  {appointment.pet.date_of_birth
                    ? Math.floor(
                        (new Date().getTime() - new Date(appointment.pet.date_of_birth).getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      )
                    : t('appointments.unknown')}{' '}
                  {t('appointments.years')}
                </span>
              </div>
              <div className='flex gap-1'>
                <Tag 
                  className='!border-0 !px-2.5 !py-1 !rounded-full font-medium shadow-sm'
                  style={{
                    backgroundColor: appointment.pet.is_vaccinated ? '#d1fae5' : '#fee2e2',
                    color: appointment.pet.is_vaccinated ? '#047857' : '#dc2626',
                    border: appointment.pet.is_vaccinated ? '1px solid #a7f3d0' : '1px solid #fca5a5',
                  }}
                >
                  {appointment.pet.is_vaccinated
                    ? t('appointments.vaccinated')
                    : t('appointments.notVaccinated')}
                </Tag>
                <Tag 
                  className='!border-0 !px-2.5 !py-1 !rounded-full font-medium shadow-sm'
                  style={{
                    backgroundColor: appointment.pet.is_spayed_neutered ? '#d1fae5' : '#fef3c7',
                    color: appointment.pet.is_spayed_neutered ? '#047857' : '#d97706',
                    border: appointment.pet.is_spayed_neutered ? '1px solid #a7f3d0' : '1px solid #fcd34d',
                  }}
                >
                  {appointment.pet.is_spayed_neutered
                    ? t('appointments.spayedNeutered')
                    : t('appointments.notSpayedNeutered')}
                </Tag>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: t('appointments.notes'),
      key: 'notes',
      width: 100,
      ellipsis: true,
      render: (appointment: Appointment) => (
        <Tooltip title={appointment.notes || t('common:common.noResults')}>
          <div className='text-sm text-slate-600 truncate max-w-[100px]'>
            {appointment.notes?.slice(0, 40) || t('common:common.noResults')}
            {appointment.notes?.length && appointment.notes?.length > 40 && '...'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: t('appointments.actions'),
      key: 'actions',
      width: 120,
      align: 'center',
      render: (appointment: Appointment) => {
        const { handleView, handleCancel } = createActionHandlers(appointment);

        return (
          <Space size='middle' className='p-2'>
            <Tooltip title={t('pages:appointments.viewDetails')}>
              <Button
                type='text'
                icon={<EyeOutlined className='text-blue-500' />}
                size='small'
                className='hover:bg-blue-50 rounded-full p-2 transition-colors'
                onClick={handleView}
              />
            </Tooltip>
            <Tooltip title={t('appointments.cancel')}>
              <Button
                type='text'
                icon={<DeleteOutlined className='text-red-500' />}
                size='small'
                danger
                onClick={handleCancel}
                disabled={
                  !appointment.status ||
                  appointment.status === 'cancelled' ||
                  appointment.status === 'completed'
                }
                className='hover:bg-red-50 rounded-full p-2 transition-colors'
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

  // Normalize appointments data using the data service
  const safeAppointments = AppointmentsDataService.normalizeAppointments(appointments);

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
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
        rowClassName='hover:bg-slate-50 transition-colors duration-200'
        locale={{
          emptyText: (
            <div className='text-center py-8'>
              <CalendarOutlined className='text-4xl text-slate-300 mb-2' />
              <div className='text-slate-500 font-medium'>{t('appointments.noAppointments')}</div>
              <div className='text-xs text-slate-400 mt-1'>No appointments scheduled yet</div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export { AppointmentsTable };
export default AppointmentsTable;
