import {
	formatAppointmentType,
	getAppointmentPriorityColor,
	getAppointmentStatusColor,
	getPetGenderColor,
	getPetSpeciesColor,
	getStylesForColor,
} from '@/utils/color-helpers';
import {
	CalendarOutlined,
	ClockCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EnvironmentOutlined,
	EyeOutlined,
	PhoneOutlined,
	UserOutlined
} from '@ant-design/icons';
import { Avatar, Badge, Button, Input, Popover, Select, Space, Table, Tag, Tooltip, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import { TABLE_PAGE_SIZES } from '@/constants';
import { useClinicContext, useClinicStaff } from '@/hooks/clinics';
import { AppointmentsDataService } from '@/services/appointments';
import type { Appointment } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

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
  onUpdate?: (id: string, data: Partial<Appointment>) => Promise<void>;
  onPagination?: (page: number, pageSize: number) => void;
  rowSelection?: any;
}

const AppointmentsTable = ({
  appointments,
  loading,
  pagination,
  onView,
  onCancel,
  onUpdate,
  onPagination,
  rowSelection,
}: AppointmentsTableProps) => {
  const { t } = useTranslation('components');
  const { clinicContext } = useClinicContext();
  const { data: staffData } = useClinicStaff({ enabled: !!clinicContext?.clinicId });

  const handleInlineUpdate = async (id: string, data: Partial<Appointment>) => {
      if (onUpdate) {
          try {
              await onUpdate(id, data);
              message.success(t('messages.updateSuccess', 'Updated successfully'));
          } catch (error) {
              message.error(t('messages.updateFailed', 'Update failed'));
          }
      }
  };

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
      width: 240,
      render: (appointment: Appointment) => (
        <div className='space-y-2' onClick={e => e.stopPropagation()}>
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
            {/* Inline Priority Edit */}
             <Select
                bordered={false}
                defaultValue={appointment.priority}
                onChange={(val) => handleInlineUpdate(appointment.id, { priority: val })}
                className="w-full !p-0"
                dropdownMatchSelectWidth={false}
                options={[
                    { value: 'low', label: <Badge color={getAppointmentPriorityColor('low')} text="Low" /> },
                    { value: 'normal', label: <Badge color={getAppointmentPriorityColor('normal')} text="Normal" /> },
                    { value: 'high', label: <Badge color={getAppointmentPriorityColor('high')} text="High" /> },
                    { value: 'urgent', label: <Badge color={getAppointmentPriorityColor('urgent')} text="Urgent" /> },
                ]}
            />
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
      width: 160,
      align: 'center',
      render: (appointment: Appointment) => (
        <div className='space-y-2' onClick={e => e.stopPropagation()}>
            <Select
                defaultValue={appointment.status}
                onChange={(val) => handleInlineUpdate(appointment.id, { status: val })}
                className="w-full"
                bordered={false}
                options={[
                    { value: 'pending', label: <Tag style={getStylesForColor(getAppointmentStatusColor('pending'))}>Pending</Tag> },
                    { value: 'confirmed', label: <Tag style={getStylesForColor(getAppointmentStatusColor('confirmed'))}>Confirmed</Tag> },
                    { value: 'in_progress', label: <Tag style={getStylesForColor(getAppointmentStatusColor('in_progress'))}>In Progress</Tag> },
                    { value: 'completed', label: <Tag style={getStylesForColor(getAppointmentStatusColor('completed'))}>Completed</Tag> },
                    { value: 'cancelled', label: <Tag style={getStylesForColor(getAppointmentStatusColor('cancelled'))}>Cancelled</Tag> },
                    { value: 'no_show', label: <Tag style={getStylesForColor(getAppointmentStatusColor('no_show'))}>No Show</Tag> },
                ]}
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
        <div className='space-y-1 text-sm' onClick={e => e.stopPropagation()}>
          <div className='font-medium text-slate-800 flex items-center gap-1'>
            <EnvironmentOutlined className='text-slate-500' />
            {appointment.clinic?.name || t('appointments.unknownClinic')}
          </div>
          <div className='text-slate-600'>
            {appointment.clinic?.city && appointment.clinic?.state
              ? `${appointment.clinic.city}, ${appointment.clinic.state}`
              : t('appointments.locationNotSpecified')}
          </div>
          <div className='text-xs text-slate-500 mt-1'>
            {/* Inline Staff Assign */}
             <div className="flex items-center gap-2">
                 <span className="text-xs text-gray-400">Vet:</span>
                 <Select
                    placeholder="Assign Vet"
                    bordered={false}
                    size="small"
                    className="min-w-[120px]"
                    defaultValue={appointment.staff_id || (appointment.staff?.id)}
                    onChange={(val) => handleInlineUpdate(appointment.id, { staff_id: val })}
                    options={staffData?.data?.map(s => ({
                        value: s.id,
                        label: s.user ? `${s.user.firstName} ${s.user.lastName}` : 'Unknown'
                    }))}
                 />
             </div>
          </div>
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
      align: 'center',
      render: (appointment: Appointment) => {
          const [noteTemp, setNoteTemp] = useState(appointment.notes || '');

          return (
            <div onClick={e => e.stopPropagation()}>
                <Popover
                    trigger="click"
                    title="Edit Notes"
                    content={
                        <div className="w-64">
                            <TextArea 
                                rows={4} 
                                value={noteTemp} 
                                onChange={e => setNoteTemp(e.target.value)}
                                className="mb-2"
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="small" onClick={() => setNoteTemp(appointment.notes || '')}>Reset</Button>
                                <Button size="small" type="primary" onClick={() => handleInlineUpdate(appointment.id, { notes: noteTemp })}>Save</Button>
                            </div>
                        </div>
                    }
                >
                    <Button 
                        type="text" 
                        icon={<EditOutlined className={appointment.notes ? 'text-blue-500' : 'text-gray-400'} />} 
                    />
                </Popover>
            </div>
          );
      },
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
        rowSelection={rowSelection}
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
