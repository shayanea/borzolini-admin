import { Col, Form, Input, Row, Switch } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MedicalInfoSectionProps } from './types';

const { TextArea } = Input;

const MedicalInfoSection: FC<MedicalInfoSectionProps> = () => {
  const { t } = useTranslation('components');

  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>{t('forms.petForm.medicalInfo')}</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='microchip_number'
            label={t('forms.petForm.microchipNumber')}
            rules={[{ max: 50, message: t('forms.petForm.microchipMaxLength') }]}
          >
            <Input placeholder={t('forms.petForm.microchipNumberPlaceholder')} maxLength={50} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='is_spayed_neutered' label={t('forms.petForm.spayedNeutered')} valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='is_vaccinated' label={t('forms.petForm.vaccinated')} valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name='medical_history' label={t('forms.petForm.medicalHistory')}>
        <TextArea placeholder={t('forms.petForm.medicalHistoryPlaceholder')} rows={3} />
      </Form.Item>

      <Form.Item name='behavioral_notes' label={t('forms.petForm.behavioralNotes')}>
        <TextArea placeholder={t('forms.petForm.behavioralNotesPlaceholder')} rows={3} />
      </Form.Item>
    </div>
  );
};

export default MedicalInfoSection;
