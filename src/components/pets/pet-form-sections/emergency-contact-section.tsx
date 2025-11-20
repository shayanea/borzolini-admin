import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';

import { PhoneField } from '@/components/shared';
import { MAX_LENGTH_RULE, REQUIRED_RULE, VALIDATION_MESSAGES } from '@/constants/form-validation';
import { EmergencyContactSectionProps } from './types';

const EmergencyContactSection: FC<EmergencyContactSectionProps> = () => {
  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>Emergency Contact</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='emergency_contact'
            label='Emergency Contact Name'
            rules={[
              REQUIRED_RULE(VALIDATION_MESSAGES.EMERGENCY_CONTACT_REQUIRED),
              MAX_LENGTH_RULE(255, VALIDATION_MESSAGES.EMERGENCY_CONTACT_MAX_LENGTH),
            ]}
          >
            <Input placeholder='Emergency contact name' maxLength={255} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <PhoneField
            name='emergency_phone'
            label='Emergency Phone'
            placeholder='Emergency phone number'
            requiredMessage={VALIDATION_MESSAGES.EMERGENCY_PHONE_REQUIRED}
            rules={[MAX_LENGTH_RULE(20, VALIDATION_MESSAGES.EMERGENCY_PHONE_MAX_LENGTH)]}
          />
        </Col>
      </Row>
    </div>
  );
};

export { EmergencyContactSection };
export default EmergencyContactSection;
