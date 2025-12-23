import {
	APPOINTMENT_PRIORITIES,
	getAppointmentPriorityOptions,
	getAppointmentStatusOptions,
	getAppointmentTypeOptions,
} from '@/constants/appointments';
import { Form, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import {
	ActionButtonsSection,
	AdditionalInfoSection,
	BasicInfoSection,
	SchedulingSection,
	VisitTypeSection,
} from './appointment-form-sections';

import { useCalendarFormData } from '@/hooks/calendar/use-calendar-form-data';
import type { CreateAppointmentData } from '@/services/appointments';
import type { AppointmentFormModalProps } from '@/types/calendar-modals';
import dayjs from 'dayjs';

export function AppointmentFormModal({
	visible,
	onCancel,
	onSubmit,
	loading = false,
	veterinarians,
	currentDate = dayjs(),
}: AppointmentFormModalProps) {
	const [form] = Form.useForm();
	const [isTelemedicine, setIsTelemedicine] = useState(false);
	const [isHomeVisit, setIsHomeVisit] = useState(false);

	// Use the new hook for form data
	const { clinics, loading: loadingData, error } = useCalendarFormData();

	// Get appointment options from constants
	const appointmentTypes = getAppointmentTypeOptions();
	const priorities = getAppointmentPriorityOptions();
	const statuses = getAppointmentStatusOptions();

	// Show error message if data loading fails
	useEffect(() => {
		if (error) {
			message.error('Failed to load form data. Please try again.');
		}
	}, [error]);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			// Combine date and time into a single ISO string
			const selectedDate = values.scheduled_date;
			const selectedTime = values.scheduled_time;

			if (!selectedDate || !selectedTime) {
				message.error('Please select both date and time');
				return;
			}

			// Combine date and time
			const combinedDateTime = selectedDate
				.hour(selectedTime.hour())
				.minute(selectedTime.minute())
				.second(0)
				.millisecond(0);

			const appointmentData: CreateAppointmentData = {
				appointment_type: values.appointment_type,
				status: values.status || 'pending',
				priority: values.priority || APPOINTMENT_PRIORITIES.NORMAL,
				scheduled_date: combinedDateTime.toISOString(),
				duration_minutes: values.duration_minutes || 30,
				notes: values.notes,
				reason: values.reason,
				symptoms: values.symptoms,
				is_telemedicine: isTelemedicine,
				telemedicine_link: isTelemedicine ? values.telemedicine_link : undefined,
				home_visit_address: isHomeVisit ? values.home_visit_address : undefined,
				is_home_visit: isHomeVisit,
				pet_anxiety_mode: values.pet_anxiety_mode,
				reminder_settings: values.reminder_settings,
				pet_id: values.pet_id,
				clinic_id: values.clinic_id,
				staff_id: values.staff_id,
				service_id: values.service_id,
			};

			await onSubmit(appointmentData);
			form.resetFields();
			message.success('Appointment created successfully!');
		} catch (error) {
			console.error('Form validation failed:', error);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setIsTelemedicine(false);
		setIsHomeVisit(false);
		onCancel();
	};

	return (
		<Modal
			title='Edit Appointment'
			open={visible}
			onCancel={handleCancel}
			footer={null}
			width={800}
			destroyOnHidden
		>
			<Form
				form={form}
				layout='vertical'
				className='mt-4'
				initialValues={{
					scheduled_date: currentDate,
					scheduled_time: dayjs().hour(9).minute(0),
					duration_minutes: 30,
					priority: APPOINTMENT_PRIORITIES.NORMAL,
					status: 'pending',
					pet_anxiety_mode: false,
					reminder_settings: {
						email_reminder: true,
						sms_reminder: true,
						push_reminder: true,
						reminder_hours_before: 24,
					},
				}}
			>
				<div className='grid grid-cols-2 gap-4'>
					{/* Left Column */}
					<div>
						<BasicInfoSection
							form={form}
							appointmentTypes={appointmentTypes}
							pets={[]}
							clinics={clinics}
							veterinarians={veterinarians}
							services={[]}
							loadingData={loadingData}
						/>
					</div>

					{/* Right Column */}
					<div>
						<SchedulingSection
							form={form}
							priorities={priorities}
							statuses={statuses}
							currentDate={currentDate}
						/>
					</div>
				</div>

				{/* Visit Type Options */}
				<VisitTypeSection
					form={form}
					isTelemedicine={isTelemedicine}
					setIsTelemedicine={setIsTelemedicine}
					isHomeVisit={isHomeVisit}
					setIsHomeVisit={setIsHomeVisit}
				/>

				{/* Additional Information */}
				<AdditionalInfoSection form={form} />

				{/* Action Buttons */}
				<ActionButtonsSection onCancel={handleCancel} onSubmit={handleSubmit} loading={loading} />
			</Form>
		</Modal>
	);
};

export default AppointmentFormModal;
