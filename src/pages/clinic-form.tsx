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
import {
  CLINIC_FORM_LABELS,
  CLINIC_SERVICE_OPTIONS,
  CLINIC_SPECIALIZATION_OPTIONS,
  CLINIC_VALIDATION_MESSAGES,
  DEFAULT_CLINIC_COUNTRY,
} from '@/constants/clinics';
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
  const title = isEditing ? CLINIC_FORM_LABELS.EDIT_TITLE : CLINIC_FORM_LABELS.CREATE_TITLE;

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
      antMessage.success(CLINIC_VALIDATION_MESSAGES.CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      navigate(ROUTES.CLINICS);
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || CLINIC_VALIDATION_MESSAGES.CREATE_ERROR);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClinicData }) =>
      ClinicsService.updateClinic(id, data),
    onSuccess: () => {
      antMessage.success(CLINIC_VALIDATION_MESSAGES.UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      queryClient.invalidateQueries({ queryKey: ['clinic', id] });
      navigate(ROUTES.CLINICS);
    },
    onError: (error: any) => {
      antMessage.error(error?.response?.data?.message || CLINIC_VALIDATION_MESSAGES.UPDATE_ERROR);
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
        country: DEFAULT_CLINIC_COUNTRY,
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
        antMessage.error(CLINIC_VALIDATION_MESSAGES.OPERATING_HOURS_ERROR);
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

  if (loadingClinic) {
    return <div>Loading...</div>;
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button icon={<ArrowLeftOutlined />} onClick={handleCancel} className='flex items-center'>
            {CLINIC_FORM_LABELS.BACK_BUTTON}
          </Button>
          <div>
            <Title level={2} className='!mb-0'>
              {title}
            </Title>
            <Text type='secondary'>
              {isEditing
                ? CLINIC_FORM_LABELS.EDIT_DESCRIPTION
                : CLINIC_FORM_LABELS.CREATE_DESCRIPTION}
            </Text>
          </div>
        </div>
        <Space>
          <Button onClick={handleCancel}>{CLINIC_FORM_LABELS.CANCEL_BUTTON}</Button>
          <Button
            type='primary'
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
            className='bg-primary-navy border-primary-navy hover:bg-primary-dark hover:border-primary-dark'
          >
            {isEditing ? CLINIC_FORM_LABELS.UPDATE_BUTTON : CLINIC_FORM_LABELS.CREATE_BUTTON}
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout='vertical'
        initialValues={{
          is_active: true,
          country: DEFAULT_CLINIC_COUNTRY,
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
          serviceOptions={CLINIC_SERVICE_OPTIONS}
          specializationOptions={CLINIC_SPECIALIZATION_OPTIONS}
        />
        <OperatingHoursStep daysOfWeek={daysOfWeek} />
        <StatusStep />
      </Form>
    </div>
  );
};

export default ClinicForm;