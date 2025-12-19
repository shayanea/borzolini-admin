import { Col, Form, Input, Row, Select, Switch } from 'antd';
import { EmailField, PhoneField } from '@/components/shared';
import { MIN_LENGTH_RULE, REQUIRED_RULE, VALIDATION_MESSAGES } from '@/constants/form-validation';

import { AccountInfoSectionProps } from './types';
import { FC } from 'react';
import { USER_ROLES } from '@/constants/user-management';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const AccountInfoSection: FC<AccountInfoSectionProps> = ({ editingUser }) => {
  const { t } = useTranslation('components');

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <EmailField disabled={!!editingUser} placeholder={t('forms.userForm.emailPlaceholder')} />
        </Col>
        <Col span={12}>
          <PhoneField required={false} placeholder={t('forms.userForm.phonePlaceholder')} />
        </Col>
      </Row>

      {!editingUser && (
        <Form.Item
          name='password'
          label={t('forms.userForm.password')}
          rules={[
            REQUIRED_RULE(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
            MIN_LENGTH_RULE(8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
          ]}
        >
          <Input.Password placeholder={t('forms.userForm.passwordPlaceholder')} />
        </Form.Item>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='role'
            label={t('forms.userForm.role')}
            rules={[REQUIRED_RULE(VALIDATION_MESSAGES.ROLE_REQUIRED)]}
          >
            <Select placeholder={t('forms.userForm.selectRolePlaceholder')}>
              <Option value={USER_ROLES.ADMIN}>{t('forms.userForm.admin')}</Option>
              <Option value={USER_ROLES.VETERINARIAN}>{t('forms.userForm.veterinarian')}</Option>
              <Option value={USER_ROLES.STAFF}>{t('forms.userForm.staff')}</Option>
              <Option value={USER_ROLES.PATIENT}>{t('forms.userForm.patient')}</Option>
              <Option value={USER_ROLES.CLINIC_ADMIN}>{t('forms.userForm.clinic_admin')}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='isActive'
            label={t('forms.userForm.accountStatus')}
            valuePropName='checked'
          >
            <Switch
              checkedChildren={t('forms.userForm.active')}
              unCheckedChildren={t('forms.userForm.inactive')}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='isEmailVerified'
            label={t('forms.userForm.emailVerification')}
            valuePropName='checked'
          >
            <Switch
              checkedChildren={t('forms.userForm.verified')}
              unCheckedChildren={t('forms.userForm.unverified')}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export { AccountInfoSection };
export default AccountInfoSection;
