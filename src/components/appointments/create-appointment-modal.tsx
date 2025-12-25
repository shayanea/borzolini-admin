import { BaseModal } from '@/components/common';
import { APPOINTMENT_TYPES, getAppointmentTypeOptions } from '@/constants/appointments';
import { useClinicManagement } from '@/hooks/clinics';
import { useClinicStaff } from '@/hooks/clinics/use-clinic-staff';
import { usePetManagement } from '@/hooks/pets';
import { CreateAppointmentData } from '@/services/appointments';
import {
	Col,
	DatePicker,
	Form,
	Input,
	Row,
	Select,
	TimePicker,
	message
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

export interface CreateAppointmentModalProps {
	visible: boolean;
	onCancel: () => void;
	onCreate: (data: CreateAppointmentData) => Promise<any>;
	loading?: boolean;
}

export const CreateAppointmentModal = ({
	visible,
	onCancel,
	onCreate,
	loading: parentLoading = false,
}: CreateAppointmentModalProps) => {
	// const { t } = useTranslation('components');
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	// Clinic Selection
	const {
		clinics,
		loading: clinicsLoading,
		handleSearch: searchClinics
	} = useClinicManagement();

	// Pet Selection
	const {
		pets,
		loading: petsLoading,
		handleSearch: searchPets
	} = usePetManagement();

	// Selected Clinic State for Staff Filtering
	const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);

	// Staff Selection (Dependent on Clinic)
	const { data: staffData, isLoading: staffLoading } = useClinicStaff(
		{
			clinicId: selectedClinicId || undefined,
			enabled: !!selectedClinicId
		}
	);

	const staffMembers = staffData?.data || [];

	const handleClinicChange = (clinicId: string) => {
		setSelectedClinicId(clinicId);
		form.setFieldsValue({ staff_id: undefined }); // Reset staff when clinic changes
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setSubmitting(true);

			// Combine date and time
			const date = values.date.format('YYYY-MM-DD');
			const time = values.time.format('HH:mm');
			const scheduledDate = `${date}T${time}:00`;

			const appointmentData: CreateAppointmentData = {
				pet_id: values.pet_id,
				clinic_id: values.clinic_id,
				staff_id: values.staff_id,
				appointment_type: values.appointment_type,
				scheduled_date: scheduledDate,
				duration_minutes: values.duration_minutes || 30,
				reason: values.reason,
				notes: values.notes,
				status: 'pending', // Default status
			};

			await onCreate(appointmentData);

			message.success('Appointment created successfully');
			form.resetFields();
			onCancel();
		} catch (error) {
			console.error('Failed to create appointment:', error);
			// Message is usually handled by the hook
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancelInternal = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<BaseModal
			title="Create New Appointment"
			open={visible}
			onCancel={handleCancelInternal}
			onOk={handleSubmit}
			confirmLoading={submitting || parentLoading}
			width={700}
			destroyOnHidden
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={{
					duration_minutes: 30,
					appointment_type: APPOINTMENT_TYPES.CONSULTATION,
				}}
			>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="pet_id"
							label="Pet"
							rules={[{ required: true, message: 'Please select a pet' }]}
						>
							<Select
								showSearch
								placeholder="Select a pet"
								optionFilterProp="children"
								onSearch={searchPets}
								loading={petsLoading}
								filterOption={false} // Handled by server-side search via onSearch
								notFoundContent={petsLoading ? 'Loading...' : null}
							>
								{pets.map((pet) => (
									<Option key={pet.id} value={pet.id}>
										{pet.name} ({pet.species})
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="clinic_id"
							label="Clinic"
							rules={[{ required: true, message: 'Please select a clinic' }]}
						>
							<Select
								showSearch
								placeholder="Select a clinic"
								optionFilterProp="children"
								onSearch={searchClinics}
								onChange={handleClinicChange}
								loading={clinicsLoading}
								filterOption={false}
							>
								{clinics.map((clinic) => (
									<Option key={clinic.id} value={clinic.id}>
										{clinic.name} - {clinic.city}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="staff_id"
							label="Veterinarian / Staff"
							rules={[{ required: false, message: 'Please select staff' }]}
						>
							<Select
								placeholder={selectedClinicId ? "Select staff" : "Select clinic first"}
								loading={staffLoading}
								disabled={!selectedClinicId}
							>
								{staffMembers.map((staff) => (
									<Option key={staff.id} value={staff.id}>
										{staff.user ? `${staff.user.firstName} ${staff.user.lastName}` : staff.role} - {staff.role}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="appointment_type"
							label="Type"
							rules={[{ required: true, message: 'Please select appointment type' }]}
						>
							<Select placeholder="Select type">
								{getAppointmentTypeOptions().map((opt) => (
									<Option key={opt.value} value={opt.value}>
										{opt.label}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							name="date"
							label="Date"
							rules={[{ required: true, message: 'Please select date' }]}
						>
							<DatePicker
								className="w-full"
								disabledDate={(current) => current && current < dayjs().startOf('day')}
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							name="time"
							label="Time"
							rules={[{ required: true, message: 'Please select time' }]}
						>
							<TimePicker className="w-full" format="HH:mm" />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							name="duration_minutes"
							label="Duration (mins)"
							rules={[{ required: true, message: 'Please enter duration' }]}
						>
							<Input type="number" min={15} step={15} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name="reason"
					label="Reason for Visit"
					rules={[{ required: true, message: 'Please provide a reason' }]}
				>
					<Input placeholder="Brief reason for the appointment" />
				</Form.Item>

				<Form.Item
					name="notes"
					label="Internal Notes"
				>
					<TextArea rows={3} placeholder="Additional notes..." />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};

export default CreateAppointmentModal;
