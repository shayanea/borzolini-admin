import { Col, Form, Input, Row } from 'antd';
import { MAX_LENGTH_RULE, MIN_LENGTH_RULE, REQUIRED_RULE } from '@/constants/form-validation';

import { BasicInfoSectionProps } from './types';
import { FC } from 'react';
import { PhoneField } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useValidationMessages } from '@/hooks/use-validation-messages';

const { TextArea } = Input;

const BasicInfoSection: FC<BasicInfoSectionProps> = () => {
  const { t } = useTranslation('components');
  const validationMessages = useValidationMessages();

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
          <PhoneField
            label={t('forms.clinicForm.phoneNumber')}
            placeholder={t('forms.clinicForm.phonePlaceholder')}
          />
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

export default BasicInfoSection;
