import type { AppointmentPriority, AppointmentStatus, AppointmentType } from '@/types';
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  TimePicker,
  message,
} from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import type { AppointmentDetailsModalProps } from '@/types/calendar-modals';
import type { UpdateAppointmentData } from '@/services/appointments.service';
import dayjs from 'dayjs';
import { useCalendarFormData } from '@/hooks/use-calendar-form-data';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const AppointmentDetailsModal = ({
  visible,
  onCancel,
  onUpdate,
  onDelete,
  veterinarians,
  appointment,
}: AppointmentDetailsModalProps) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  // Update form when appointment changes
  useEffect(() => {
    if (appointment && form) {
      const scheduledDate = dayjs(appointment.scheduled_date);
      const scheduledTime = dayjs(appointment.scheduled_date);

      form.setFieldsValue({
        appointment_type: appointment.appointment_type,
        status: appointment.status,
        priority: appointment.priority,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        duration_minutes: appointment.duration_minutes,
        notes: appointment.notes,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        pet_id: appointment.pet_id,
        clinic_id: appointment.clinic_id,
        staff_id: appointment.staff_id,
        service_id: appointment.service_id,
        telemedicine_link: appointment.telemedicine_link,
        home_visit_address: appointment.home_visit_address,
      });

      setIsTelemedicine(appointment.is_telemedicine || false);
      setIsHomeVisit(appointment.is_home_visit || false);
    }
  }, [appointment, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
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

      const updateData: UpdateAppointmentData = {
        appointment_type: values.appointment_type,
        status: values.status,
        priority: values.priority,
        scheduled_date: combinedDateTime.toISOString(),
        duration_minutes: values.duration_minutes,
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

      await onUpdate(appointment.id, updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(appointment.id);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      confirmed: 'blue',
      in_progress: 'processing',
      completed: 'success',
      cancelled: 'error',
      no_show: 'default',
      rescheduled: 'warning',
      waiting: 'processing',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'green',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
      emergency: 'red',
    };
    return colors[priority] || 'default';
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

  if (!appointment) return null;

  return (
    <Modal
      title={
        <div className='flex items-center justify-between'>
          <span>Appointment Details</span>
          <Space>
            {!isEditing && (
              <Button
                icon={<EditOutlined />}
                onClick={handleEdit}
                type='primary'
                className='bg-primary-navy border-primary-navy'
              >
                Edit
              </Button>
            )}
            <Button icon={<DeleteOutlined />} onClick={handleDelete} danger loading={deleting}>
              Delete
            </Button>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      destroyOnHidden
    >
      <Tabs defaultActiveKey='details'>
        <TabPane tab='Details' key='details'>
          {isEditing ? (
            <Form form={form} layout='vertical' className='mt-4'>
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

                  <Form.Item label='Clinic' name='clinic_id'>
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
                  <TextArea
                    rows={2}
                    placeholder='Brief description of why the pet needs to be seen'
                  />
                </Form.Item>

                <Form.Item label='Symptoms' name='symptoms'>
                  <TextArea rows={2} placeholder='Describe any symptoms the pet is experiencing' />
                </Form.Item>

                <Form.Item label='Additional Notes' name='notes'>
                  <TextArea
                    rows={2}
                    placeholder='Any additional information or special instructions'
                  />
                </Form.Item>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end space-x-2 mt-6'>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                  type='primary'
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={false} // Removed updating state
                  className='bg-primary-navy border-primary-navy'
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          ) : (
            <div className='mt-4'>
              <Descriptions bordered column={2}>
                <Descriptions.Item label='Appointment Type' span={2}>
                  <Tag color='blue'>
                    {appointment.appointment_type?.replace('_', ' ').toUpperCase()}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label='Status'>
                  <Tag color={getStatusColor(appointment.status)}>
                    {appointment.status?.replace('_', ' ').toUpperCase()}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label='Priority'>
                  <Tag color={getPriorityColor(appointment.priority)}>
                    {appointment.priority?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label='Scheduled Date' span={2}>
                  {dayjs(appointment.scheduled_date).format('MMMM DD, YYYY [at] h:mm A')}
                </Descriptions.Item>

                <Descriptions.Item label='Duration'>
                  {appointment.duration_minutes} minutes
                </Descriptions.Item>

                <Descriptions.Item label='Cost'>
                  {appointment.cost ? `$${appointment.cost}` : 'Not set'}
                </Descriptions.Item>

                <Descriptions.Item label='Reason' span={2}>
                  {appointment.reason || 'Not specified'}
                </Descriptions.Item>

                <Descriptions.Item label='Notes' span={2}>
                  {appointment.notes || 'No additional notes'}
                </Descriptions.Item>

                <Descriptions.Item label='Symptoms' span={2}>
                  {appointment.symptoms || 'No symptoms recorded'}
                </Descriptions.Item>

                <Descriptions.Item label='Diagnosis' span={2}>
                  {appointment.diagnosis || 'No diagnosis yet'}
                </Descriptions.Item>

                <Descriptions.Item label='Treatment Plan' span={2}>
                  {appointment.treatment_plan || 'No treatment plan yet'}
                </Descriptions.Item>

                <Descriptions.Item label='Follow-up Instructions' span={2}>
                  {appointment.follow_up_instructions || 'No follow-up instructions'}
                </Descriptions.Item>

                <Descriptions.Item label='Visit Type' span={2}>
                  <Space>
                    {appointment.is_telemedicine && <Tag color='green'>Telemedicine</Tag>}
                    {appointment.is_home_visit && <Tag color='orange'>Home Visit</Tag>}
                    {!appointment.is_telemedicine && !appointment.is_home_visit && (
                      <Tag color='blue'>In-Clinic</Tag>
                    )}
                  </Space>
                </Descriptions.Item>

                {appointment.is_telemedicine && (
                  <Descriptions.Item label='Telemedicine Link' span={2}>
                    <a
                      href={appointment.telemedicine_link}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {appointment.telemedicine_link}
                    </a>
                  </Descriptions.Item>
                )}

                {appointment.is_home_visit && (
                  <Descriptions.Item label='Home Visit Address' span={2}>
                    {appointment.home_visit_address}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          )}
        </TabPane>

        <TabPane tab='Medical Records' key='medical'>
          <div className='mt-4'>
            <Descriptions bordered column={1}>
              <Descriptions.Item label='Diagnosis'>
                {appointment.diagnosis || 'No diagnosis recorded yet'}
              </Descriptions.Item>

              <Descriptions.Item label='Treatment Plan'>
                {appointment.treatment_plan || 'No treatment plan recorded yet'}
              </Descriptions.Item>

              <Descriptions.Item label='Prescriptions'>
                {appointment.prescriptions && appointment.prescriptions.length > 0 ? (
                  <ul className='list-disc list-inside'>
                    {appointment.prescriptions.map((prescription: string, index: number) => (
                      <li key={index}>{prescription}</li>
                    ))}
                  </ul>
                ) : (
                  'No prescriptions recorded yet'
                )}
              </Descriptions.Item>

              <Descriptions.Item label='Follow-up Instructions'>
                {appointment.follow_up_instructions || 'No follow-up instructions recorded'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>

        <TabPane tab='History' key='history'>
          <div className='mt-4'>
            <Descriptions bordered column={1}>
              <Descriptions.Item label='Created'>
                {dayjs(appointment.created_at).format('MMMM DD, YYYY [at] h:mm A')}
              </Descriptions.Item>

              <Descriptions.Item label='Last Updated'>
                {dayjs(appointment.updated_at).format('MMMM DD, YYYY [at] h:mm A')}
              </Descriptions.Item>

              <Descriptions.Item label='Payment Status'>
                <Tag color={appointment.payment_status === 'paid' ? 'success' : 'warning'}>
                  {appointment.payment_status?.toUpperCase() || 'PENDING'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AppointmentDetailsModal;
