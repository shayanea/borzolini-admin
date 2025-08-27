import type { AppointmentFormModalProps } from '@/types/calendar-modals';
import type { AppointmentPriority, AppointmentStatus, AppointmentType } from '@/types';
import type { CreateAppointmentData } from '@/services/appointments.service';
import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  TimePicker,
  message,
} from 'antd';
import { useCalendarFormData } from '@/hooks/use-calendar-form-data';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  veterinarians,
  currentDate = dayjs(),
}) => {
  const [form] = Form.useForm();
  const [isTelemedicine, setIsTelemedicine] = useState(false);
  const [isHomeVisit, setIsHomeVisit] = useState(false);

  // Use the new hook for form data
  const { pets, clinics, services, loading: loadingData, error } = useCalendarFormData();

  // Show error message if data loading fails
  useEffect(() => {
    if (error) {
      message.error('Failed to load form data. Please try again.');
    }
  }, [error]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Combine date and time into a single ISO string
      const selectedDate = values.scheduled_date;
      const selectedTime = values.scheduled_time;

      if (!selectedDate || !selectedTime) {
        message.error('Please select both date and time');
        return;
      }

      // Combine date and time
      const combinedDateTime = selectedDate
        .hour(selectedTime.hour())
        .minute(selectedTime.minute())
        .second(0)
        .millisecond(0);

      const appointmentData: CreateAppointmentData = {
        appointment_type: values.appointment_type,
        status: values.status || 'pending',
        priority: values.priority || 'normal',
        scheduled_date: combinedDateTime.toISOString(),
        duration_minutes: values.duration_minutes || 30,
        notes: values.notes,
        reason: values.reason,
        symptoms: values.symptoms,
        is_telemedicine: isTelemedicine,
        telemedicine_link: isTelemedicine ? values.telemedicine_link : undefined,
        home_visit_address: isHomeVisit ? values.home_visit_address : undefined,
        is_home_visit: isHomeVisit,
        pet_id: values.pet_id,
        clinic_id: values.clinic_id,
        staff_id: values.staff_id,
        service_id: values.service_id,
      };

      await onSubmit(appointmentData);
      form.resetFields();
      message.success('Appointment created successfully!');
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsTelemedicine(false);
    setIsHomeVisit(false);
    onCancel();
  };

  const appointmentTypes: { value: AppointmentType; label: string }[] = [
    { value: 'consultation', label: 'General Consultation' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'wellness_exam', label: 'Wellness Exam' },
    { value: 'dental_cleaning', label: 'Dental Cleaning' },
    { value: 'laboratory_test', label: 'Laboratory Test' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'therapy', label: 'Therapy' },
  ];

  const priorities: { value: AppointmentPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'emergency', label: 'Emergency' },
  ];

  const statuses: { value: AppointmentStatus; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
    { value: 'rescheduled', label: 'Rescheduled' },
    { value: 'waiting', label: 'Waiting' },
  ];

  return (
    <Modal
      title='Create New Appointment'
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout='vertical'
        className='mt-4'
        initialValues={{
          scheduled_date: currentDate,
          scheduled_time: dayjs().hour(9).minute(0),
          duration_minutes: 30,
          priority: 'normal',
          status: 'pending',
        }}
      >
        <div className='grid grid-cols-2 gap-4'>
          {/* Left Column */}
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
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
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
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
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
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
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

          {/* Right Column */}
          <div className='space-y-4'>
            <Form.Item
              label='Date'
              name='scheduled_date'
              rules={[{ required: true, message: 'Please select date' }]}
            >
              <DatePicker
                className='w-full'
                format='YYYY-MM-DD'
                disabledDate={current => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              label='Time'
              name='scheduled_time'
              rules={[{ required: true, message: 'Please select time' }]}
            >
              <TimePicker className='w-full' format='HH:mm' minuteStep={15} showNow={false} />
            </Form.Item>

            <Form.Item label='Duration (minutes)' name='duration_minutes'>
              <InputNumber className='w-full' min={15} max={480} step={15} placeholder='30' />
            </Form.Item>

            <Form.Item label='Priority' name='priority'>
              <Select placeholder='Select priority'>
                {priorities.map(priority => (
                  <Option key={priority.value} value={priority.value}>
                    {priority.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label='Status' name='status'>
              <Select placeholder='Select status'>
                {statuses.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Visit Type Options */}
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Form.Item label='Telemedicine' className='mb-0'>
              <Switch
                checked={isTelemedicine}
                onChange={setIsTelemedicine}
                checkedChildren='Yes'
                unCheckedChildren='No'
              />
            </Form.Item>

            <Form.Item label='Home Visit' className='mb-0'>
              <Switch
                checked={isHomeVisit}
                onChange={setIsHomeVisit}
                checkedChildren='Yes'
                unCheckedChildren='No'
              />
            </Form.Item>
          </div>

          {isTelemedicine && (
            <Form.Item
              label='Telemedicine Link'
              name='telemedicine_link'
              rules={[{ required: true, message: 'Please provide telemedicine link' }]}
            >
              <Input placeholder='https://meet.google.com/...' />
            </Form.Item>
          )}

          {isHomeVisit && (
            <Form.Item
              label='Home Visit Address'
              name='home_visit_address'
              rules={[{ required: true, message: 'Please provide home visit address' }]}
            >
              <TextArea rows={2} placeholder='Enter full address for home visit' />
            </Form.Item>
          )}
        </div>

        {/* Additional Information */}
        <div className='space-y-4'>
          <Form.Item
            label='Reason for Visit'
            name='reason'
            rules={[{ required: true, message: 'Please provide reason for visit' }]}
          >
            <TextArea rows={2} placeholder='Brief description of why the pet needs to be seen' />
          </Form.Item>

          <Form.Item label='Symptoms' name='symptoms'>
            <TextArea rows={2} placeholder='Describe any symptoms the pet is experiencing' />
          </Form.Item>

          <Form.Item label='Additional Notes' name='notes'>
            <TextArea rows={2} placeholder='Any additional information or special instructions' />
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-2 mt-6'>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type='primary'
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
            className='bg-primary-navy border-primary-navy'
          >
            Create Appointment
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AppointmentFormModal;
