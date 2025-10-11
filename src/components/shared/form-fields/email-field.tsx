import { Form, Input } from 'antd';
import { Rule } from 'antd/es/form';
import { FC } from 'react';

import { EMAIL_RULE, REQUIRED_RULE, VALIDATION_MESSAGES } from '@/constants/form-validation';

interface EmailFieldProps {
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  requiredMessage?: string;
  disabled?: boolean;
  className?: string;
  rules?: Rule[];
}

const EmailField: FC<EmailFieldProps> = ({
  name = 'email',
  label = 'Email',
  placeholder = 'Enter email address',
  required = true,
  requiredMessage = VALIDATION_MESSAGES.EMAIL_REQUIRED,
  disabled = false,
  className,
  rules = [],
}) => {
  const defaultRules = required
    ? [REQUIRED_RULE(requiredMessage), EMAIL_RULE, ...rules]
    : [EMAIL_RULE, ...rules];

  return (
    <Form.Item name={name} label={label} rules={defaultRules} className={className}>
      <Input type='email' placeholder={placeholder} disabled={disabled} autoComplete='email' />
    </Form.Item>
  );
};

export default EmailField;
