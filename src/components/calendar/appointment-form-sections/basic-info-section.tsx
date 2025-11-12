import { Form, Select } from 'antd';

import { BasicInfoSectionProps } from './types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export const BasicInfoSection: FC<BasicInfoSectionProps> = ({
  appointmentTypes,
  pets,
  clinics,
  veterinarians,
  services,
  loadingData,
}) => {
  const { t } = useTranslation('components');

  return (
    <div className='space-y-4'>
      <Form.Item
        label={t('forms.appointmentForm.appointmentType')}
        name='appointment_type'
        rules={[{ required: true, message: t('forms.appointmentForm.appointmentTypeRequired') }]}
      >
        <Select
          placeholder={t('forms.appointmentForm.selectAppointmentTypePlaceholder')}
          showSearch
        >
          {appointmentTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t('forms.appointmentForm.pet')}
        name='pet_id'
        rules={[{ required: true, message: t('forms.appointmentForm.petRequired') }]}
      >
        <Select
          placeholder={t('forms.appointmentForm.selectPetPlaceholder')}
          showSearch
          loading={loadingData}
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {pets.map(pet => (
            <Option key={pet.id} value={pet.id}>
              {pet.name} ({pet.type}) - {pet.ownerName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t('forms.appointmentForm.clinic')}
        name='clinic_id'
        rules={[{ required: true, message: t('forms.appointmentForm.clinicRequired') }]}
      >
        <Select
          placeholder={t('forms.appointmentForm.selectClinicPlaceholder')}
          showSearch
          loading={loadingData}
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {clinics.map(clinic => (
            <Option key={clinic.id} value={clinic.id}>
              {clinic.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t('forms.appointmentForm.veterinarian')} name='staff_id'>
        <Select placeholder={t('forms.appointmentForm.selectVeterinarianPlaceholder')} showSearch>
          {veterinarians.map(vet => (
            <Option key={vet.id} value={vet.id}>
              {vet.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={t('forms.appointmentForm.service')} name='service_id'>
        <Select
          placeholder={t('forms.appointmentForm.selectServicePlaceholder')}
          showSearch
          loading={loadingData}
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {services.map(service => (
            <Option key={service.id} value={service.id}>
              {service.name} - ${service.price} ({service.duration}min)
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default BasicInfoSection;
