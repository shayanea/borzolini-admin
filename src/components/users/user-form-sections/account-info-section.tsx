import { EmailField, PhoneField } from '@/components/shared';
import { REQUIRED_RULE, VALIDATION_MESSAGES } from '@/constants/form-validation';
import { Col, Form, Row, Select, Spin, Switch } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { USER_ROLES } from '@/constants/user-management';
import ClinicsService from '@/services/clinics/clinics.service';
import { Clinic } from '@/types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountInfoSectionProps } from './types';

const { Option } = Select;

const AccountInfoSection: FC<AccountInfoSectionProps> = ({ editingUser }) => {
	const { t } = useTranslation('components');
	const form = Form.useFormInstance();
	const selectedRole = Form.useWatch('role', form);
	const [clinics, setClinics] = useState<Clinic[]>([]);
	const [fetchingClinics, setFetchingClinics] = useState(false);

	// Fetch clinics based on search term
	const fetchClinics = async (search: string = '') => {
		setFetchingClinics(true);
		try {
			// Use searchClinics for searching, or getClinics for initial load
			const results = search
				? await ClinicsService.searchClinics(search)
				: (await ClinicsService.getClinics({ limit: 50 })).clinics;
			setClinics(results);
		} catch (error) {
			console.error('Failed to fetch clinics:', error);
		} finally {
			setFetchingClinics(false);
		}
	};

	// Debounce search
	const handleSearch = useMemo(() => {
		let timeoutId: NodeJS.Timeout;
		return (value: string) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fetchClinics(value), 500);
		};
	}, []);

	// Initial load of clinics if editing user is already a clinic admin or when role switches to clinic admin
	useEffect(() => {
		if (selectedRole === USER_ROLES.CLINIC_ADMIN) {
			fetchClinics();
		}
	}, [selectedRole]);

	// Set initial clinic if editing and user has a clinicId
	useEffect(() => {
		if (editingUser?.clinic && selectedRole === USER_ROLES.CLINIC_ADMIN) {
			setClinics((prev) => {
				const exists = prev.some((c) => c.id === editingUser.clinic.id);
				if (exists) return prev;
				return [editingUser.clinic, ...prev];
			});
		}
	}, [editingUser, selectedRole]);

	return (
		<>
			<Row gutter={16}>
				<Col span={12}>
					<EmailField disabled={!!editingUser} placeholder={t('forms.userForm.emailPlaceholder')} />
				</Col>
				<Col span={12}>
					<PhoneField required={false} placeholder={t('forms.userForm.phonePlaceholder')} />
				</Col>
			</Row>



			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						name='role'
						label={t('forms.userForm.role')}
						rules={[REQUIRED_RULE(VALIDATION_MESSAGES.ROLE_REQUIRED)]}
					>
						<Select placeholder={t('forms.userForm.selectRolePlaceholder')}>
							<Option value={USER_ROLES.ADMIN}>{t('forms.userForm.admin')}</Option>
							<Option value={USER_ROLES.VETERINARIAN}>{t('forms.userForm.veterinarian')}</Option>
							<Option value={USER_ROLES.STAFF}>{t('forms.userForm.staff')}</Option>
							<Option value={USER_ROLES.PATIENT}>{t('forms.userForm.patient')}</Option>
							<Option value={USER_ROLES.CLINIC_ADMIN}>{t('forms.userForm.clinic_admin')}</Option>
						</Select>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						name='isActive'
						label={t('forms.userForm.accountStatus')}
						valuePropName='checked'
					>
						<Switch
							checkedChildren={t('forms.userForm.active')}
							unCheckedChildren={t('forms.userForm.inactive')}
						/>
					</Form.Item>
				</Col>
			</Row>

			{selectedRole === USER_ROLES.CLINIC_ADMIN && (
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name='clinic_id'
							label={t('forms.userForm.clinic', 'Clinic')}
							rules={[REQUIRED_RULE(t('validation.clinicRequired', 'Clinic is required'))]}
						>
							<Select
								showSearch
								placeholder={t('forms.userForm.selectClinic', 'Select a Clinic')}
								filterOption={false}
								onSearch={handleSearch}
								notFoundContent={fetchingClinics ? <Spin size="small" /> : null}
								loading={fetchingClinics}
								allowClear
							>
								{clinics.map((clinic) => (
									<Option key={clinic.id} value={clinic.id}>
										{clinic.name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
			)}

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						name='isEmailVerified'
						label={t('forms.userForm.emailVerification')}
						valuePropName='checked'
					>
						<Switch
							checkedChildren={t('forms.userForm.verified')}
							unCheckedChildren={t('forms.userForm.unverified')}
						/>
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};

export { AccountInfoSection };
export default AccountInfoSection;
