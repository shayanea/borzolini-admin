import { Form } from 'antd';
import {
	BasicInfoSection,
	ContactInfoSection,
	LocationSection,
	StatusSection,
} from './clinic-form-sections';

import { FormModal } from '@/components/shared/form-modal';
import type { Clinic } from '@/types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ClinicFormModalProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => Promise<void>;
	loading?: boolean;
	editingClinic: Clinic | null;
}

interface ClinicFormValues {
	name: string;
	description?: string;
	owner_id?: string;
	address: string;
	city: string;
	country: string;
	postal_code?: string;
	phone: string;
	email: string;
	website?: string;
	is_active: boolean;
	// Social Media Fields
	facebook_url?: string;
	twitter_url?: string;
	instagram_url?: string;
	linkedin_url?: string;
	youtube_url?: string;
	tiktok_url?: string;
}

/**
 * Normalize phone number to E.164 format by removing hyphens and spaces
 * Example: "+1-555-0123" -> "+15550123"
 */
const normalizePhoneNumber = (phone: string | undefined): string | undefined => {
	if (!phone) return phone;
	return phone.replace(/[-\s]/g, '');
};

const ClinicFormModal = ({
	visible,
	onCancel,
	onSubmit,
	loading = false,
	editingClinic,
}: ClinicFormModalProps) => {
	const { t } = useTranslation('components');
	const [form] = Form.useForm<ClinicFormValues>();

	const isEditing = !!editingClinic;
	const title = isEditing ? t('modals.clinicForm.titleEdit') : t('modals.clinicForm.titleAdd');

	// Wrapper to normalize phone numbers before submission
	const handleSubmit = async (values: any) => {
		const normalizedValues = {
			...values,
			phone: normalizePhoneNumber(values.phone),
			emergency_phone: normalizePhoneNumber(values.emergency_phone),
		};
		await onSubmit(normalizedValues);
	};

	useEffect(() => {
		if (visible && editingClinic) {
			form.setFieldsValue({
				name: editingClinic.name,
				description: editingClinic.description || '',
				owner_id: editingClinic.owner_id,
				address: editingClinic.address,
				city: editingClinic.city,
				country: editingClinic.country,
				postal_code: editingClinic.postal_code || '',
				phone: editingClinic.phone,
				email: editingClinic.email,
				website: editingClinic.website || '',
				is_active: editingClinic.is_active,
				// Social Media Fields
				facebook_url: editingClinic.facebook_url || '',
				twitter_url: editingClinic.twitter_url || '',
				instagram_url: editingClinic.instagram_url || '',
				linkedin_url: editingClinic.linkedin_url || '',
				youtube_url: editingClinic.youtube_url || '',
				tiktok_url: editingClinic.tiktok_url || '',
			});
		} else if (visible && !editingClinic) {
			form.resetFields();
			form.setFieldsValue({
				is_active: true,
				country: 'United States',
			});
		}
	}, [visible, editingClinic, form]);

	return (
		<FormModal
			visible={visible}
			title={title}
			form={form}
			onCancel={onCancel}
			onSubmit={handleSubmit}
			loading={loading}
			isEditMode={isEditing}
			width={800}
			initialValues={{
				isActive: true,
				country: 'United States',
			}}
			formClassName="mt-4"
		>
			{/* Basic Information */}
			<BasicInfoSection form={form} />

			{/* Location Information */}
			<LocationSection form={form} />

			{/* Contact Information */}
			<ContactInfoSection form={form} />

			{/* Status */}
			<StatusSection form={form} />
		</FormModal>
	);
};

export { ClinicFormModal };
export default ClinicFormModal;
