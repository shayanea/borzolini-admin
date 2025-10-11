import { FormInstance } from 'antd';

export interface UserFormSectionProps {
  form: FormInstance;
}

export interface PersonalInfoSectionProps extends UserFormSectionProps {}

export interface AccountInfoSectionProps extends UserFormSectionProps {
  editingUser?: any;
}

export interface AddressSectionProps extends UserFormSectionProps {}

export interface ActionButtonsSectionProps {
  onCancel: () => void;
  loading?: boolean;
  editingUser?: any;
}
