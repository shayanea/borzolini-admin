import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

const LocationInformationStep: FC = () => {
  return (
    <Card title='Location Information' className='mb-6'>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='address'
            label='Address'
            rules={[
              { required: true, message: 'Please enter address' },
              { min: 5, message: 'Address must be at least 5 characters' },
            ]}
          >
            <Input placeholder='Enter full address' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name='city'
            label='City'
            rules={[
              { required: true, message: 'Please enter city' },
              { min: 2, message: 'City must be at least 2 characters' },
            ]}
          >
            <Input placeholder='Enter city' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='state' label='State/Province'>
            <Input placeholder='Enter state or province' />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name='country'
            label='Country'
            rules={[{ required: true, message: 'Please enter country' }]}
          >
            <Input placeholder='Enter country' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='postal_code'
            label='Postal Code'
            rules={[
              {
                pattern: /^[0-9A-Za-z\s-]{3,10}$/,
                message: 'Please enter a valid postal code',
              },
            ]}
          >
            <Input placeholder='Enter postal code' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default LocationInformationStep;
