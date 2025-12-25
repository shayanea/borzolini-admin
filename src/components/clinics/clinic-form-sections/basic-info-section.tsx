/* eslint-env browser */
import { MAX_LENGTH_RULE, MIN_LENGTH_RULE, REQUIRED_RULE } from '@/constants/form-validation';
import { Avatar, Col, Form, Input, Row, Select, Spin } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';

import { PhoneField } from '@/components/shared';
import { useValidationMessages } from '@/hooks/common';
import UsersService from '@/services/users';
import { User } from '@/types';
import { useTranslation } from 'react-i18next';
import { BasicInfoSectionProps } from './types';

const { TextArea } = Input;
const { Option } = Select;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
	let timeout: number | undefined;
	return function (...args: Parameters<T>) {
		if (timeout !== undefined) {
			window.clearTimeout(timeout);
		}
		timeout = window.setTimeout(() => func(...args), wait);
	};
}

const BasicInfoSection: FC<BasicInfoSectionProps> = () => {
	const { t } = useTranslation('components');
	const validationMessages = useValidationMessages();

	// User Search State
	const [userOptions, setUserOptions] = useState<User[]>([]);
	const [fetchingUsers, setFetchingUsers] = useState(false);

	const fetchUsers = useMemo(
		() =>
			debounce(async (search: string) => {
				setFetchingUsers(true);
				try {
					const { data } = await UsersService.getUsers({ search, limit: 20 });
					setUserOptions(data);
				} catch (error) {
					console.error('Failed to search users', error);
				} finally {
					setFetchingUsers(false);
				}
			}, 800),
		[]
	);

	// Initial fetch
	useEffect(() => {
		fetchUsers('');
	}, [fetchUsers]);

	const handleSearch = (newValue: string) => {
		fetchUsers(newValue);
	};

	return (
		<>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						name='name'
						label={t('forms.clinicForm.clinicName')}
						rules={[
							REQUIRED_RULE(validationMessages.CLINIC_NAME_REQUIRED),
							MIN_LENGTH_RULE(2, validationMessages.CLINIC_NAME_MIN_LENGTH),
						]}
					>
						<Input placeholder={t('forms.clinicForm.clinicNamePlaceholder')} />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item
						name="owner_id"
						label="Clinic Owner"
						rules={[REQUIRED_RULE('Please select a clinic owner')]}
					>
						<Select
							showSearch
							placeholder="Search for a user..."
							notFoundContent={fetchingUsers ? <Spin size="small" /> : null}
							filterOption={false}
							onSearch={handleSearch}
							loading={fetchingUsers}
							allowClear
							optionLabelProp="label"
						>
							{userOptions.map((user) => (
								<Option key={user.id} value={user.id} label={`${user.firstName} ${user.lastName}`}>
									<div className="flex items-center gap-2">
										<Avatar src={user.avatar} size="small">
											{user.firstName?.charAt(0)}
										</Avatar>
										<div>
											<div className="font-medium">{user.firstName} {user.lastName}</div>
											<div className="text-xs text-gray-400">{user.email}</div>
										</div>
									</div>
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<PhoneField
						label={t('forms.clinicForm.phoneNumber')}
						placeholder={t('forms.clinicForm.phonePlaceholder')}
					/>
				</Col>
				<Col span={12}>
					{/* Empty col for alignment or other field */}
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item
						name='description'
						label={t('forms.clinicForm.description')}
						rules={[MAX_LENGTH_RULE(500, validationMessages.DESCRIPTION_MAX_LENGTH)]}
					>
						<TextArea
							rows={3}
							placeholder={t('forms.clinicForm.descriptionPlaceholder')}
							maxLength={500}
							showCount
						/>
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};

export { BasicInfoSection };
export default BasicInfoSection;
