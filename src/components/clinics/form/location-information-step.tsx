import { Card, Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { AddressFields } from '@/components/shared';

const LocationInformationStep: FC = () => {
  return (
    <Card title='Location Information' className='mb-6'>
      <AddressFields required={true} showPostalCode={true} useTextArea={false} />

      {/* Additional State/Province field - not part of AddressFields */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name='state' label='State/Province'>
            <Input placeholder='Enter state or province' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export { LocationInformationStep };
export default LocationInformationStep;
