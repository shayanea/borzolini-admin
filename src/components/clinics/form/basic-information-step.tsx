import { Card, Col, Form, Input, Row } from 'antd';
import { MIN_LENGTH_RULE, REQUIRED_RULE } from '@/constants/form-validation';

import { FC } from 'react';
import { PhoneField } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useValidationMessages } from '@/hooks/use-validation-messages';

const { TextArea } = Input;

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

export default BasicInformationStep;
