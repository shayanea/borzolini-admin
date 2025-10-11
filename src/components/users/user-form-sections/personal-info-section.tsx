import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { REQUIRED_RULE, VALIDATION_MESSAGES } from '@/constants/form-validation';
import { PersonalInfoSectionProps } from './types';

const PersonalInfoSection: FC<PersonalInfoSectionProps> = ({ form }) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name='firstName'
          label='First Name'
          rules={[REQUIRED_RULE(VALIDATION_MESSAGES.FIRST_NAME_REQUIRED)]}
        >
          <Input placeholder='First Name' />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name='lastName'
          label='Last Name'
          rules={[REQUIRED_RULE(VALIDATION_MESSAGES.LAST_NAME_REQUIRED)]}
        >
          <Input placeholder='Last Name' />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default PersonalInfoSection;
