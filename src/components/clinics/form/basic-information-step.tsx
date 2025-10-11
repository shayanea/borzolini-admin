import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { PhoneField } from '@/components/shared';
import { MIN_LENGTH_RULE, REQUIRED_RULE, VALIDATION_MESSAGES } from '@/constants/form-validation';

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
              REQUIRED_RULE(VALIDATION_MESSAGES.CLINIC_NAME_REQUIRED),
              MIN_LENGTH_RULE(2, VALIDATION_MESSAGES.CLINIC_NAME_MIN_LENGTH),
            ]}
          >
            <Input placeholder='Enter clinic name' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <PhoneField label='Phone Number' placeholder='Enter phone number' />
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
