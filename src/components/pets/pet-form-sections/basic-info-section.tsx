import { Col, DatePicker, Form, Input, Row, Select } from 'antd';

import { BasicInfoSectionProps } from './types';
import { FC } from 'react';
import { createPositiveNumberRule } from '@/constants/form-validation';
import { useTranslation } from 'react-i18next';
import { useValidationMessages } from '@/hooks/use-validation-messages';

const { Option } = Select;

const BasicInfoSection: FC<BasicInfoSectionProps> = ({
  petSpecies,
  breeds,
  genders,
  sizes,
  selectedSpecies,
  onSpeciesChange,
  owners,
  loadingOwners,
}) => {
  const { t } = useTranslation('components');
  const validationMessages = useValidationMessages();

  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>{t('forms.petForm.basicInfo')}</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='name'
            label={t('forms.petForm.petName')}
            rules={[
              { required: true, message: validationMessages.PET_NAME_REQUIRED },
              { min: 1, message: validationMessages.PET_NAME_MIN_LENGTH },
              { max: 100, message: validationMessages.PET_NAME_MAX_LENGTH },
            ]}
          >
            <Input placeholder={t('forms.petForm.petNamePlaceholder')} maxLength={100} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='owner_id'
            label={t('forms.petForm.owner')}
            rules={[{ required: true, message: t('forms.petForm.ownerRequired') }]}
          >
            <Select
              placeholder={t('forms.petForm.selectOwnerPlaceholder')}
              showSearch
              loading={loadingOwners}
              filterOption={(input, option) => {
                const label = option?.label || '';
                return String(label).toLowerCase().includes(input.toLowerCase());
              }}
              options={owners.map(owner => ({
                label: `${owner.name} (${owner.email})`,
                value: owner.id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='species'
            label={t('forms.petForm.species')}
            rules={[{ required: true, message: validationMessages.SPECIES_REQUIRED }]}
          >
            <Select
              placeholder={t('forms.petForm.selectSpeciesPlaceholder')}
              onChange={onSpeciesChange}
            >
              {petSpecies.map(species => (
                <Option key={species} value={species}>
                  {species.charAt(0).toUpperCase() + species.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='gender'
            label={t('forms.petForm.gender')}
            rules={[{ required: true, message: validationMessages.GENDER_REQUIRED }]}
          >
            <Select placeholder={t('forms.petForm.selectGenderPlaceholder')}>
              {genders.map(gender => (
                <Option key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='breed'
            label={t('forms.petForm.breed')}
            rules={[{ max: 100, message: t('forms.petForm.breedMaxLength') }]}
          >
            <Select
              placeholder={t('forms.petForm.selectBreedPlaceholder')}
              disabled={!selectedSpecies}
            >
              {breeds.map(breed => (
                <Option key={breed} value={breed}>
                  {breed}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='size'
            label={t('forms.petForm.size')}
            rules={[{ required: true, message: validationMessages.SIZE_REQUIRED }]}
          >
            <Select placeholder={t('forms.petForm.selectSizePlaceholder')}>
              {sizes.map(size => (
                <Option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name='date_of_birth'
            label={t('forms.petForm.dateOfBirth')}
            rules={[{ required: true, message: validationMessages.DOB_REQUIRED }]}
          >
            <DatePicker className='w-full' placeholder={t('forms.petForm.selectDatePlaceholder')} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='weight'
            label={t('forms.petForm.weight')}
            rules={[createPositiveNumberRule(validationMessages.WEIGHT_INVALID)]}
          >
            <Input
              placeholder={t('forms.petForm.weightPlaceholder')}
              type='number'
              step='0.1'
              min='0'
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='color'
            label={t('forms.petForm.color')}
            rules={[{ max: 100, message: validationMessages.COLOR_MAX_LENGTH }]}
          >
            <Input placeholder={t('forms.petForm.colorPlaceholder')} maxLength={100} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BasicInfoSection;
