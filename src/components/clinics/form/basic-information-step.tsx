import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

const { TextArea } = Input;

const BasicInformationStep: FC = () => {
  return (
    <Card title='Basic Information' className='mb-6'>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='name'
            label='Clinic Name'
            rules={[
              { required: true, message: 'Please enter clinic name' },
              { min: 2, message: 'Clinic name must be at least 2 characters' },
            ]}
          >
            <Input placeholder='Enter clinic name' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='phone'
            label='Phone Number'
            rules={[
              { required: true, message: 'Please enter phone number' },
              {
                pattern: /^[+]?[\d\s\-().]{7,20}$/,
                message: 'Please enter a valid phone number',
              },
            ]}
          >
            <Input placeholder='Enter phone number' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ max: 500, message: 'Description must not exceed 500 characters' }]}
          >
            <TextArea
              rows={3}
              placeholder='Enter clinic description (optional)'
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default BasicInformationStep;
