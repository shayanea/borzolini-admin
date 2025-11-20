import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { EmailField, PhoneField } from '@/components/shared';
import { URL_RULE } from '@/constants/form-validation';

const ContactInformationStep: FC = () => {
  return (
    <Card title='Contact Information' className='mb-6'>
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

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name='emergency_contact' label='Emergency Contact Person'>
            <Input placeholder='Enter emergency contact name' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <PhoneField
            name='emergency_phone'
            label='Emergency Phone'
            placeholder='Enter emergency phone number'
            required={false}
          />
        </Col>
      </Row>
    </Card>
  );
};

export { ContactInformationStep };
export default ContactInformationStep;
