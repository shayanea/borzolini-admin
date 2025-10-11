import { FormInstance } from 'antd';

export interface ClinicFormSectionProps {
  form: FormInstance;
}

export interface BasicInfoSectionProps extends ClinicFormSectionProps {}

export interface LocationSectionProps extends ClinicFormSectionProps {}

export interface ContactInfoSectionProps extends ClinicFormSectionProps {}

export interface StatusSectionProps extends ClinicFormSectionProps {}
