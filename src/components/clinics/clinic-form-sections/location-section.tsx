import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import {
  MIN_LENGTH_RULE,
  POSTAL_CODE_RULE,
  REQUIRED_RULE,
  VALIDATION_MESSAGES,
} from '@/constants/form-validation';
import { LocationSectionProps } from './types';

const LocationSection: FC<LocationSectionProps> = ({ form }) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='address'
            label='Address'
            rules={[
              REQUIRED_RULE(VALIDATION_MESSAGES.ADDRESS_REQUIRED),
              MIN_LENGTH_RULE(5, VALIDATION_MESSAGES.ADDRESS_MIN_LENGTH),
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
              REQUIRED_RULE(VALIDATION_MESSAGES.CITY_REQUIRED),
              MIN_LENGTH_RULE(2, VALIDATION_MESSAGES.CITY_MIN_LENGTH),
            ]}
          >
            <Input placeholder='Enter city' />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name='country'
            label='Country'
            rules={[REQUIRED_RULE(VALIDATION_MESSAGES.COUNTRY_REQUIRED)]}
          >
            <Input placeholder='Enter country' />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name='postal_code' label='Postal Code' rules={[POSTAL_CODE_RULE]}>
            <Input placeholder='Enter postal code' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default LocationSection;
