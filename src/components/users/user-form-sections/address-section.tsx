import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { AddressSectionProps } from './types';

const { TextArea } = Input;

const AddressSection: FC<AddressSectionProps> = ({ form }) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name='city' label='City' rules={[{ required: false }]}>
            <Input placeholder='City' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='country' label='Country' rules={[{ required: false }]}>
            <Input placeholder='Country' />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name='address' label='Address' rules={[{ required: false }]}>
        <TextArea placeholder='Address' rows={2} />
      </Form.Item>
    </>
  );
};

export default AddressSection;
