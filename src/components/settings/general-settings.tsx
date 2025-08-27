import { CURRENCIES, TIMEZONES } from '@/constants/settings';
import { Card, Col, Form, Input, Row, Select } from 'antd';

const { Option } = Select;

const GeneralSettings = () => {
  return (
    <Card title='General Settings' className='admin-card mb-6'>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Clinic Name'
            name='clinicName'
            rules={[{ required: true, message: 'Please enter clinic name' }]}
          >
            <Input placeholder='Enter clinic name' />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label='Timezone'
            name='timezone'
            rules={[{ required: true, message: 'Please select timezone' }]}
          >
            <Select placeholder='Select timezone'>
              {TIMEZONES.map(timezone => (
                <Option key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            label='Currency'
            name='currency'
            rules={[{ required: true, message: 'Please select currency' }]}
          >
            <Select placeholder='Select currency'>
              {CURRENCIES.map(currency => (
                <Option key={currency.value} value={currency.value}>
                  {currency.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label='Business Hours' name='businessHours'>
            <Input placeholder='e.g., 8:00 AM - 6:00 PM' />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default GeneralSettings;
