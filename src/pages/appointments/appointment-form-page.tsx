import {
	getAppointmentPriorityOptions,
	getAppointmentTypeOptions,
} from '@/constants/appointments';
import { useAppointments } from '@/hooks/appointments';
import { useClinicContext } from '@/hooks/clinics';
import { CreateAppointmentData } from '@/services/appointments';
import { ClinicsService } from '@/services/clinics';
import { PetsService } from '@/services/pets';
import type { ClinicService } from '@/types';
import {
	ArrowLeftOutlined,
	CalendarOutlined,
	ClockCircleOutlined,
	HomeOutlined,
	MedicineBoxOutlined,
	PhoneOutlined,
	SaveOutlined,
	UserOutlined,
	VideoCameraOutlined,
	WarningOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
	Alert,
	Button,
	Card,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	Radio,
	Row,
	Select,
	Space,
	Spin,
	Steps,
	Tag,
	TimePicker,
	Typography,
	message
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Step definitions
const STEPS = [
	{ title: 'Pet & Owner', icon: <UserOutlined /> },
	{ title: 'Service & Staff', icon: <MedicineBoxOutlined /> },
	{ title: 'Schedule', icon: <CalendarOutlined /> },
	{ title: 'Details', icon: <ClockCircleOutlined /> },
];

const AppointmentFormPage = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [submitting, setSubmitting] = useState(false);

	// Selected values for dependent fetches
	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
	const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
	const [appointmentMode, setAppointmentMode] = useState<'in_person' | 'telemedicine' | 'home_visit'>('in_person');

	const { handleNewAppointment } = useAppointments();
	const { clinicContext } = useClinicContext();

	// Fetch pets with search
	const [petSearch, setPetSearch] = useState('');
	const { data: petsData, isLoading: petsLoading } = useQuery({
		queryKey: ['pets-search', petSearch],
		queryFn: () => PetsService.getPets({ search: petSearch, limit: 20 }),
		staleTime: 30000,
	});
	const pets = petsData?.pets || [];

	// Fetch clinics
	const { data: clinicsData, isLoading: clinicsLoading } = useQuery({
		queryKey: ['clinics-list'],
		queryFn: () => ClinicsService.getClinics({ limit: 100, isActive: true }),
		staleTime: 60000,
	});
	const clinics = clinicsData?.clinics || [];

	// Auto-select clinic for clinic_admin users
	useEffect(() => {
		if (clinicContext?.clinicId && !selectedClinicId) {
			setSelectedClinicId(clinicContext.clinicId);
			form.setFieldsValue({ clinic_id: clinicContext.clinicId });
		}
	}, [clinicContext, selectedClinicId, form]);

	// Fetch clinic staff when clinic is selected
	const { data: staffData, isLoading: staffLoading } = useQuery({
		queryKey: ['clinic-staff', selectedClinicId],
		queryFn: () => ClinicsService.getClinicStaff(selectedClinicId!),
		enabled: !!selectedClinicId,
		staleTime: 60000,
	});
	const staffMembers = (staffData as any)?.data || staffData?.staff || [];

	// Fetch clinic services when clinic is selected
	const { data: services, isLoading: servicesLoading } = useQuery({
		queryKey: ['clinic-services', selectedClinicId],
		queryFn: () => ClinicsService.getClinicServices(selectedClinicId!),
		enabled: !!selectedClinicId,
		staleTime: 60000,
	});

	// Get selected pet details
	const selectedPet = useMemo(() => {
		return pets.find(p => p.id === selectedPetId);
	}, [pets, selectedPetId]);

	// Get selected clinic details
	const selectedClinic = useMemo(() => {
		return clinics.find(c => c.id === selectedClinicId);
	}, [clinics, selectedClinicId]);

	// Handle pet selection
	const handlePetChange = (petId: string) => {
		setSelectedPetId(petId);
	};

	// Handle clinic selection
	const handleClinicChange = (clinicId: string) => {
		setSelectedClinicId(clinicId);
		form.setFieldsValue({ staff_id: undefined, service_id: undefined });
	};

	// Handle service selection - auto-fill duration
	const handleServiceChange = (serviceId: string) => {
		const service = services?.find((s: ClinicService) => s.id === serviceId);
		if (service) {
			form.setFieldsValue({ duration_minutes: service.duration });
		}
	};

	// Step validation
	const validateStep = async (step: number): Promise<boolean> => {
		try {
			const fieldsToValidate: string[][] = [
				['pet_id', 'clinic_id'], // Step 0: Pet & Owner
				['appointment_type'], // Step 1: Service & Staff (staff optional)
				['date', 'time'], // Step 2: Schedule
				[], // Step 3: Details (all optional)
			];
			await form.validateFields(fieldsToValidate[step]);
			return true;
		} catch {
			return false;
		}
	};

	// Navigate steps
	const nextStep = async () => {
		if (await validateStep(currentStep)) {
			setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
		}
	};

	const prevStep = () => {
		setCurrentStep(prev => Math.max(prev - 1, 0));
	};

	// Handle form submission
	const handleSubmit = useCallback(async () => {
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
				service_id: values.service_id,
				appointment_type: values.appointment_type,
				scheduled_date: scheduledDate,
				duration_minutes: values.duration_minutes || 30,
				priority: values.priority,
				reason: values.reason,
				symptoms: values.symptoms,
				notes: values.notes,
				is_telemedicine: appointmentMode === 'telemedicine',
				telemedicine_link: values.telemedicine_link,
				is_home_visit: appointmentMode === 'home_visit',
				home_visit_address: values.home_visit_address,
				pet_anxiety_mode: values.pet_anxiety_mode,
				reminder_settings: {
					email_reminder: values.email_reminder ?? true,
					sms_reminder: values.sms_reminder ?? true,
					push_reminder: values.push_reminder ?? false,
					reminder_hours_before: values.reminder_hours_before ?? 24,
				},
				status: 'pending',
			};

			await handleNewAppointment(appointmentData);
			message.success('Appointment created successfully!');
			navigate('/appointments');
		} catch (error) {
			console.error('Failed to create appointment:', error);
		} finally {
			setSubmitting(false);
		}
	}, [form, appointmentMode, handleNewAppointment, navigate]);

	// Cancel handler
	const handleCancel = () => {
		navigate('/appointments');
	};

	// Render pet info card
	const renderPetInfo = () => {
		if (!selectedPet) return null;
		const owner = selectedPet.owner;

		return (
			<Card size="small" className="bg-blue-50 border-blue-200 mt-4">
				<div className="flex items-start gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<Text strong className="text-lg">{selectedPet.name}</Text>
							<Tag color="blue">{selectedPet.species}</Tag>
							{selectedPet.breed && <Tag>{selectedPet.breed}</Tag>}
						</div>
						<div className="text-sm text-gray-600 space-y-1">
							<div>Gender: {selectedPet.gender} • Size: {selectedPet.size}</div>
							{selectedPet.date_of_birth && (
								<div>DOB: {dayjs(selectedPet.date_of_birth).format('MMM D, YYYY')}</div>
							)}
							{selectedPet.weight && <div>Weight: {selectedPet.weight}</div>}
						</div>
						{/* Pet flags/alerts */}
						{selectedPet.flags && selectedPet.flags.length > 0 && (
							<div className="mt-2 flex gap-1">
								{selectedPet.flags.map(flag => (
									<Tag key={flag} color="red" icon={<WarningOutlined />}>
										{flag.replace(/_/g, ' ')}
									</Tag>
								))}
							</div>
						)}
					</div>
					{owner && (
						<div className="border-l border-blue-200 pl-4">
							<Text type="secondary" className="text-xs uppercase">Owner</Text>
							<div className="font-medium">{owner.firstName} {owner.lastName}</div>
							<div className="text-sm text-gray-600 flex items-center gap-1">
								<PhoneOutlined /> {owner.phone}
							</div>
							<div className="text-sm text-gray-600">{owner.email}</div>
						</div>
					)}
				</div>
			</Card>
		);
	};

	// Step 1: Pet & Owner Selection
	const renderStep1 = () => (
		<div className="space-y-6">
			<div>
				<Title level={5} className="!mb-2">Select Pet</Title>
				<Text type="secondary">Search and select the pet for this appointment</Text>
			</div>

			<Form.Item
				name="pet_id"
				rules={[{ required: true, message: 'Please select a pet' }]}
			>
				<Select
					showSearch
					placeholder="Search by pet name or owner..."
					optionFilterProp="children"
					onSearch={setPetSearch}
					onChange={handlePetChange}
					loading={petsLoading}
					filterOption={false}
					size="large"
					notFoundContent={petsLoading ? <Spin size="small" /> : 'No pets found'}
				>
					{pets.map((pet) => (
						<Option key={pet.id} value={pet.id}>
							<div className="flex items-center justify-between">
								<span>
									<strong>{pet.name}</strong> ({pet.species})
								</span>
								{pet.owner && (
									<span className="text-gray-500 text-sm">
										Owner: {pet.owner.firstName} {pet.owner.lastName}
									</span>
								)}
							</div>
						</Option>
					))}
				</Select>
			</Form.Item>

			{renderPetInfo()}

			<Divider />

			<div>
				<Title level={5} className="!mb-2">Select Clinic</Title>
				<Text type="secondary">Choose the clinic for this appointment</Text>
			</div>

			<Form.Item
				name="clinic_id"
				rules={[{ required: true, message: 'Please select a clinic' }]}
			>
				<Select
					showSearch
					placeholder="Select a clinic..."
					optionFilterProp="children"
					onChange={handleClinicChange}
					loading={clinicsLoading}
					size="large"
					disabled={!!clinicContext?.shouldFilterByClinic}
				>
					{clinics.map((clinic) => (
						<Option key={clinic.id} value={clinic.id}>
							<div className="flex items-center justify-between">
								<span><strong>{clinic.name}</strong></span>
								<span className="text-gray-500 text-sm">{clinic.city}</span>
							</div>
						</Option>
					))}
				</Select>
			</Form.Item>

			{selectedClinic && (
				<Card size="small" className="bg-green-50 border-green-200">
					<div className="flex items-center gap-2">
						<HomeOutlined className="text-green-600" />
						<div>
							<div className="font-medium">{selectedClinic.name}</div>
							<div className="text-sm text-gray-600">
								{selectedClinic.address}, {selectedClinic.city}
							</div>
							{selectedClinic.phone && (
								<div className="text-sm text-gray-600">
									<PhoneOutlined /> {selectedClinic.phone}
								</div>
							)}
						</div>
					</div>
				</Card>
			)}
		</div>
	);

	// Step 2: Service & Staff Selection
	const renderStep2 = () => (
		<div className="space-y-6">
			<div>
				<Title level={5} className="!mb-2">Appointment Type</Title>
				<Text type="secondary">Select the type of appointment</Text>
			</div>

			<Form.Item
				name="appointment_type"
				rules={[{ required: true, message: 'Please select appointment type' }]}
			>
				<Select placeholder="Select appointment type..." size="large">
					{getAppointmentTypeOptions().map((opt) => (
						<Option key={opt.value} value={opt.value}>
							{opt.label}
						</Option>
					))}
				</Select>
			</Form.Item>

			{services && services.length > 0 && (
				<>
					<Divider />
					<div>
						<Title level={5} className="!mb-2">Service (Optional)</Title>
						<Text type="secondary">Select a specific service - this will auto-fill duration and pricing</Text>
					</div>

					<Form.Item name="service_id">
						<Select
							placeholder="Select a service..."
							size="large"
							allowClear
							loading={servicesLoading}
							onChange={handleServiceChange}
						>
							{services.map((service: ClinicService) => (
								<Option key={service.id} value={service.id}>
									<div className="flex items-center justify-between">
										<span>{service.name}</span>
										<span className="text-gray-500">
											{service.duration} mins • ${service.price}
										</span>
									</div>
								</Option>
							))}
						</Select>
					</Form.Item>
				</>
			)}

			<Divider />

			<div>
				<Title level={5} className="!mb-2">Assign Staff (Optional)</Title>
				<Text type="secondary">Select a veterinarian or staff member</Text>
			</div>

			<Form.Item name="staff_id">
				<Select
					placeholder={selectedClinicId ? "Select staff member..." : "Select clinic first"}
					size="large"
					allowClear
					loading={staffLoading}
					disabled={!selectedClinicId}
				>
					{staffMembers.map((staff: any) => (
						<Option key={staff.id} value={staff.id}>
							<div className="flex items-center justify-between">
								<span>
									{staff.user
										? `${staff.user.firstName} ${staff.user.lastName}`
										: 'Unknown'}
								</span>
								<Tag>{staff.role}</Tag>
							</div>
						</Option>
					))}
				</Select>
			</Form.Item>

			<Divider />

			<div>
				<Title level={5} className="!mb-2">Priority</Title>
				<Text type="secondary">Set the urgency level</Text>
			</div>

			<Form.Item name="priority" initialValue="normal">
				<Radio.Group size="large">
					{getAppointmentPriorityOptions().map((opt) => (
						<Radio.Button key={opt.value} value={opt.value}>
							{opt.label}
						</Radio.Button>
					))}
				</Radio.Group>
			</Form.Item>
		</div>
	);

	// Step 3: Schedule
	const renderStep3 = () => (
		<div className="space-y-6">
			<div>
				<Title level={5} className="!mb-2">Appointment Mode</Title>
				<Text type="secondary">How will this appointment be conducted?</Text>
			</div>

			<Radio.Group
				value={appointmentMode}
				onChange={(e) => setAppointmentMode(e.target.value)}
				className="w-full"
			>
				<Row gutter={16}>
					<Col span={8}>
						<Radio.Button value="in_person" className="w-full h-20 flex items-center justify-center">
							<div className="text-center">
								<HomeOutlined className="text-2xl block mb-1" />
								<div>In-Person</div>
							</div>
						</Radio.Button>
					</Col>
					<Col span={8}>
						<Radio.Button value="telemedicine" className="w-full h-20 flex items-center justify-center">
							<div className="text-center">
								<VideoCameraOutlined className="text-2xl block mb-1" />
								<div>Telemedicine</div>
							</div>
						</Radio.Button>
					</Col>
					<Col span={8}>
						<Radio.Button value="home_visit" className="w-full h-20 flex items-center justify-center">
							<div className="text-center">
								<HomeOutlined className="text-2xl block mb-1" />
								<div>Home Visit</div>
							</div>
						</Radio.Button>
					</Col>
				</Row>
			</Radio.Group>

			{appointmentMode === 'telemedicine' && (
				<Form.Item
					name="telemedicine_link"
					label="Video Call Link (Optional)"
				>
					<Input
						placeholder="https://meet.google.com/..."
						prefix={<VideoCameraOutlined />}
						size="large"
					/>
				</Form.Item>
			)}

			{appointmentMode === 'home_visit' && (
				<Form.Item
					name="home_visit_address"
					label="Home Visit Address"
					rules={[{ required: appointmentMode === 'home_visit', message: 'Address required for home visits' }]}
				>
					<TextArea
						placeholder="Enter the full address for home visit..."
						rows={2}
					/>
				</Form.Item>
			)}

			<Divider />

			<div>
				<Title level={5} className="!mb-2">Date & Time</Title>
				<Text type="secondary">Select when the appointment should be scheduled</Text>
			</div>

			<Row gutter={16}>
				<Col span={8}>
					<Form.Item
						name="date"
						label="Date"
						rules={[{ required: true, message: 'Please select a date' }]}
					>
						<DatePicker
							className="w-full"
							size="large"
							disabledDate={(current) => current && current < dayjs().startOf('day')}
							format="ddd, MMM D, YYYY"
						/>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						name="time"
						label="Time"
						rules={[{ required: true, message: 'Please select a time' }]}
					>
						<TimePicker
							className="w-full"
							size="large"
							format="h:mm A"
							minuteStep={15}
							use12Hours
						/>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						name="duration_minutes"
						label="Duration (minutes)"
						initialValue={30}
						rules={[{ required: true, message: 'Duration required' }]}
					>
						<InputNumber
							className="w-full"
							size="large"
							min={15}
							max={480}
							step={15}
						/>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);

	// Step 4: Additional Details
	const renderStep4 = () => (
		<div className="space-y-6">
			<div>
				<Title level={5} className="!mb-2">Reason for Visit</Title>
				<Text type="secondary">Brief description of why the pet needs to be seen</Text>
			</div>

			<Form.Item name="reason">
				<Input
					placeholder="e.g., Annual checkup, limping on left leg, not eating..."
					size="large"
				/>
			</Form.Item>

			<Form.Item
				name="symptoms"
				label="Symptoms (if any)"
			>
				<TextArea
					placeholder="Describe any symptoms the pet is experiencing..."
					rows={3}
				/>
			</Form.Item>

			<Form.Item
				name="notes"
				label="Internal Notes"
			>
				<TextArea
					placeholder="Notes visible only to clinic staff..."
					rows={3}
				/>
			</Form.Item>

			<Divider />

			<div>
				<Title level={5} className="!mb-2">Special Handling</Title>
			</div>

			<Form.Item name="pet_anxiety_mode" valuePropName="checked">
				<Checkbox>
					<span className="font-medium">Pet Anxiety Mode</span>
					<Paragraph type="secondary" className="!mb-0 text-sm">
						This pet requires extra care due to anxiety. Staff will be notified to take extra precautions.
					</Paragraph>
				</Checkbox>
			</Form.Item>

			<Divider />

			<div>
				<Title level={5} className="!mb-2">Reminder Settings</Title>
				<Text type="secondary">Configure how the pet owner will be reminded</Text>
			</div>

			<Row gutter={16}>
				<Col span={8}>
					<Form.Item name="email_reminder" valuePropName="checked" initialValue={true}>
						<Checkbox>Email Reminder</Checkbox>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name="sms_reminder" valuePropName="checked" initialValue={true}>
						<Checkbox>SMS Reminder</Checkbox>
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name="push_reminder" valuePropName="checked" initialValue={false}>
						<Checkbox>Push Notification</Checkbox>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item
				name="reminder_hours_before"
				label="Send reminder how many hours before?"
				initialValue={24}
			>
				<Select size="large" style={{ width: 200 }}>
					<Option value={1}>1 hour before</Option>
					<Option value={2}>2 hours before</Option>
					<Option value={4}>4 hours before</Option>
					<Option value={12}>12 hours before</Option>
					<Option value={24}>24 hours before</Option>
					<Option value={48}>48 hours before</Option>
				</Select>
			</Form.Item>

			{/* Summary */}
			<Divider />
			<Alert
				type="info"
				showIcon
				message="Review your appointment"
				description={
					<div className="mt-2 space-y-1">
						{selectedPet && <div><strong>Pet:</strong> {selectedPet.name} ({selectedPet.species})</div>}
						{selectedClinic && <div><strong>Clinic:</strong> {selectedClinic.name}</div>}
						{form.getFieldValue('date') && form.getFieldValue('time') && (
							<div>
								<strong>When:</strong> {form.getFieldValue('date')?.format('MMM D, YYYY')} at {form.getFieldValue('time')?.format('h:mm A')}
							</div>
						)}
						<div><strong>Mode:</strong> {appointmentMode.replace('_', ' ')}</div>
					</div>
				}
			/>
		</div>
	);

	const renderStepContent = () => {
		switch (currentStep) {
			case 0: return renderStep1();
			case 1: return renderStep2();
			case 2: return renderStep3();
			case 3: return renderStep4();
			default: return null;
		}
	};

	return (
		<div className="space-y-4">
			{/* Page Header */}
			<div className="flex items-center justify-between py-2">
				<div className="flex items-center gap-3">
					<Button
						icon={<ArrowLeftOutlined />}
						onClick={handleCancel}
						type="text"
						className="text-slate-600 hover:text-slate-900"
					>
						Back
					</Button>
					<div className="border-l border-slate-200 pl-3">
						<Title level={3} className="!mb-0 !text-lg font-semibold">
							New Appointment
						</Title>
						<Text type="secondary" className="text-xs">
							Schedule a new appointment for a pet
						</Text>
					</div>
				</div>
				<Space size="small">
					<Button onClick={handleCancel}>Cancel</Button>
					{currentStep === STEPS.length - 1 ? (
						<Button
							type="primary"
							icon={<SaveOutlined />}
							onClick={handleSubmit}
							loading={submitting}
						>
							Create Appointment
						</Button>
					) : (
						<Button type="primary" onClick={nextStep}>
							Continue
						</Button>
					)}
				</Space>
			</div>

			{/* Steps */}
			<Card className="admin-card">
				<Steps
					current={currentStep}
					onChange={(step) => {
						// Only allow going back or to previously completed steps
						if (step < currentStep) {
							setCurrentStep(step);
						}
					}}
					items={STEPS.map((s, index) => ({
						title: s.title,
						icon: s.icon,
						status: index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait',
					}))}
				/>
			</Card>

			{/* Form Content */}
			<Card className="admin-card">
				<Form
					form={form}
					layout="vertical"
					requiredMark="optional"
				>
					{renderStepContent()}
				</Form>

				{/* Step Navigation */}
				<div className="flex justify-between mt-8 pt-4 border-t">
					<Button
						onClick={prevStep}
						disabled={currentStep === 0}
					>
						Previous
					</Button>
					{currentStep === STEPS.length - 1 ? (
						<Button
							type="primary"
							icon={<SaveOutlined />}
							onClick={handleSubmit}
							loading={submitting}
							size="large"
						>
							Create Appointment
						</Button>
					) : (
						<Button type="primary" onClick={nextStep} size="large">
							Continue
						</Button>
					)}
				</div>
			</Card>
		</div>
	);
};

export { AppointmentFormPage };
export default AppointmentFormPage;
