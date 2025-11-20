import { Card, Col, Form, Input, Row, Switch } from 'antd';


function NotificationSettings() {
  return (
    <Card title='Notification Settings' className='admin-card mb-6'>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Enable Notifications'
            name={['notificationSettings', 'enableNotifications']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Email Notifications'
            name={['notificationSettings', 'emailNotifications']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='SMS Notifications'
            name={['notificationSettings', 'smsNotifications']}
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Notification Email'
            name={['notificationSettings', 'notificationEmail']}
            rules={[
              { required: true, message: 'Please enter notification email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input placeholder='admin@clinic.com' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}

export { NotificationSettings };
export default NotificationSettings;
