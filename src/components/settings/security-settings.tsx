import { Card, Col, Form, Input, Row, Switch } from 'antd';
import React from 'react';

const SecuritySettings: React.FC = () => {
  return (
    <Card title='Security Settings' className='admin-card mb-6'>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Session Timeout (minutes)'
            name={['securitySettings', 'sessionTimeout']}
          >
            <Input type='number' placeholder='30' />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label='Password Expiry (days)' name={['securitySettings', 'passwordExpiry']}>
            <Input type='number' placeholder='90' />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label='Two-Factor Authentication'
        name={['securitySettings', 'twoFactorAuthentication']}
        valuePropName='checked'
      >
        <Switch />
      </Form.Item>
    </Card>
  );
};

export default SecuritySettings;
