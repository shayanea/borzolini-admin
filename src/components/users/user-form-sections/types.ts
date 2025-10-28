export interface PersonalInfoSectionProps {}

export interface AccountInfoSectionProps {
  editingUser?: any;
}

export interface AddressSectionProps {}

export interface ActionButtonsSectionProps {
  onCancel: () => void;
  loading?: boolean;
  editingUser?: any;
}
