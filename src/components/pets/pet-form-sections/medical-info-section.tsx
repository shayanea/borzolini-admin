import { Col, Form, Input, Row, Switch } from 'antd';
import { FC } from 'react';

import { MedicalInfoSectionProps } from './types';

const { TextArea } = Input;

const MedicalInfoSection: FC<MedicalInfoSectionProps> = () => {
  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>Medical Information</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='microchip_number'
            label='Microchip Number'
            rules={[{ max: 50, message: 'Microchip number must be less than 50 characters' }]}
          >
            <Input placeholder='Microchip number' maxLength={50} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='is_spayed_neutered' label='Spayed/Neutered' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='is_vaccinated' label='Vaccinated' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name='medical_history' label='Medical History'>
        <TextArea placeholder='Medical history and notes' rows={3} />
      </Form.Item>

      <Form.Item name='behavioral_notes' label='Behavioral Notes'>
        <TextArea placeholder='Behavioral notes and temperament' rows={3} />
      </Form.Item>
    </div>
  );
};

export default MedicalInfoSection;
