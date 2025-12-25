import type { UserFormModalProps, UserFormValues } from '@/types/user-management';
import { Form } from 'antd';
import { useCallback, useEffect } from 'react';
import {
	AccountInfoSection,
	ActionButtonsSection,
	AddressSection,
	PersonalInfoSection,
} from './user-form-sections';

import { FormModal } from '@/components/shared/form-modal';
import { USER_ROLES } from '@/constants/user-management';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

/**
 * Normalize phone number to E.164 format by removing hyphens and spaces
 * Example: "+1-555-0123" -> "+15550123"
 */
const normalizePhoneNumber = (phone: string | undefined): string | undefined => {
	if (!phone) return phone;
	return phone.replace(/[-\s]/g, '');
};

const UserFormModal = ({
	isVisible,
	editingUser,
	loading,
	onCancel,
	onSubmit,
}: UserFormModalProps) => {
	const { t } = useTranslation('components');
	const [form] = Form.useForm();

	useEffect(() => {
		if (isVisible) {
			if (editingUser) {
				form.setFieldsValue({
					firstName: editingUser.firstName,
					lastName: editingUser.lastName,
					email: editingUser.email,
					phone: editingUser.phone,
					role: editingUser.role,
					address: editingUser.address,
					city: editingUser.city,
					country: editingUser.country,
					postalCode: editingUser.postalCode,
					dateOfBirth: editingUser.dateOfBirth ? dayjs(editingUser.dateOfBirth) : undefined,
					avatar: editingUser.avatar,
					isActive: editingUser.isActive,
					isEmailVerified: editingUser.isEmailVerified,
				});
			} else {
				form.resetFields();
			}
		}
	}, [editingUser, form, isVisible]);

	const handleSubmit = useCallback(
		(values: UserFormValues) => {
			const normalizedValues = {
				...values,
				phone: normalizePhoneNumber(values.phone),
			};
			onSubmit(normalizedValues);
		},
		[onSubmit]
	);

	return (
		<FormModal
			visible={isVisible}
			title={editingUser ? t('modals.userForm.titleEdit') : t('modals.userForm.titleCreate')}
			form={form}
			onCancel={onCancel}
			onSubmit={handleSubmit}
			loading={loading}
			isEditMode={!!editingUser}
			width={600}
			showFooter={false}
			initialValues={{
				role: USER_ROLES.PATIENT,
				isActive: true,
			}}
		>
			{/* Personal Information */}
			<PersonalInfoSection />

			{/* Account Information */}
			<AccountInfoSection editingUser={editingUser} />

			{/* Address Information */}
			<AddressSection />

			{/* Action Buttons */}
			<Form.Item className='mb-0'>
				<ActionButtonsSection
					onCancel={() => {
						form.resetFields();
						onCancel();
					}}
					loading={loading}
					editingUser={editingUser}
				/>
			</Form.Item>
		</FormModal>
	);
};

export { UserFormModal };
export default UserFormModal;
