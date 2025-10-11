import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { SocialMediaFields } from '@/components/shared';
import {
  EMAIL_RULE,
  REQUIRED_RULE,
  URL_RULE,
  VALIDATION_MESSAGES,
} from '@/constants/form-validation';
import { ContactInfoSectionProps } from './types';

const ContactInfoSection: FC<ContactInfoSectionProps> = ({ form }) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='email'
            label='Email'
            rules={[REQUIRED_RULE(VALIDATION_MESSAGES.EMAIL_REQUIRED), EMAIL_RULE]}
          >
            <Input placeholder='Enter email address' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name='website' label='Website' rules={[URL_RULE]}>
            <Input placeholder='Enter website URL (optional)' />
          </Form.Item>
        </Col>
      </Row>

      {/* Social Media Fields */}
      <SocialMediaFields />
    </>
  );
};

export default ContactInfoSection;
