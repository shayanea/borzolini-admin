import type { CreateClinicData, OperatingHours, UpdateClinicData } from '@/types';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Space, Typography, message as antMessage } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import {
  BasicInformationStep,
  ContactInformationStep,
  LocationInformationStep,
  MediaBrandingStep,
  OperatingHoursStep,
  ServicesSpecializationsStep,
  SocialMediaStep,
  StatusStep,
} from '@/components/clinics/form';
import { ROUTES } from '@/constants';
import { useOperatingHours } from '@/hooks/use-operating-hours';
import { ClinicsService } from '@/services/clinics.service';
import { useEffect } from 'react';

const { Title, Text } = Typography;

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
        <BasicInformationStep />
        <LocationInformationStep />
        <ContactInformationStep />
        <MediaBrandingStep />
        <SocialMediaStep />
        <ServicesSpecializationsStep
          serviceOptions={serviceOptions}
          specializationOptions={specializationOptions}
        />
        <OperatingHoursStep daysOfWeek={daysOfWeek} />
        <StatusStep />
      </Form>
    </div>
  );
};

export default ClinicForm;
