import { Form, Select } from 'antd';
import { FC } from 'react';

import { BasicInfoSectionProps } from './types';

const { Option } = Select;

export const BasicInfoSection: FC<BasicInfoSectionProps> = ({
  form,
  appointmentTypes,
  pets,
  clinics,
  veterinarians,
  services,
  loadingData,
}) => {
  return (
    <div className='space-y-4'>
      <Form.Item
        label='Appointment Type'
        name='appointment_type'
        rules={[{ required: true, message: 'Please select appointment type' }]}
      >
        <Select placeholder='Select appointment type' showSearch>
          {appointmentTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label='Pet'
        name='pet_id'
        rules={[{ required: true, message: 'Please select a pet' }]}
      >
        <Select
          placeholder='Select pet'
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
        label='Clinic'
        name='clinic_id'
        rules={[{ required: true, message: 'Please select a clinic' }]}
      >
        <Select
          placeholder='Select clinic'
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

      <Form.Item label='Veterinarian' name='staff_id'>
        <Select placeholder='Select veterinarian (optional)' showSearch>
          {veterinarians.map(vet => (
            <Option key={vet.id} value={vet.id}>
              {vet.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label='Service' name='service_id'>
        <Select
          placeholder='Select service (optional)'
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
