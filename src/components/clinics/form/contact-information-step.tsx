import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

const ContactInformationStep: FC = () => {
  return (
    <Card title='Contact Information' className='mb-6'>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder='Enter email address' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='website'
            label='Website'
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
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
          <Form.Item
            name='emergency_phone'
            label='Emergency Phone'
            rules={[
              {
                pattern: /^[+]?[\d\s\-().]{7,20}$/,
                message: 'Please enter a valid phone number',
              },
            ]}
          >
            <Input placeholder='Enter emergency phone number' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default ContactInformationStep;
