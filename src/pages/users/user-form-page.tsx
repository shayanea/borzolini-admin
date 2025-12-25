import {
	AccountInfoSection,
	AddressSection,
	PersonalInfoSection,
} from '@/components/users/user-form-sections';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Space, Spin, Typography } from 'antd';

import { useUserForm } from '@/hooks/users/use-user-form';
import type { UserFormValues } from '@/types/user-management';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const UserFormPage = () => {
	const { t } = useTranslation('components');
	const { form, isEditing, loading, loadingUser, handleSubmit, handleCancel } = useUserForm();

	const title = isEditing ? t('modals.userForm.titleEdit') : t('modals.userForm.titleCreate');

	if (loadingUser) {
		return (
			<Card className='admin-card flex items-center justify-center min-h-[200px]'>
				<Spin />
			</Card>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<Button icon={<ArrowLeftOutlined />} onClick={handleCancel} className='flex items-center'>
						{t('common.back')}
					</Button>
					<div>
						<Title level={2} className='!mb-0'>
							{title}
						</Title>
						<Text type='secondary'>
							{isEditing
								? t('users.manageUsers')
								: t('users.createUserDescription', 'Create a new clinic user')}
						</Text>
					</div>
				</div>
				<Space>
					<Button onClick={handleCancel}>{t('common.cancel')}</Button>
					<Button
						type='primary'
						icon={<SaveOutlined />}
						onClick={handleSubmit}
						loading={loading}
						className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
					>
						{isEditing ? t('common.update') : t('common.create')}
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
							<Button onClick={handleCancel}>{t('common.cancel')}</Button>
							<Button
								type='primary'
								htmlType='submit'
								onClick={handleSubmit}
								loading={loading}
								className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
							>
								{isEditing ? t('common.update') : t('common.create')}
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
