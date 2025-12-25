import {
	ActionButtonsSection,
	BasicInfoSection,
	CareInfoSection,
	EmergencyContactSection,
	MedicalInfoSection,
	PhotoStatusSection,
} from '@/components/pets/pet-form-sections';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Space, Spin, Typography } from 'antd';

import { useDistinctAllergies, useDistinctMedications, usePetOwners } from '@/hooks/pets';
import { usePetForm } from '@/hooks/pets/use-pet-form';
import type { PetFormData } from '@/types';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const PetFormPage = () => {
	const { t } = useTranslation('common');
	const { form, isEditing, loading, loadingPet, pet, handleSubmit, handleCancel } = usePetForm();
	const { data: allergyOptions = [] } = useDistinctAllergies();
	const { data: medicationOptions = [] } = useDistinctMedications();
	const { data: owners = [], isLoading: loadingOwners } = usePetOwners();

	const title = isEditing ? 'Edit Pet' : 'Add New Pet';

	if (loadingPet) {
		return (
			<Card className='admin-card flex items-center justify-center min-h-[200px]'>
				<Spin />
			</Card>
		);
	}

	return (
		<div className='space-y-4'>
			{/* Page Header - Compact */}
			<div className='flex items-center justify-between py-2'>
				<div className='flex items-center gap-3'>
					<Button
						icon={<ArrowLeftOutlined />}
						onClick={handleCancel}
						type="text"
						className='text-slate-600 hover:text-slate-900'
					>
						{t('actions.back')}
					</Button>
					<div className='border-l border-slate-200 pl-3'>
						<Title level={3} className='!mb-0 !text-lg font-semibold'>
							{title}
						</Title>
						<Text type='secondary' className='text-xs'>
							{isEditing
								? 'Update pet information'
								: 'Register a new pet'}
						</Text>
					</div>
				</div>
				<Space size="small">
					<Button onClick={handleCancel}>
						{t('actions.cancel')}
					</Button>
					<Button
						type='primary'
						icon={<SaveOutlined />}
						onClick={handleSubmit}
						loading={loading}
						className='bg-indigo-600 hover:bg-indigo-500'
					>
						{isEditing ? t('actions.update') : t('actions.create')}
					</Button>
				</Space>
			</div>

			<Card className='admin-card'>
				<Form<PetFormData>
					form={form}
					layout='vertical'
					initialValues={{
						is_spayed_neutered: pet?.is_spayed_neutered ?? false,
						is_vaccinated: pet?.is_vaccinated ?? false,
						allergies: pet?.allergies ?? [],
						medications: pet?.medications ?? [],
						is_active: pet?.is_active ?? true,
					}}
					onFinish={handleSubmit}
				>
					<BasicInfoSection
						form={form}
						petSpecies={[]}
						breeds={[]}
						genders={[]}
						sizes={[]}
						selectedSpecies={pet?.species ?? ''}
						onSpeciesChange={() => { }}
						owners={owners}
						loadingOwners={loadingOwners}
					/>

					<MedicalInfoSection form={form} editingPet={pet ?? undefined} />

					<CareInfoSection
						form={form}
						allergyOptions={allergyOptions}
						medicationOptions={medicationOptions}
					/>

					<EmergencyContactSection form={form} />

					<PhotoStatusSection form={form} />

					<Form.Item className='mb-0'>
						<ActionButtonsSection onCancel={handleCancel} loading={loading} editingPet={pet} />
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export { PetFormPage };
export default PetFormPage;
