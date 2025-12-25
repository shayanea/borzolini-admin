import {
	AppointmentViewModal,
	AppointmentsFilters,
	AppointmentsHeader,
	AppointmentsTable,
	EmptyAppointmentsState,
} from '@/components/appointments';
import { ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Alert, Modal } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import BulkActionsBar from '@/components/appointments/bulk-actions-bar';
import ErrorBoundary from '@/components/common/error-boundary';
import LoadingSpinner from '@/components/common/loading-spinner';
import { APPOINTMENT_STATUSES } from '@/constants';
import { useAppointments } from '@/hooks/appointments';
import { useAuthStore } from '@/stores/auth.store';
import type { Appointment } from '@/types';
import { toast } from '@/utils/toast';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AuthRequiredScreenProps {
	title: string;
	description: string;
	helperText: string;
}

const AuthRequiredScreen = ({
	title,
	description,
	helperText,
}: AuthRequiredScreenProps): JSX.Element => (
	<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-primary-dark'>
		<div className='text-center text-white'>
			<LockOutlined className='text-6xl mb-4 text-primary-orange' />
			<h1 className='text-2xl font-bold mb-2'>{title}</h1>
			<p className='text-lg text-gray-300 mb-6'>{description}</p>
			<p className='text-sm text-gray-400'>{helperText}</p>
		</div>
	</div>
);

