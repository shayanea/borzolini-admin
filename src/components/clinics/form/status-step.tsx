import { Card, Col, Form, Row, Switch } from 'antd';
import { FC } from 'react';

const StatusStep: FC = () => {
  return (
    <Card title='Status' className='mb-6'>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name='is_active' label='Status' valuePropName='checked'>
            <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export { StatusStep };
export default StatusStep;
