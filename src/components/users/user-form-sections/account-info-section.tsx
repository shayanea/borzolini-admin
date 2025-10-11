import { Col, Form, Input, Row, Select, Switch } from 'antd';
import { FC } from 'react';

import {
  EMAIL_RULE,
  MIN_LENGTH_RULE,
  REQUIRED_RULE,
  VALIDATION_MESSAGES,
} from '@/constants/form-validation';
import { USER_ROLES } from '@/constants/user-management';
import { AccountInfoSectionProps } from './types';

const { Option } = Select;

const AccountInfoSection: FC<AccountInfoSectionProps> = ({ form, editingUser }) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='email'
            label='Email'
            rules={[REQUIRED_RULE(VALIDATION_MESSAGES.EMAIL_REQUIRED), EMAIL_RULE]}
          >
            <Input placeholder='Email' disabled={!!editingUser} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='phone' label='Phone' rules={[{ required: false }]}>
            <Input placeholder='Phone' />
          </Form.Item>
        </Col>
      </Row>

      {!editingUser && (
        <Form.Item
          name='password'
          label='Password'
          rules={[
            REQUIRED_RULE(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
            MIN_LENGTH_RULE(8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
          ]}
        >
          <Input.Password placeholder='Password' />
        </Form.Item>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='role'
            label='Role'
            rules={[REQUIRED_RULE(VALIDATION_MESSAGES.ROLE_REQUIRED)]}
          >
            <Select placeholder='Select Role'>
              <Option value={USER_ROLES.ADMIN}>Admin</Option>
              <Option value={USER_ROLES.VETERINARIAN}>Veterinarian</Option>
              <Option value={USER_ROLES.STAFF}>Staff</Option>
              <Option value={USER_ROLES.PATIENT}>Patient</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='isActive' label='Account Status' valuePropName='checked'>
            <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name='isEmailVerified' label='Email Verification' valuePropName='checked'>
            <Switch checkedChildren='Verified' unCheckedChildren='Unverified' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default AccountInfoSection;