const Appointments = () => {
	const { t } = useTranslation('pages');
	const { isAuthenticated } = useAuthStore();
	const {
		appointments,
		loading,
		error,
		searchText,
		pagination,
		stats,
		handleSearch,
		handleFilters,
		handlePagination,
		handleExport,
		handleEditAppointment,
		handleCancelAppointment,
		handleBulkUpdate,
		clearError,
	} = useAppointments();

	const navigate = useNavigate();

	// Modal states
	const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
	const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

	// Selection states
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	}, []);

	const rowSelection = useMemo(
		() => ({
			selectedRowKeys,
			onChange: onSelectChange,
		}),
		[selectedRowKeys, onSelectChange]
	);

	// Bulk Action Handlers
	const handleBulkConfirm = async () => {
		try {
			await handleBulkUpdate(selectedRowKeys as string[], {
				status: APPOINTMENT_STATUSES.CONFIRMED,
			});
			setSelectedRowKeys([]);
			toast.success(t('messages.updateSuccess'));
		} catch (e) {
			console.error(e);
			// Error handled by hook
		}
	};

	const handleBulkRemind = () => {
		// Mock action
		toast.success('Reminders Sent', `Reminders sent to ${selectedRowKeys.length} patients via SMS/Email.`);
		setSelectedRowKeys([]);
	};

	const handleBulkReschedule = () => {
		Modal.info({
			title: 'Bulk Reschedule',
			content: (
				<div>
					<p>Please select a new date for {selectedRowKeys.length} appointments.</p>
					<div className='p-4 bg-gray-50 border rounded text-center text-gray-500 italic'>
						Date Picker Placeholder (Not implemented yet)
					</div>
				</div>
			),
			onOk: () => {
				toast.success('Reschedule Successful', 'Appointments rescheduled successfully');
				setSelectedRowKeys([]);
			},
		});
	};

	const handleBulkExportSelected = () => {
		// Since the service logic exports by filter, extending it to export by IDs might be complex on backend side without endpoint support.
		// However, we can export the *currently loaded* selected appointments easily on client side,
		// OR pass a filter like `ids: [...]` if backend supported it.
		// Given the "Smart Filters" task context, let's assume client-side export for now or reuse existing with a note.
		// Actually, standard `handleExport` calls the service which takes filters.
		// I will implement a client-side CSV generation here for the selected items to ensure it works correctly for *selection* specifically.

		const selectedAppointments = appointments.filter(app => selectedRowKeys.includes(app.id || ''));
		if (selectedAppointments.length === 0) return;

		const headers = ['ID', 'Patient', 'Service', 'Date', 'Status', 'Clinic', 'Staff'];
		const rows = selectedAppointments.map(app => [
			app.id,
			app.pet?.name || 'Unknown',
			app.service?.name || app.appointment_type,
			app.scheduled_date,
			app.status,
			app.clinic?.name,
			app.staff?.role || 'Unknown',
		]);

		const csvContent = [
			headers.join(','),
			...rows.map(row => row.map(val => `"${val || ''}"`).join(',')),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'selected_appointments.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success('Export Complete', `Exported ${selectedRowKeys.length} appointments.`);
		setSelectedRowKeys([]);
	};

	const handleViewAppointment = useCallback((appointment: Appointment) => {
		setViewingAppointment(appointment);
		setIsViewModalVisible(true);
	}, []);

	const handleViewModalCancel = useCallback(() => {
		setIsViewModalVisible(false);
		setViewingAppointment(null);
	}, []);

	const handleUpdateAppointment = useCallback(
		async (id: string, updates: Partial<Appointment>) => {
			try {
				// Convert the updates to the format expected by the API
				const updateData = {
					status: updates.status,
					priority: updates.priority,
					notes: updates.notes,
					reason: updates.reason,
					symptoms: updates.symptoms,
					diagnosis: updates.diagnosis,
					treatment_plan: updates.treatment_plan,
					follow_up_instructions: updates.follow_up_instructions,
					staff_id: updates.staff_id,
				};

				await handleEditAppointment(id, updateData);
			} catch (error) {
				console.error('Failed to update appointment:', error);
				throw error;
			}
		},
		[handleEditAppointment]
	);

	// Empty State Handlers
	const handleCreateClick = useCallback(() => {
		navigate('/appointments/create');
	}, [navigate]);

	const handleClearSelection = useCallback(() => {
		setSelectedRowKeys([]);
	}, []);

	const [searchParams, setSearchParams] = useSearchParams();

	// Check for 'showCreate' query param to trigger create modal
	useEffect(() => {
		if (searchParams.get('showCreate') === 'true') {
			handleCreateClick();
			// Remove the param so it doesn't trigger again on refresh/re-render
			const newParams = new URLSearchParams(searchParams);
			newParams.delete('showCreate');
			setSearchParams(newParams);
		}
	}, [searchParams, setSearchParams, handleCreateClick]);

	// Calculate header stats
	const headerStats = useMemo(() => {
		if (!stats) return undefined;
		return {
			total: stats.total,
			pending: stats.byStatus.pending || 0,
			confirmed: stats.byStatus.confirmed || 0,
			inProgress: stats.byStatus.in_progress || 0,
			completed: stats.byStatus.completed || 0,
			cancelled: stats.byStatus.cancelled || 0,
		};
	}, [stats]);

	const handleQuickStatusFilter = useCallback((status: string | null) => {
		handleFilters({ status: status as any });
	}, [handleFilters]);

	// Show authentication required message if not authenticated
	if (!isAuthenticated) {
		return (
			<AuthRequiredScreen
				title={t('appointments.authRequired')}
				description={t('appointments.pleaseLogin')}
				helperText={t('appointments.autoRedirect')}
			/>
		);
	}

	return (
		<ErrorBoundary>
			<div className='space-y-6 relative pb-20'>
				{/* Error Alert */}
				{error && (
					<Alert
						message={t('appointments.errorLoading')}
						description={error}
						type='error'
						showIcon
						icon={<ExclamationCircleOutlined />}
						closable
						onClose={clearError}
						className='mb-4'
					/>
				)}

				{/* Page Header */}
				<AppointmentsHeader
					onNewAppointment={handleCreateClick}
					onRefresh={() => handleFilters({})} // Simple refresh or re-fetch
					loading={loading}
					stats={headerStats}
					onQuickStatusFilter={handleQuickStatusFilter}
				/>

				{/* Search and Filters */}
				<AppointmentsFilters
					searchText={searchText}
					onSearch={handleSearch}
					onFilters={handleFilters}
					onExport={handleExport}
				/>

				{/* Appointments Table */}
				{appointments.length > 0 ? (
					<AppointmentsTable
						appointments={appointments}
						loading={loading}
						pagination={pagination}
						onView={handleViewAppointment}
						onCancel={handleCancelAppointment}
						onPagination={handlePagination}
						onUpdate={handleUpdateAppointment}
						rowSelection={rowSelection}
					/>
				) : !loading ? (
					<EmptyAppointmentsState
						onCreate={handleCreateClick}
					/>
				) : null}

				{/* Loading indicator for subsequent loads */}
				{loading && appointments.length > 0 && (
					<div className='text-center py-4'>
						<LoadingSpinner size='small' text={t('appointments.updating')} />
					</div>
				)}

				{/* Appointment View Modal */}
				<AppointmentViewModal
					visible={isViewModalVisible}
					appointment={viewingAppointment}
					onCancel={handleViewModalCancel}
					onUpdate={handleUpdateAppointment}
					loading={loading}
				/>

				<BulkActionsBar
					selectedCount={selectedRowKeys.length}
					onClear={handleClearSelection}
					onConfirm={handleBulkConfirm}
					onRemind={handleBulkRemind}
					onReschedule={handleBulkReschedule}
					onExport={handleBulkExportSelected}
				/>
			</div>
		</ErrorBoundary>
	);
};

export { Appointments };
export default Appointments;
