import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { EmergencyContactSectionProps } from './types';

const EmergencyContactSection: FC<EmergencyContactSectionProps> = ({ form }) => {
  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>Emergency Contact</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='emergency_contact'
            label='Emergency Contact Name'
            rules={[
              { required: true, message: 'Please enter emergency contact name' },
              { max: 255, message: 'Emergency contact name must be less than 255 characters' },
            ]}
          >
            <Input placeholder='Emergency contact name' maxLength={255} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='emergency_phone'
            label='Emergency Phone'
            rules={[
              { required: true, message: 'Please enter emergency phone' },
              { max: 20, message: 'Emergency phone must be less than 20 characters' },
            ]}
          >
            <Input placeholder='Emergency phone number' maxLength={20} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default EmergencyContactSection;
