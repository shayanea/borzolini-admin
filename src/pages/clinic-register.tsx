import { SaveOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  message as antMessage,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Typography,
} from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { ClinicsService } from '@/services/clinics.service';
import type { CreateClinicData, OperatingHours } from '@/types';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ClinicRegistrationValues {
  name: string;
  description?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  phone: string;
  email: string;
  website?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  services: string[];
  specializations: string[];
  operating_hours: Record<string, OperatingHours>;
  // Social Media Fields
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}

const ClinicRegister = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<ClinicRegistrationValues>();
  const [currentStep, setCurrentStep] = useState(0);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateClinicData) => ClinicsService.createClinic(data),
    onSuccess: () => {
      antMessage.success(
        'Clinic registration submitted successfully! We will review and approve your clinic soon.'
      );
      navigate(ROUTES.CLINIC_REGISTER_SUCCESS);
    },
    onError: (error: any) => {
      antMessage.error(
        error?.response?.data?.message || 'Failed to register clinic. Please try again.'
      );
    },
  });

  const loading = createMutation.isPending;

  const getDefaultOperatingHours = (): Record<string, OperatingHours> => ({
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '10:00', close: '15:00', closed: false },
    sunday: { open: '00:00', close: '00:00', closed: true },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createMutation.mutateAsync(values);
    } catch (error) {
      // Form validation errors are handled automatically
    }
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      // Form validation errors are handled automatically
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const serviceOptions = [
    'Vaccinations',
    'Surgery',
    'Dental Care',
    'Emergency Care',
    'Wellness Exams',
    'Grooming',
    'Boarding',
    'Microchipping',
    'Laboratory Services',
    'Radiology',
    'Pharmacy',
    'Behavioral Consultation',
  ];

  const specializationOptions = [
    'Feline Medicine',
    'Canine Medicine',
    'Exotic Animals',
    'Emergency Medicine',
    'Surgery',
    'Dermatology',
    'Cardiology',
    'Oncology',
    'Orthopedics',
    'Neurology',
    'Ophthalmology',
    'Dentistry',
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const steps = [
    {
      title: 'Basic Information',
      description: 'Clinic details and contact info',
    },
    {
      title: 'Location',
      description: 'Address and location details',
    },
    {
      title: 'Services',
      description: 'Services and specializations',
    },
    {
      title: 'Social Media',
      description: 'Social media profiles (optional)',
    },
    {
      title: 'Operating Hours',
      description: 'Business hours and schedule',
    },
    {
      title: 'Review',
      description: 'Review and submit',
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title='Basic Information' className='mb-6'>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='name'
                  label='Clinic Name'
                  rules={[
                    { required: true, message: 'Please enter clinic name' },
                    { min: 2, message: 'Clinic name must be at least 2 characters' },
                  ]}
                >
                  <Input placeholder='Enter clinic name' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='phone'
                  label='Phone Number'
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                    {
                      pattern: /^[+]?[\d\s\-\(\)\.]{7,20}$/,
                      message: 'Please enter a valid phone number',
                    },
                  ]}
                >
                  <Input placeholder='Enter phone number' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input placeholder='Enter email address' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='website'
                  label='Website'
                  rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                >
                  <Input placeholder='Enter website URL (optional)' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name='description'
                  label='Description'
                  rules={[{ max: 500, message: 'Description must not exceed 500 characters' }]}
                >
                  <TextArea
                    rows={3}
                    placeholder='Enter clinic description (optional)'
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );

      case 1:
        return (
          <Card title='Location Information' className='mb-6'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name='address'
                  label='Address'
                  rules={[
                    { required: true, message: 'Please enter address' },
                    { min: 5, message: 'Address must be at least 5 characters' },
                  ]}
                >
                  <Input placeholder='Enter full address' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name='city'
                  label='City'
                  rules={[
                    { required: true, message: 'Please enter city' },
                    { min: 2, message: 'City must be at least 2 characters' },
                  ]}
                >
                  <Input placeholder='Enter city' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name='state' label='State/Province'>
                  <Input placeholder='Enter state or province' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='country'
                  label='Country'
                  rules={[{ required: true, message: 'Please enter country' }]}
                >
                  <Input placeholder='Enter country' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='postal_code'
                  label='Postal Code'
                  rules={[
                    {
                      pattern: /^[0-9A-Za-z\s-]{3,10}$/,
                      message: 'Please enter a valid postal code',
                    },
                  ]}
                >
                  <Input placeholder='Enter postal code' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name='emergency_contact' label='Emergency Contact Person'>
                  <Input placeholder='Enter emergency contact name' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='emergency_phone'
                  label='Emergency Phone'
                  rules={[
                    {
                      pattern: /^[+]?[\d\s\-\(\)\.]{7,20}$/,
                      message: 'Please enter a valid phone number',
                    },
                  ]}
                >
                  <Input placeholder='Enter emergency phone number' />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );

      case 2:
        return (
          <Card title='Services & Specializations' className='mb-6'>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name='services' label='Services Offered'>
                  <Select
                    mode='multiple'
                    placeholder='Select services offered'
                    options={serviceOptions.map(service => ({ label: service, value: service }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='specializations' label='Specializations'>
                  <Select
                    mode='multiple'
                    placeholder='Select specializations'
                    options={specializationOptions.map(spec => ({ label: spec, value: spec }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );

      case 3:
        return (
          <Card title='Social Media Profiles' className='mb-6'>
            <div className='mb-4'>
              <Text type='secondary'>
                Add your social media profiles to help clients connect with your clinic online. All
                fields are optional.
              </Text>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='facebook_url'
                  label='Facebook URL'
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' },
                    {
                      pattern: /^https?:\/\/(www\.)?facebook\.com\/.+/,
                      message: 'Please enter a valid Facebook URL',
                    },
                  ]}
                >
                  <Input placeholder='https://facebook.com/yourclinic' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='twitter_url'
                  label='Twitter URL'
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' },
                    {
                      pattern: /^https?:\/\/(www\.)?twitter\.com\/.+/,
                      message: 'Please enter a valid Twitter URL',
                    },
                  ]}
                >
                  <Input placeholder='https://twitter.com/yourclinic' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='instagram_url'
                  label='Instagram URL'
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' },
                    {
                      pattern: /^https?:\/\/(www\.)?instagram\.com\/.+/,
                      message: 'Please enter a valid Instagram URL',
                    },
                  ]}
                >
                  <Input placeholder='https://instagram.com/yourclinic' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='linkedin_url'
                  label='LinkedIn URL'
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' },
                    {
                      pattern: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
                      message: 'Please enter a valid LinkedIn URL',
                    },
                  ]}
                >
                  <Input placeholder='https://linkedin.com/company/yourclinic' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='youtube_url'
                  label='YouTube URL'
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' },
                    {
                      pattern: /^https?:\/\/(www\.)?youtube\.com\/.+/,
                      message: 'Please enter a valid YouTube URL',
                    },
                  ]}
                >
                  <Input placeholder='https://youtube.com/c/yourclinic' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='tiktok_url'
                  label='TikTok URL'
                  rules={[
                    { type: 'url', message: 'Please enter a valid URL' },
                    {
                      pattern: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
                      message: 'Please enter a valid TikTok URL',
                    },
                  ]}
                >
                  <Input placeholder='https://tiktok.com/@yourclinic' />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );

      case 4:
        return (
          <Card title='Operating Hours' className='mb-6'>
            <Form.List name='operating_hours'>
              {fields => (
                <div className='space-y-4'>
                  {fields.map(({ key, name, ...restField }) => {
                    const dayInfo = daysOfWeek.find(day => day.key === String(name));
                    return (
                      <div key={key} className='border rounded-lg p-4'>
                        <div className='flex items-center justify-between mb-4'>
                          <Title level={5} className='!mb-0'>
                            {dayInfo?.label}
                          </Title>
                          <Form.Item
                            {...restField}
                            name={[name, 'closed']}
                            valuePropName='checked'
                            className='!mb-0'
                          >
                            <Switch checkedChildren='Closed' unCheckedChildren='Open' />
                          </Form.Item>
                        </div>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) =>
                            prevValues.operating_hours?.[name]?.closed !==
                            currentValues.operating_hours?.[name]?.closed
                          }
                        >
                          {({ getFieldValue }) => {
                            const isClosed = getFieldValue(['operating_hours', name, 'closed']);
                            if (isClosed) {
                              return null;
                            }
                            return (
                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'open']}
                                    label='Opening Time'
                                    rules={[
                                      { required: true, message: 'Please enter opening time' },
                                    ]}
                                  >
                                    <Input type='time' />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'close']}
                                    label='Closing Time'
                                    rules={[
                                      { required: true, message: 'Please enter closing time' },
                                    ]}
                                  >
                                    <Input type='time' />
                                  </Form.Item>
                                </Col>
                              </Row>
                            );
                          }}
                        </Form.Item>
                      </div>
                    );
                  })}
                </div>
              )}
            </Form.List>
          </Card>
        );

      case 5:
        return (
          <Card title='Review Your Information' className='mb-6'>
            <Alert
              message='Review Process'
              description='Your clinic registration will be reviewed by our team before being approved and published. You will receive an email notification once the review is complete.'
              type='info'
              showIcon
              className='mb-6'
            />
            <div className='space-y-4'>
              <div>
                <Text strong>Clinic Name:</Text> {form.getFieldValue('name')}
              </div>
              <div>
                <Text strong>Email:</Text> {form.getFieldValue('email')}
              </div>
              <div>
                <Text strong>Phone:</Text> {form.getFieldValue('phone')}
              </div>
              <div>
                <Text strong>Address:</Text> {form.getFieldValue('address')},{' '}
                {form.getFieldValue('city')}, {form.getFieldValue('state')}{' '}
                {form.getFieldValue('postal_code')}
              </div>
              <div>
                <Text strong>Services:</Text>{' '}
                {form.getFieldValue('services')?.join(', ') || 'None selected'}
              </div>
              <div>
                <Text strong>Specializations:</Text>{' '}
                {form.getFieldValue('specializations')?.join(', ') || 'None selected'}
              </div>
              <div>
                <Text strong>Social Media:</Text>
                <div className='ml-4 space-y-1'>
                  {form.getFieldValue('facebook_url') && (
                    <div>Facebook: {form.getFieldValue('facebook_url')}</div>
                  )}
                  {form.getFieldValue('twitter_url') && (
                    <div>Twitter: {form.getFieldValue('twitter_url')}</div>
                  )}
                  {form.getFieldValue('instagram_url') && (
                    <div>Instagram: {form.getFieldValue('instagram_url')}</div>
                  )}
                  {form.getFieldValue('linkedin_url') && (
                    <div>LinkedIn: {form.getFieldValue('linkedin_url')}</div>
                  )}
                  {form.getFieldValue('youtube_url') && (
                    <div>YouTube: {form.getFieldValue('youtube_url')}</div>
                  )}
                  {form.getFieldValue('tiktok_url') && (
                    <div>TikTok: {form.getFieldValue('tiktok_url')}</div>
                  )}
                  {!form.getFieldValue('facebook_url') &&
                    !form.getFieldValue('twitter_url') &&
                    !form.getFieldValue('instagram_url') &&
                    !form.getFieldValue('linkedin_url') &&
                    !form.getFieldValue('youtube_url') &&
                    !form.getFieldValue('tiktok_url') && (
                      <div className='text-gray-500'>No social media profiles added</div>
                    )}
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Page Header */}
        <div className='text-center mb-8'>
          <Title level={1} className='!mb-2'>
            Register Your Clinic
          </Title>
          <Text type='secondary' className='text-lg'>
            Join our network of trusted veterinary clinics
          </Text>
        </div>

        {/* Steps */}
        <div className='mb-8'>
          <Steps current={currentStep} items={steps} />
        </div>

        <Form
          form={form}
          layout='vertical'
          className='max-w-4xl mx-auto'
          initialValues={{
            country: 'United States',
            services: [],
            specializations: [],
            operating_hours: getDefaultOperatingHours(),
          }}
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className='flex justify-between mt-8'>
            <Button onClick={handlePrev} disabled={currentStep === 0}>
              Previous
            </Button>
            <Space>
              {currentStep < steps.length - 1 ? (
                <Button type='primary' onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type='primary'
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                  className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
                >
                  Submit Registration
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ClinicRegister;
