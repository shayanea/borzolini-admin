import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { PhoneField } from '@/components/shared';
import {
  MAX_LENGTH_RULE,
  MIN_LENGTH_RULE,
  REQUIRED_RULE,
  VALIDATION_MESSAGES,
} from '@/constants/form-validation';
import { BasicInfoSectionProps } from './types';

const { TextArea } = Input;

const BasicInfoSection: FC<BasicInfoSectionProps> = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='name'
            label='Clinic Name'
            rules={[
              REQUIRED_RULE(VALIDATION_MESSAGES.CLINIC_NAME_REQUIRED),
              MIN_LENGTH_RULE(2, VALIDATION_MESSAGES.CLINIC_NAME_MIN_LENGTH),
            ]}
          >
            <Input placeholder='Enter clinic name' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <PhoneField label='Phone Number' placeholder='Enter phone number' />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='description'
            label='Description'
            rules={[MAX_LENGTH_RULE(500, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH)]}
          >
            <TextArea
              rows={3}
              placeholder='Enter clinic description (optional)'
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
