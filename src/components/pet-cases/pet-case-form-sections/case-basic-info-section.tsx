import { Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { CaseBasicInfoSectionProps } from './types';

const { Option } = Select;

export const CaseBasicInfoSection: FC<CaseBasicInfoSectionProps> = ({
  caseTypeLabels,
  casePriorityLabels,
}) => {
  const { t } = useTranslation('components');

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={t('forms.petCaseForm.title')}
            name='title'
            rules={[{ required: true, message: t('forms.petCaseForm.caseTitleRequired') }]}
          >
            <Input placeholder={t('forms.petCaseForm.caseTitlePlaceholder')} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label={t('forms.petCaseForm.caseType')}
            name='case_type'
            rules={[{ required: true, message: t('forms.petCaseForm.caseTypeRequired') }]}
          >
            <Select placeholder={t('forms.petCaseForm.selectCaseTypePlaceholder')}>
              {Object.entries(caseTypeLabels).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label={t('forms.petCaseForm.priority')} name='priority'>
        <Select placeholder={t('forms.petCaseForm.selectPriorityPlaceholder')}>
          {Object.entries(casePriorityLabels).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default CaseBasicInfoSection;
