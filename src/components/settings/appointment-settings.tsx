import { Card, Col, Form, Input, Row, Select } from 'antd';

import { APPOINTMENT_DURATIONS } from '@/constants/settings';

const { Option } = Select;

const AppointmentSettings = () => {
  return (
    <Card title='Appointment Settings' className='admin-card mb-6'>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Default Appointment Duration (minutes)'
            name={['appointmentSettings', 'defaultAppointmentDuration']}
          >
            <Select placeholder='Select duration'>
              {APPOINTMENT_DURATIONS.map(duration => (
                <Option key={duration.value} value={duration.value}>
                  {duration.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='Booking Lead Time (hours)'
            name={['appointmentSettings', 'bookingLeadTime']}
          >
            <Input type='number' placeholder='24' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Cancellation Policy (hours)'
            name={['appointmentSettings', 'cancellationPolicy']}
          >
            <Input type='number' placeholder='24' />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='Max Appointments per Day'
            name={['appointmentSettings', 'maxAppointmentsPerDay']}
          >
            <Input type='number' placeholder='50' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default AppointmentSettings;
