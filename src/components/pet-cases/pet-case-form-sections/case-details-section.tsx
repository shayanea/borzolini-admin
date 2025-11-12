import { Form, Input } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { CaseDetailsSectionProps } from './types';

const { TextArea } = Input;

export const CaseDetailsSection: FC<CaseDetailsSectionProps> = () => {
  const { t } = useTranslation('components');

  return (
    <>
      <Form.Item
        label={t('forms.petCaseForm.description')}
        name='description'
        rules={[{ required: true, message: t('forms.petCaseForm.descriptionRequired') }]}
      >
        <TextArea rows={4} placeholder={t('forms.petCaseForm.descriptionPlaceholder')} />
      </Form.Item>

      <Form.Item
        label={t('forms.petCaseForm.initialSymptoms')}
        name='initial_symptoms'
        help={t('forms.petCaseForm.initialSymptomsHelp')}
      >
        <TextArea
          rows={4}
          placeholder={t('forms.petCaseForm.initialSymptomsPlaceholder')}
        />
      </Form.Item>

      <Form.Item label={t('forms.petCaseForm.additionalNotes')} name='notes'>
        <TextArea rows={3} placeholder={t('forms.petCaseForm.additionalNotesPlaceholder')} />
      </Form.Item>
    </>
  );
};

export default CaseDetailsSection;
