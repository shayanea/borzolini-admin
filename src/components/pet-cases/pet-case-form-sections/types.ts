import { FormInstance } from 'antd';

export interface PetCaseFormSectionProps {
  form: FormInstance;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export interface CaseBasicInfoSectionProps extends PetCaseFormSectionProps {
  caseTypeLabels: Record<string, string>;
  casePriorityLabels: Record<string, string>;
}

export interface CaseDetailsSectionProps extends PetCaseFormSectionProps {}

export interface CaseActionButtonsSectionProps {
  onClose: () => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  isEdit?: boolean;
}
