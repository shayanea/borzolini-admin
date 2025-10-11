import { FormInstance } from 'antd';
import { Dayjs } from 'dayjs';

export interface AppointmentFormSectionProps {
  form: FormInstance;
  loading?: boolean;
}

export interface BasicInfoSectionProps extends AppointmentFormSectionProps {
  appointmentTypes: { value: string; label: string }[];
  pets: { id: string; name: string; type: string; ownerName: string }[];
  clinics: { id: string; name: string }[];
  veterinarians: { id: string; name: string }[];
  services: { id: string; name: string; price: number; duration: number }[];
  loadingData?: boolean;
}

export interface SchedulingSectionProps extends AppointmentFormSectionProps {
  priorities: { value: string; label: string }[];
  statuses: { value: string; label: string }[];
  currentDate?: Dayjs;
}

export interface VisitTypeSectionProps extends AppointmentFormSectionProps {
  isTelemedicine: boolean;
  setIsTelemedicine: (value: boolean) => void;
  isHomeVisit: boolean;
  setIsHomeVisit: (value: boolean) => void;
}

export interface AdditionalInfoSectionProps extends AppointmentFormSectionProps {}

export interface ActionButtonsSectionProps {
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
}
