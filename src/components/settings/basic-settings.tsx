import { Card, Col, Form, Input, Row, Switch } from 'antd';

const BasicSettings = () => {
  return (
    <Card title='Basic Settings' className='admin-card mb-6'>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Settings Name'
            name='name'
            rules={[{ required: true, message: 'Please enter settings name' }]}
          >
            <Input placeholder='Enter settings name' />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label='Is Default' name='isDefault' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label='Description'
        name='description'
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <Input.TextArea placeholder='Enter settings description' rows={3} />
      </Form.Item>

      <Form.Item label='Is Active' name='isActive' valuePropName='checked'>
        <Switch />
      </Form.Item>
    </Card>
  );
};

export { BasicSettings };
export default BasicSettings;
