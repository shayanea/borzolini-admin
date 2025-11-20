import { Card, Col, Form, Row, Select } from 'antd';
import { FC } from 'react';

interface ServicesSpecializationsStepProps {
  serviceOptions: string[];
  specializationOptions: string[];
}

const ServicesSpecializationsStep: FC<ServicesSpecializationsStepProps> = ({
  serviceOptions,
  specializationOptions,
}) => {
  return (
    <Card title='Services & Specializations' className='mb-6'>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name='services' label='Services Offered'>
            <Select
              mode='multiple'
              placeholder='Select services offered'
              options={serviceOptions.map(service => ({ label: service, value: service }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='specializations' label='Specializations'>
            <Select
              mode='multiple'
              placeholder='Select specializations'
              options={specializationOptions.map(spec => ({ label: spec, value: spec }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export { ServicesSpecializationsStep };
export default ServicesSpecializationsStep;
