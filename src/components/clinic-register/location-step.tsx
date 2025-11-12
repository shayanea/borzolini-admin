import { Alert, Col, Form, Input, Row, Typography } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const LocationStep: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* Section Header */}
      <div className='border-l-4 border-indigo-500 pl-4'>
        <Title level={3} className='!mb-1'>
          Location Information
        </Title>
        <Text type='secondary'>
          Help pet owners find you! Provide your clinic's physical location and emergency contact
          details.
        </Text>
      </div>

      {/* Address Section */}
      <div className='space-y-6'>
        <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100'>
          <Title level={5} className='!mb-4 flex items-center gap-2'>
            <EnvironmentOutlined className='text-indigo-500' />
            Clinic Address
          </Title>

          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form.Item
                name='address'
                label={<span className='text-base font-medium'>Street Address</span>}
                rules={[
                  { required: true, message: 'Please enter address' },
                  { min: 5, message: 'Address must be at least 5 characters' },
                ]}
              >
                <Input
                  placeholder='e.g., 123 Main Street, Suite 100'
                  size='large'
                  className='rounded-lg'
                  prefix={<EnvironmentOutlined className='text-gray-400' />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Form.Item
                name='city'
                label={<span className='text-base font-medium'>City</span>}
                rules={[
                  { required: true, message: 'Please enter city' },
                  { min: 2, message: 'City must be at least 2 characters' },
                ]}
              >
                <Input placeholder='e.g., New York' size='large' className='rounded-lg' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name='state'
                label={<span className='text-base font-medium'>State/Province</span>}
              >
                <Input placeholder='e.g., NY' size='large' className='rounded-lg' />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name='country'
                label={<span className='text-base font-medium'>Country</span>}
                rules={[{ required: true, message: 'Please enter country' }]}
              >
                <Input placeholder='e.g., United States' size='large' className='rounded-lg' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name='postal_code'
                label={<span className='text-base font-medium'>Postal Code</span>}
                rules={[
                  {
                    pattern: /^[0-9A-Za-z\s-]{3,10}$/,
                    message: 'Please enter a valid postal code',
                  },
                ]}
              >
                <Input placeholder='e.g., 10001' size='large' className='rounded-lg' />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Emergency Contact Section */}
        <div className='bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100'>
          <Title level={5} className='!mb-2 flex items-center gap-2'>
            <PhoneOutlined className='text-orange-500' />
            Emergency Contact
          </Title>
          <Text type='secondary' className='block mb-4'>
            After-hours emergency contact information (optional but recommended)
          </Text>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name='emergency_contact'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <UserOutlined className='text-orange-500' />
                    Contact Person
                  </span>
                }
              >
                <Input placeholder='e.g., Dr. Jane Smith' size='large' className='rounded-lg' />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='emergency_phone'
                label={
                  <span className='text-base font-medium flex items-center gap-2'>
                    <PhoneOutlined className='text-orange-500' />
                    Emergency Phone
                  </span>
                }
                rules={[
                  {
                    pattern: /^[+]?[\d\s\-().]{7,20}$/,
                    message: 'Please enter a valid phone number',
                  },
                ]}
              >
                <Input placeholder='e.g., +1 (555) 987-6543' size='large' className='rounded-lg' />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Alert
          message='Your location will be used to help pet owners find your clinic'
          description='Make sure your address is accurate so clients can easily locate your clinic.'
          type='info'
          showIcon
          className='rounded-lg'
        />
      </div>
    </div>
  );
};
