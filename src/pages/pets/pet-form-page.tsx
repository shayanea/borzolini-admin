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
  const { t } = useTranslation('components');
  const { form, isEditing, loading, loadingPet, pet, handleSubmit, handleCancel } = usePetForm();
  const { data: allergyOptions = [] } = useDistinctAllergies();
  const { data: medicationOptions = [] } = useDistinctMedications();
  const { data: owners = [], isLoading: loadingOwners } = usePetOwners();

  const title = isEditing ? t('modals.petForm.titleEdit') : t('modals.petForm.titleAdd');

  if (loadingPet) {
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
                ? t('pets.editDescription', 'Update pet information')
                : t('pets.createDescription', 'Register a new pet')}
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
            onSpeciesChange={() => {}}
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
