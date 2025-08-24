import React from 'react';
import { Card, Form, Input, Switch, Row, Col } from 'antd';

const NotificationSettings: React.FC = () => {
  return (
    <Card title="Notification Settings" className="admin-card mb-6">
      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Enable Notifications"
            name="notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Email Notifications"
            name="emailNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="SMS Notifications"
            name="smsNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Notification Email"
        name="notificationEmail"
        rules={[{ type: 'email', message: 'Please enter a valid email' }]}
      >
        <Input placeholder="admin@clinic.com" />
      </Form.Item>
    </Card>
  );
};

export default NotificationSettings;
