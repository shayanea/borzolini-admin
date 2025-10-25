import { Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';

import { CareInfoSectionProps } from './types';

const { TextArea } = Input;

const CareInfoSection: FC<CareInfoSectionProps> = ({ allergyOptions, medicationOptions }) => {
  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>Care Information</h3>
      <Form.Item name='dietary_requirements' label='Dietary Requirements'>
        <TextArea placeholder='Dietary requirements and preferences' rows={2} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name='allergies' label='Allergies'>
            <Select
              mode='tags'
              placeholder='Enter allergies'
              options={allergyOptions.map(v => ({ value: v, label: v }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='medications' label='Medications'>
            <Select
              mode='tags'
              placeholder='Enter medications'
              options={medicationOptions.map(v => ({ value: v, label: v }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default CareInfoSection;
