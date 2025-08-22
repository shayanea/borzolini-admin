import React from 'react';
import { Card, Typography, Button, Space, Form, Input, Switch, Select, Row, Col } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings updated:', values);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Settings
          </Title>
          <Text className="text-text-light">
            Configure clinic settings and preferences
          </Text>
        </div>
        
        <Space>
          <Button icon={<ReloadOutlined />}>
            Reset to Defaults
          </Button>
          <Button type="primary" icon={<SaveOutlined />} className="bg-primary-navy border-primary-navy">
            Save Changes
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          clinicName: 'Borzolini Veterinary Clinic',
          timezone: 'America/New_York',
          currency: 'USD',
          notifications: true,
          emailNotifications: true,
          smsNotifications: false,
        }}
      >
        {/* General Settings */}
        <Card title="General Settings" className="admin-card mb-6">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Clinic Name"
                name="clinicName"
                rules={[{ required: true, message: 'Please enter clinic name' }]}
              >
                <Input placeholder="Enter clinic name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Timezone"
                name="timezone"
                rules={[{ required: true, message: 'Please select timezone' }]}
              >
                <Select placeholder="Select timezone">
                  <Option value="America/New_York">Eastern Time (ET)</Option>
                  <Option value="America/Chicago">Central Time (CT)</Option>
                  <Option value="America/Denver">Mountain Time (MT)</Option>
                  <Option value="America/Los_Angeles">Pacific Time (PT)</Option>
                  <Option value="Europe/London">London (GMT)</Option>
                  <Option value="Europe/Paris">Paris (CET)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true, message: 'Please select currency' }]}
              >
                <Select placeholder="Select currency">
                  <Option value="USD">US Dollar ($)</Option>
                  <Option value="EUR">Euro (€)</Option>
                  <Option value="GBP">British Pound (£)</Option>
                  <Option value="CAD">Canadian Dollar (C$)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Business Hours"
                name="businessHours"
              >
                <Input placeholder="e.g., 8:00 AM - 6:00 PM" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Notification Settings */}
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

        {/* Appointment Settings */}
        <Card title="Appointment Settings" className="admin-card mb-6">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Default Appointment Duration (minutes)"
                name="defaultDuration"
              >
                <Select placeholder="Select duration">
                  <Option value={15}>15 minutes</Option>
                  <Option value={30}>30 minutes</Option>
                  <Option value={45}>45 minutes</Option>
                  <Option value={60}>1 hour</Option>
                  <Option value={90}>1.5 hours</Option>
                  <Option value={120}>2 hours</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Booking Lead Time (hours)"
                name="bookingLeadTime"
              >
                <Input type="number" placeholder="24" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Cancellation Policy (hours)"
                name="cancellationPolicy"
              >
                <Input type="number" placeholder="24" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Max Appointments per Day"
                name="maxAppointments"
              >
                <Input type="number" placeholder="50" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Security Settings */}
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

        {/* Save Button */}
        <div className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            className="bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark"
          >
            Save All Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Settings;
