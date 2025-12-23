import {
	BasicInformationStep,
	ContactInformationStep,
	LocationInformationStep,
	MediaBrandingStep,
	OperatingHoursStep,
	ServicesSpecializationsStep,
	SocialMediaStep,
	StatusStep,
} from '@/components/clinics/form';
import {
	CLINIC_FORM_LABELS,
	CLINIC_INSURANCE_PROVIDER_OPTIONS,
	CLINIC_PAYMENT_METHOD_OPTIONS,
	CLINIC_SERVICE_OPTIONS,
	CLINIC_SPECIALIZATION_OPTIONS,
	DEFAULT_CLINIC_COUNTRY,
} from '@/constants/clinics';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Space, Typography } from 'antd';

import { useClinicForm } from '@/hooks/clinics';

const { Title, Text } = Typography;

const ClinicForm = () => {
	const {
		form,
		daysOfWeek,
		getDefaultOperatingHours,
		title,
		isEditing,
		loading,
		loadingClinic,
		handleSubmit,
		handleCancel,
	} = useClinicForm();

	if (loadingClinic) {
		return <div>Loading...</div>;
	}

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<Button icon={<ArrowLeftOutlined />} onClick={handleCancel} className='flex items-center'>
						{CLINIC_FORM_LABELS.BACK_BUTTON}
					</Button>
					<div>
						<Title level={2} className='!mb-0'>
							{title}
						</Title>
						<Text type='secondary'>
							{isEditing
								? CLINIC_FORM_LABELS.EDIT_DESCRIPTION
								: CLINIC_FORM_LABELS.CREATE_DESCRIPTION}
						</Text>
					</div>
				</div>
				<Space>
					<Button onClick={handleCancel}>{CLINIC_FORM_LABELS.CANCEL_BUTTON}</Button>
					<Button
						type='primary'
						icon={<SaveOutlined />}
						onClick={handleSubmit}
						loading={loading}
						className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
					>
						{isEditing ? CLINIC_FORM_LABELS.UPDATE_BUTTON : CLINIC_FORM_LABELS.CREATE_BUTTON}
					</Button>
				</Space>
			</div>

			<Form
				form={form}
				layout='vertical'
				initialValues={{
					is_active: true,
					country: DEFAULT_CLINIC_COUNTRY,
					services: [],
					specializations: [],
					insurance_providers: [],
					payment_methods: ['Cash', 'Credit Card', 'Insurance'],
					operating_hours: getDefaultOperatingHours(),
				}}
			>
				<BasicInformationStep />
				<LocationInformationStep />
				<ContactInformationStep />
				<MediaBrandingStep />
				<SocialMediaStep />
				<ServicesSpecializationsStep
					serviceOptions={CLINIC_SERVICE_OPTIONS}
					specializationOptions={CLINIC_SPECIALIZATION_OPTIONS}
					insuranceProviderOptions={CLINIC_INSURANCE_PROVIDER_OPTIONS}
					paymentMethodOptions={CLINIC_PAYMENT_METHOD_OPTIONS}
				/>
				<OperatingHoursStep daysOfWeek={daysOfWeek} />
				<StatusStep />
			</Form>
		</div>
	);
};

export { ClinicForm };
export default ClinicForm;
