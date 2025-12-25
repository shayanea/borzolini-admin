import { MIN_LENGTH_RULE, REQUIRED_RULE } from '@/constants/form-validation';
import { Card, Col, Form, Input, Row, Select, Spin } from 'antd';

import { PhoneField } from '@/components/shared';
import { useValidationMessages } from '@/hooks/common';
import { UsersService } from '@/services/users/users.service';
import type { User } from '@/types';
import { FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;

const UserSelect = ({ value, onChange }: { value?: string; onChange?: (value: string) => void }) => {
	const [data, setData] = useState<User[]>([]);
	const [fetching, setFetching] = useState(false);
	const fetchRef = useRef<number>(0);

	const fetchUser = useCallback(async (value: string) => {
		if (fetchRef.current) {
			window.clearTimeout(fetchRef.current);
		}
		fetchRef.current = window.setTimeout(async () => {
			setFetching(true);
			try {
				// Fetch all users or search
				// Note: The API might need 'search' param in getUsers
				const { data: users } = await UsersService.getUsers({ search: value, limit: 20 });
				setData(users);
			} catch (error) {
				console.error('Failed to fetch users', error);
			} finally {
				setFetching(false);
			}
		}, 800);
	}, []);

	return (
		<Select
			showSearch
			value={value}
			placeholder="Select an owner"
			defaultActiveFirstOption={false}
			filterOption={false}
			onSearch={fetchUser}
			onChange={onChange}
			notFoundContent={fetching ? <Spin size="small" /> : null}
			onFocus={() => {
				if (data.length === 0) fetchUser('');
			}}
		>
			{data.map((user) => (
				<Option key={user.id} value={user.id}>
					{user.firstName} {user.lastName} <span className="text-gray-400 text-xs">({user.email})</span>
				</Option>
			))}
		</Select>
	);
};

const BasicInformationStep: FC = () => {
	const { t } = useTranslation('components');
	const validationMessages = useValidationMessages();

	return (
		<Card title={t('forms.clinicForm.basicInfo')} className='mb-6'>
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
					<PhoneField
						label={t('forms.clinicForm.phoneNumber')}
						placeholder={t('forms.clinicForm.phonePlaceholder')}
					/>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						name="owner_id"
						label="Clinic Owner"
						rules={[{ required: true, message: 'Please select a clinic owner' }]}
					>
						<UserSelect />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item
						name='description'
						label={t('forms.clinicForm.description')}
						rules={[{ max: 500, message: t('forms.clinicForm.descriptionMaxLength') }]}
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
		</Card>
	);
};

export { BasicInformationStep };
export default BasicInformationStep;
