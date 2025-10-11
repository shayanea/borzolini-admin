import { Col, Form, Row, Switch } from 'antd';
import { FC } from 'react';

import { StatusSectionProps } from './types';

const StatusSection: FC<StatusSectionProps> = ({ form }) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name='is_active' label='Status' valuePropName='checked'>
          <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default StatusSection;
