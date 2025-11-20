import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { EmailField, SocialMediaFields } from '@/components/shared';
import { URL_RULE } from '@/constants/form-validation';
import { ContactInfoSectionProps } from './types';

const ContactInfoSection: FC<ContactInfoSectionProps> = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <EmailField label='Email' placeholder='Enter email address' />
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

export { ContactInfoSection };
export default ContactInfoSection;
