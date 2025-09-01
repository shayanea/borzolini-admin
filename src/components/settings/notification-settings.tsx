import { Card, Col, Divider, Form, Row, Switch, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const NotificationSettings: React.FC = () => {
  return (
    <Card title='Notification Settings' className='admin-card mb-6'>
      {/* Email Notifications */}
      <Title level={5}>Email Notifications</Title>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Appointments'
            name={['notificationSettings', 'email', 'appointments']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='Reminders'
            name={['notificationSettings', 'email', 'reminders']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Health Alerts'
            name={['notificationSettings', 'email', 'healthAlerts']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='Marketing'
            name={['notificationSettings', 'email', 'marketing']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Newsletter'
            name={['notificationSettings', 'email', 'newsletter']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      {/* SMS Notifications */}
      <Title level={5}>SMS Notifications</Title>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Appointments'
            name={['notificationSettings', 'sms', 'appointments']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='Reminders'
            name={['notificationSettings', 'sms', 'reminders']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Health Alerts'
            name={['notificationSettings', 'sms', 'healthAlerts']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      {/* Push Notifications */}
      <Title level={5}>Push Notifications</Title>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Appointments'
            name={['notificationSettings', 'push', 'appointments']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='Reminders'
            name={['notificationSettings', 'push', 'reminders']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Health Alerts'
            name={['notificationSettings', 'push', 'healthAlerts']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default NotificationSettings;
