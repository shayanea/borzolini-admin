import type { CreateClinicData, OperatingHours, UpdateClinicData } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, message as antMessage } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import {
  CLINIC_FORM_LABELS,
  CLINIC_VALIDATION_MESSAGES,
  DEFAULT_CLINIC_COUNTRY,
} from '@/constants/clinics';
import { ROUTES } from '@/constants';
import { useOperatingHours } from '@/hooks/use-operating-hours';
import { ClinicsService } from '@/services/clinics.service';

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

export const useClinicForm = () => {
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

  // Initialize or update form values
  useEffect(() => {
    if (clinic && isEditing) {
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
      // Form validation errors are handled automatically by antd
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.CLINICS);
  };

  return {
    form,
    daysOfWeek,
    getDefaultOperatingHours,
    title,
    isEditing,
    loading,
    loadingClinic,
    handleSubmit,
    handleCancel,
  };
};
