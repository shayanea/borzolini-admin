import type { CreateClinicData, OperatingHours, UpdateClinicData } from '@/types';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  message as antMessage,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useOperatingHours } from '@/hooks/use-operating-hours';
import { ClinicsService } from '@/services/clinics.service';
import { useEffect } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ClinicFormValues {
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
  logo_url?: string;
  banner_url?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  services: string[];
  specializations: string[];
  operating_hours: Record<string, OperatingHours>;
  is_active: boolean;
  // Social Media Fields
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}

const ClinicForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ClinicFormValues>();
  const queryClient = useQueryClient();
  const { daysOfWeek, getDefaultOperatingHours, convertApiToForm, validateOperatingHours } =
    useOperatingHours();

  const isEditing = !!id;
  const title = isEditing ? 'Edit Clinic' : 'Create New Clinic';

  // Fetch clinic data if editing
  const { data: clinic, isLoading: loadingClinic } = useQuery({
    queryKey: ['clinic', id],
    queryFn: () => ClinicsService.getClinicById(id!),
    enabled: isEditing,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateClinicData) => ClinicsService.createClinic(data),
    onSuccess: () => {
      antMessage.success('Clinic created successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      navigate(ROUTES.CLINICS);
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || 'Failed to create clinic');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClinicData }) =>
      ClinicsService.updateClinic(id, data),
    onSuccess: () => {
      antMessage.success('Clinic updated successfully');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      queryClient.invalidateQueries({ queryKey: ['clinic', id] });
      navigate(ROUTES.CLINICS);
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || 'Failed to update clinic');
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  // Set form values when clinic data is loaded
  useEffect(() => {
    if (clinic && isEditing) {
      // Convert API operating hours to form format
      const formOperatingHours =
        clinic.operatingHours && clinic.operatingHours.length > 0
          ? convertApiToForm(clinic.operatingHours)
          : getDefaultOperatingHours();

      form.setFieldsValue({
        name: clinic.name,
        description: clinic.description || '',
        address: clinic.address,
        city: clinic.city,
        state: clinic.state || '',
        country: clinic.country,
        postal_code: clinic.postal_code || '',
        phone: clinic.phone,
        email: clinic.email,
        website: clinic.website || '',
        logo_url: clinic.logo_url || '',
        banner_url: clinic.banner_url || '',
        emergency_contact: clinic.emergency_contact || '',
        emergency_phone: clinic.emergency_phone || '',
        services: clinic.services || [],
        specializations: clinic.specializations || [],
        operating_hours: formOperatingHours,
        is_active: clinic.is_active,
        // Social Media Fields
        facebook_url: clinic.facebook_url || '',
        twitter_url: clinic.twitter_url || '',
        instagram_url: clinic.instagram_url || '',
        linkedin_url: clinic.linkedin_url || '',
        youtube_url: clinic.youtube_url || '',
        tiktok_url: clinic.tiktok_url || '',
      });
    } else if (!isEditing) {
      form.setFieldsValue({
        is_active: true,
        country: 'United States',
        services: [],
        specializations: [],
        operating_hours: getDefaultOperatingHours(),
      });
    }
  }, [clinic, isEditing, form, getDefaultOperatingHours, convertApiToForm]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Validate operating hours
      if (!validateOperatingHours(values.operating_hours)) {
        antMessage.error(
          'Please check operating hours - ensure all times are valid and close time is after open time'
        );
        return;
      }

      if (isEditing) {
        await updateMutation.mutateAsync({ id: id!, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
    } catch (error) {
      // Form validation errors are handled automatically
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.CLINICS);
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

  // Use daysOfWeek from the hook
  const daysOfWeekArray = daysOfWeek.map(day => ({ key: day.key, label: day.label }));

  if (loadingClinic) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} className='flex items-center'>
            Back to Clinics
          </Button>
          <div>
            <Title level={2} className='!mb-0'>
              {title}
            </Title>
            <Text type='secondary'>
              {isEditing
                ? 'Update clinic information and settings'
                : 'Add a new clinic to the system'}
            </Text>
          </div>
        </div>
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type='primary'
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
            className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
          >
            {isEditing ? 'Update Clinic' : 'Create Clinic'}
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout='vertical'
        initialValues={{
          is_active: true,
          country: 'United States',
          services: [],
          specializations: [],
          operating_hours: getDefaultOperatingHours(),
        }}
      >
        {/* Basic Information */}
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

        {/* Location Information */}
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
        </Card>

        {/* Contact Information */}
        <Card title='Contact Information' className='mb-6'>
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

        {/* Media URLs */}
        <Card title='Media & Branding' className='mb-6'>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='logo_url'
                label='Logo URL'
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input placeholder='Enter logo URL (optional)' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='banner_url'
                label='Banner URL'
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input placeholder='Enter banner URL (optional)' />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Social Media */}
        <Card title='Social Media' className='mb-6'>
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

        {/* Services & Specializations */}
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

        {/* Operating Hours */}
        <Card title='Operating Hours' className='mb-6'>
          <div className='space-y-4'>
            {daysOfWeekArray.map(day => (
              <div key={day.key} className='border rounded-lg p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <Title level={5} className='!mb-0'>
                    {day.label}
                  </Title>
                  <Form.Item
                    name={['operating_hours', day.key, 'closed']}
                    valuePropName='checked'
                    className='!mb-0'
                  >
                    <Switch checkedChildren='Closed' unCheckedChildren='Open' />
                  </Form.Item>
                </div>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.operating_hours?.[day.key]?.closed !==
                    currentValues.operating_hours?.[day.key]?.closed
                  }
                >
                  {({ getFieldValue }) => {
                    const isClosed = getFieldValue(['operating_hours', day.key, 'closed']);
                    if (isClosed) {
                      return null;
                    }
                    return (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name={['operating_hours', day.key, 'open']}
                            label='Opening Time'
                            rules={[{ required: true, message: 'Please enter opening time' }]}
                          >
                            <Input type='time' />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={['operating_hours', day.key, 'close']}
                            label='Closing Time'
                            rules={[{ required: true, message: 'Please enter closing time' }]}
                          >
                            <Input type='time' />
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  }}
                </Form.Item>
              </div>
            ))}
          </div>
        </Card>

        {/* Status */}
        <Card title='Status' className='mb-6'>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='is_active' label='Status' valuePropName='checked'>
                <Switch checkedChildren='Active' unCheckedChildren='Inactive' />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};

export default ClinicForm;
