import { FormSkeleton } from '@/components/shared';
import {
	AccountInfoSection,
	AddressSection,
	PersonalInfoSection,
} from '@/components/users/user-form-sections';
import { USER_FORM_LABELS } from '@/constants/user-management';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Space, Typography } from 'antd';

import { useUserForm } from '@/hooks/users/use-user-form';
import type { UserRole } from '@/types';
import type { UserFormValues } from '@/types/user-management';

const { Title, Text } = Typography;

interface UserFormPageProps {
	defaultRole?: UserRole;
}

const UserFormPage = ({ defaultRole }: UserFormPageProps) => {
	const { form, isEditing, loading, loadingUser, handleSubmit, handleCancel } = useUserForm({ defaultRole });

	const title = isEditing ? USER_FORM_LABELS.EDIT_TITLE : USER_FORM_LABELS.CREATE_TITLE;

	if (loadingUser) {
		return <FormSkeleton />;
	}

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<Button icon={<ArrowLeftOutlined />} onClick={handleCancel} className='flex items-center'>
						{USER_FORM_LABELS.BACK_BUTTON}
					</Button>
					<div>
						<Title level={2} className='!mb-0'>
							{title}
						</Title>
						<Text type='secondary'>
							{isEditing
								? USER_FORM_LABELS.EDIT_DESCRIPTION
								: USER_FORM_LABELS.CREATE_DESCRIPTION}
						</Text>
					</div>
				</div>
				<Space>
					<Button onClick={handleCancel}>{USER_FORM_LABELS.CANCEL_BUTTON}</Button>
					<Button
						type='primary'
						icon={<SaveOutlined />}
						onClick={handleSubmit}
						loading={loading}
						className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
					>
						{isEditing ? USER_FORM_LABELS.UPDATE_BUTTON : USER_FORM_LABELS.CREATE_BUTTON}
					</Button>
				</Space>
			</div>

			<Card className='admin-card'>
				<Form<UserFormValues> form={form} layout='vertical'>
					<PersonalInfoSection />
					<AccountInfoSection />
					<AddressSection />

					<Form.Item className='mb-0'>
						<Space className='w-full justify-end'>
							<Button onClick={handleCancel}>{USER_FORM_LABELS.CANCEL_BUTTON}</Button>
							<Button
								type='primary'
								htmlType='submit'
								onClick={handleSubmit}
								loading={loading}
								className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
							>
								{isEditing ? USER_FORM_LABELS.UPDATE_BUTTON : USER_FORM_LABELS.CREATE_BUTTON}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export { UserFormPage };
export default UserFormPage;
