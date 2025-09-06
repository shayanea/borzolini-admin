import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
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
import type { CreateClinicData, OperatingHours, UpdateClinicData } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { ClinicsService } from '@/services/clinics.service';
import { ROUTES } from '@/constants';
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
}

const ClinicForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ClinicFormValues>();
  const queryClient = useQueryClient();

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
        operating_hours: clinic.operating_hours || getDefaultOperatingHours(),
        is_active: clinic.is_active,
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
  }, [clinic, isEditing, form]);

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

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

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
                                  rules={[{ required: true, message: 'Please enter opening time' }]}
                                >
                                  <Input type='time' />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'close']}
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
                  );
                })}
              </div>
            )}
          </Form.List>
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
