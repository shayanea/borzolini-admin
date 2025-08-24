import React from 'react';
import { Card, Form, Input, Switch, Row, Col } from 'antd';

const SecuritySettings: React.FC = () => {
  return (
    <Card title="Security Settings" className="admin-card mb-6">
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Session Timeout (minutes)"
            name="sessionTimeout"
          >
            <Input type="number" placeholder="30" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Password Expiry (days)"
            name="passwordExpiry"
          >
            <Input type="number" placeholder="90" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Two-Factor Authentication"
        name="twoFactorAuth"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Card>
  );
};

export default SecuritySettings;
