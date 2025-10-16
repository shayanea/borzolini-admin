import { Col, Form, Input, Row, Typography } from 'antd';
import { GlobalOutlined, MailOutlined, PhoneOutlined, ShopOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

export const BasicInformationStep: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* Section Header */}
      <div className='border-l-4 border-indigo-500 pl-4'>
        <Title level={3} className='!mb-1'>
          Basic Information
        </Title>
        <Text type='secondary'>
          Tell us about your clinic. This information will be visible to pet owners looking for
          veterinary services.
        </Text>
      </div>

      {/* Form Fields */}
      <div className='space-y-6'>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name='name'
              label={
                <span className='text-base font-medium flex items-center gap-2'>
                  <ShopOutlined className='text-indigo-500' />
                  Clinic Name
                </span>
              }
              rules={[
                { required: true, message: 'Please enter clinic name' },
                { min: 2, message: 'Clinic name must be at least 2 characters' },
              ]}
            >
              <Input
                placeholder='e.g., Happy Paws Veterinary Clinic'
                size='large'
                className='rounded-lg'
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name='phone'
              label={
                <span className='text-base font-medium flex items-center gap-2'>
                  <PhoneOutlined className='text-indigo-500' />
                  Phone Number
                </span>
              }
              rules={[
                { required: true, message: 'Please enter phone number' },
                {
                  pattern: /^[+]?[\d\s\-().]{7,20}$/,
                  message: 'Please enter a valid phone number',
                },
              ]}
            >
              <Input placeholder='e.g., +1 (555) 123-4567' size='large' className='rounded-lg' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Form.Item
              name='email'
              label={
                <span className='text-base font-medium flex items-center gap-2'>
                  <MailOutlined className='text-indigo-500' />
                  Email Address
                </span>
              }
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                placeholder='e.g., contact@happypaws.com'
                size='large'
                className='rounded-lg'
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name='website'
              label={
                <span className='text-base font-medium flex items-center gap-2'>
                  <GlobalOutlined className='text-indigo-500' />
                  Website <Text type='secondary'>(Optional)</Text>
                </span>
              }
              rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
            >
              <Input
                placeholder='e.g., https://www.happypaws.com'
                size='large'
                className='rounded-lg'
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name='description'
              label={
                <span className='text-base font-medium'>
                  Clinic Description <Text type='secondary'>(Optional)</Text>
                </span>
              }
              rules={[{ max: 500, message: 'Description must not exceed 500 characters' }]}
              extra='Share what makes your clinic special - your services, values, and commitment to pet care.'
            >
              <TextArea
                rows={4}
                placeholder='Describe your clinic, your approach to pet care, and what makes your team special...'
                maxLength={500}
                showCount
                size='large'
                className='rounded-lg'
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};
