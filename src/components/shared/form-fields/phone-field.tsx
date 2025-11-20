import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form';
import { FC } from 'react';

import {
  PHONE_PATTERN_RULE,
  REQUIRED_RULE,
  VALIDATION_MESSAGES,
} from '@/constants/form-validation';

interface PhoneFieldProps {
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  requiredMessage?: string;
  disabled?: boolean;
  className?: string;
  rules?: Rule[];
}

const PhoneField: FC<PhoneFieldProps> = ({
  name = 'phone',
  label = 'Phone Number',
  placeholder = 'Enter phone number',
  required = true,
  requiredMessage = VALIDATION_MESSAGES.REQUIRED,
  disabled = false,
  className,
  rules = [],
}) => {
  const defaultRules = required
    ? [REQUIRED_RULE(requiredMessage), PHONE_PATTERN_RULE, ...rules]
    : [PHONE_PATTERN_RULE, ...rules];

  return (
    <Form.Item name={name} label={label} rules={defaultRules} className={className}>
      <Input type='tel' placeholder={placeholder} disabled={disabled} autoComplete='tel' />
    </Form.Item>
  );
};

export { PhoneField };
export default PhoneField;
