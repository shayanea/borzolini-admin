import { TableSkeleton } from '@/components/shared';
import {
	formatAppointmentType
} from '@/utils/color-helpers';
import {
	CalendarOutlined,
	ClockCircleOutlined,
	CloseOutlined,
	EditOutlined,
	EnvironmentOutlined,
	EyeOutlined
} from '@ant-design/icons';
import {
	Avatar,
	Badge,
	Button,
	Input,
	Popover,
	Select,
	Table,
	Tag,
	Tooltip,
} from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { TABLE_PAGE_SIZES } from '@/constants';
import { useClinicContext, useClinicStaff } from '@/hooks/clinics';
import { AppointmentsDataService } from '@/services/appointments';
import type { Appointment, AppointmentsTableProps } from '@/types';
import { toast } from '@/utils/toast';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

interface NotesCellProps {
	appointment: Appointment;
	onSave: (id: string, notes: string) => Promise<void>;
}

const NotesCell = ({ appointment, onSave }: NotesCellProps) => {
	const [noteTemp, setNoteTemp] = useState<string>(appointment.notes || '');
	const [saving, setSaving] = useState<boolean>(false);
	const [open, setOpen] = useState(false);

	const handleSave = async () => {
		try {
			setSaving(true);
			await onSave(appointment.id || '', noteTemp);
			toast.success('Notes Updated');
			setOpen(false);
		} catch {
			toast.error('Update Failed', 'Failed to update notes');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div onClick={e => e.stopPropagation()}>
			<Popover
				trigger='click'
				open={open}
				onOpenChange={setOpen}
				title='Edit Notes'
				content={
					<div className='w-64'>
						<TextArea
							rows={4}
							value={noteTemp}
							onChange={e => setNoteTemp(e.target.value)}
							className='mb-2 text-xs'
						/>
						<div className='flex justify-end gap-2'>
							<button
								onClick={() => setOpen(false)}
								className='px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50'
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								disabled={saving}
								className='px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
							>
								{saving ? 'Saving...' : 'Save'}
							</button>
						</div>
					</div>
				}
			>
				<Tooltip title={appointment.notes || 'Add Notes'}>
					<button className={`p-1 rounded hover:bg-gray-100 ${appointment.notes ? 'text-blue-500' : 'text-gray-300'}`}>
						<EditOutlined />
					</button>
				</Tooltip>
			</Popover>
		</div>
	);
};

const AppointmentsTable = ({
	appointments,
	loading = false,
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

	// Show skeleton for initial load (no data yet)
	if (loading && (!appointments || appointments.length === 0)) {
		return <TableSkeleton />;
	}

	const handleInlineUpdate = async (id: string, data: Partial<Appointment>) => {
		if (onUpdate) {
			try {
				await onUpdate(id, data);
				toast.success('Update Success', t('messages.updateSuccess', 'Updated successfully'));
			} catch (error) {
				toast.error('Update Failed', t('messages.updateFailed', 'Update failed'));
			}
		}
	};

	const columns = [
		{
			title: t('appointments.petOwner'),
			key: 'pet_owner',
			width: 220,
			render: (appointment: Appointment) => (
				<div className='flex items-center gap-2'>
					<Avatar
						size={32}
						src={appointment.pet?.photo_url}
						className='border border-gray-200'
						style={{ backgroundColor: '#667eea' }}
					/>
					<div className='flex-1 min-w-0'>
						<div
							className='font-medium text-sm text-gray-900 truncate cursor-pointer hover:text-blue-600'
							onClick={() => onView(appointment)}
						>
							{appointment.pet?.name || 'Unknown'}
						</div>
						<div className='text-xs text-gray-500 truncate'>
							{appointment.pet?.breed || appointment.pet?.species}
						</div>
					</div>
				</div>
			),
		},
		{
			title: t('appointments.details'),
			key: 'details',
			width: 180,
			render: (appointment: Appointment) => (
				<div className='space-y-1'>
					<div className='flex items-center gap-1'>
						<Tag className='!border-0 !px-2 !py-0.5 !rounded-full text-xs bg-blue-50 text-blue-700 font-medium'>
							{appointment.service?.name || formatAppointmentType(appointment.appointment_type)}
						</Tag>
					</div>
					{/* Inline Staff Select */}
					<div className='flex items-center gap-1 pl-1'>
						<EnvironmentOutlined className='text-gray-400 text-xs' />
						<Select
							placeholder="Assign Vet"
							variant="borderless"
							size="small"
							popupMatchSelectWidth={false}
							className="!text-xs !p-0 min-w-[100px]"
							defaultValue={appointment.staff_id || appointment.staff?.id}
							onChange={(val) => handleInlineUpdate(appointment.id, { staff_id: val })}
							options={staffData?.data?.map(s => ({
								value: s.id,
								label: s.user ? `${s.user.firstName} ${s.user.lastName}` : 'Unknown'
							}))}
						/>
					</div>
				</div>
			),
		},
		{
			title: t('appointments.dateTime'),
			key: 'datetime',
			width: 160,
			render: (appointment: Appointment) => (
				<div className='text-sm'>
					<div className='text-gray-900 font-medium'>
						{appointment.scheduled_date ? new Date(appointment.scheduled_date).toLocaleDateString() : '-'}
					</div>
					<div className='text-gray-500 text-xs flex items-center gap-1'>
						<ClockCircleOutlined />
						{appointment.scheduled_date ? new Date(appointment.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
						{appointment.duration_minutes && ` (${appointment.duration_minutes}m)`}
					</div>
				</div>
			),
		},
		{
			title: t('appointments.priority'),
			key: 'priority',
			width: 120,
			render: (appointment: Appointment) => (
				<Select
					variant='borderless'
					size='small'
					defaultValue={appointment.priority}
					onChange={val => handleInlineUpdate(appointment.id, { priority: val })}
					className='w-full !text-xs'
					popupMatchSelectWidth={false}
					options={[
						{ value: 'low', label: <Badge status="success" text="Low" /> },
						{ value: 'normal', label: <Badge status="processing" text="Normal" /> },
						{ value: 'high', label: <Badge status="warning" text="High" /> },
						{ value: 'urgent', label: <Badge status="error" text="Urgent" /> },
					]}
				/>
			)
		},
		{
			title: t('common:common.status'),
			key: 'status',
			width: 140,
			render: (appointment: Appointment) => (
				<Select
					defaultValue={appointment.status}
					onChange={val => handleInlineUpdate(appointment.id, { status: val })}
					className='w-full !text-xs'
					variant='borderless'
					size='small'
					popupMatchSelectWidth={false}
					options={[
						{ value: 'pending', label: <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">Pending</span> },
						{ value: 'confirmed', label: <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">Confirmed</span> },
						{ value: 'in_progress', label: <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs">In Progress</span> },
						{ value: 'completed', label: <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full text-xs">Completed</span> },
						{ value: 'cancelled', label: <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs">Cancelled</span> },
						{ value: 'no_show', label: <span className="text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full text-xs">No Show</span> },
					]}
				/>
			),
		},
		{
			title: 'Notes',
			key: 'notes',
			width: 60,
			align: 'center' as const,
			render: (appointment: Appointment) => (
				<NotesCell
					appointment={appointment}
					onSave={async (id, notes) => handleInlineUpdate(id, { notes })}
				/>
			),
		},
		{
			title: 'Action',
			key: 'actions',
			width: 100,
			align: 'center' as const,
			fixed: 'right' as const,
			render: (appointment: Appointment) => (
				<div className='flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
					<Tooltip title='View'>
						<Button
							type='text'
							size='small'
							icon={<EyeOutlined className='text-blue-600' />}
							onClick={() => onView(appointment)}
							className='flex items-center justify-center bg-blue-50 hover:bg-blue-100 border-blue-100'
						/>
					</Tooltip>
					<Tooltip title='Cancel'>
						<Button
							type='text'
							size='small'
							icon={<CloseOutlined className='text-red-500' />}
							onClick={() => onCancel(appointment.id)}
							className='flex items-center justify-center bg-red-50 hover:bg-red-100 border-red-100 disabled:opacity-50'
							disabled={['cancelled', 'completed', 'no_show'].includes(appointment.status)}
						/>
					</Tooltip>
				</div>
			),
		},
	];

	const handleTableChange = (paginationConfig: TablePaginationConfig) => {
		if (onPagination && paginationConfig.current && paginationConfig.pageSize) {
			onPagination(paginationConfig.current, paginationConfig.pageSize);
		}
	};

	const handleShowTotal = (total: number, range: [number, number]) => {
		return t('petTable.showTotal', { start: range[0], end: range[1], total });
	};

	// Normalize appointments
	const safeAppointments = AppointmentsDataService.normalizeAppointments(appointments);

	return (
		<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
			<Table
				rowSelection={rowSelection}
				columns={columns as any}
				dataSource={safeAppointments}
				rowKey={record => record?.id || Math.random().toString()}
				loading={loading}
				size='small' // Compact size
				pagination={{
					current: pagination?.current,
					pageSize: pagination?.pageSize,
					total: pagination?.total,
					showSizeChanger: true,
					showQuickJumper: false,
					showTotal: handleShowTotal,
					pageSizeOptions: TABLE_PAGE_SIZES.map(String),
					position: ['topCenter', 'bottomCenter'],
					size: 'default',
					simple: false,
				}}
				onChange={handleTableChange}
				scroll={{ x: 'max-content' }}
				className='compact-table'
				rowClassName='group hover:bg-gray-50 transition-colors duration-200'
				locale={{
					emptyText: loading ? null : (
						<div className='text-center py-12'>
							<CalendarOutlined className='text-4xl text-gray-300 mb-2' />
							<div className='text-gray-500 font-medium'>{t('appointments.noAppointments')}</div>
							<div className='text-xs text-gray-400'>No appointments found</div>
						</div>
					),
				}}
			/>
		</div>
	);
};

export { AppointmentsTable };
export default AppointmentsTable;
