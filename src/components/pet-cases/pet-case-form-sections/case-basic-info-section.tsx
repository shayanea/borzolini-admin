import { Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';

import { CaseBasicInfoSectionProps } from './types';

const { Option } = Select;

export const CaseBasicInfoSection: FC<CaseBasicInfoSectionProps> = ({
  form,
  caseTypeLabels,
  casePriorityLabels,
}) => {
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Case Title'
            name='title'
            rules={[{ required: true, message: 'Please enter a case title' }]}
          >
            <Input placeholder='Brief description of the case' />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label='Case Type'
            name='case_type'
            rules={[{ required: true, message: 'Please select a case type' }]}
          >
            <Select placeholder='Select case type'>
              {Object.entries(caseTypeLabels).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label='Priority' name='priority'>
        <Select placeholder='Select priority level'>
          {Object.entries(casePriorityLabels).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default CaseBasicInfoSection;
