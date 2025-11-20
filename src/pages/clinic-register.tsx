import type { CreateClinicData, OperatingHours } from '@/types';
import { Button, Form, Progress, Space, Steps, Typography, message as antMessage } from 'antd';

import {
  BasicInformationStep,
  LocationStep,
  OperatingHoursStep,
  REGISTRATION_STEPS,
  ReviewStep,
  ServicesStep,
  SocialMediaStep,
  type ClinicRegistrationValues,
} from '@/components/clinic-register';
import { ROUTES } from '@/constants';
import { ClinicsService } from '@/services/clinics.service';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

function ClinicRegister() {
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
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      antMessage.error(errorMessage || 'Failed to register clinic. Please try again.');
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInformationStep />;
      case 1:
        return <LocationStep />;
      case 2:
        return <ServicesStep />;
      case 3:
        return <SocialMediaStep />;
      case 4:
        return <OperatingHoursStep />;
      case 5:
        return <ReviewStep form={form} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / REGISTRATION_STEPS.length) * 100;

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden'>
      <div className='relative z-10 max-w-6xl mx-auto px-4 py-12'>
        {/* Modern Header with gradient */}
        <div className='text-center mb-12'>
          <Title
            level={1}
            className='!mb-4 !text-5xl !font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
          >
            Register Your Clinic
          </Title>
          <Paragraph className='text-lg text-gray-600 max-w-2xl mx-auto !mb-6'>
            Join our network of trusted veterinary clinics and expand your reach. Complete this
            simple registration to get started with our platform.
          </Paragraph>

          {/* Progress Bar */}
          <div className='max-w-md mx-auto'>
            <div className='flex items-center justify-between mb-2'>
              <Text className='text-sm font-medium text-gray-600'>
                Step {currentStep + 1} of {REGISTRATION_STEPS.length}
              </Text>
              <Text className='text-sm font-medium text-indigo-600'>
                {Math.round(progressPercentage)}% Complete
              </Text>
            </div>
            <Progress
              percent={progressPercentage}
              strokeColor={{
                '0%': '#6ecefd',
                '100%': '#9333ea',
              }}
              showInfo={false}
              strokeWidth={8}
              className='!mb-0'
            />
          </div>
        </div>

        {/* Modern Steps Navigation */}
        <div className='mb-12 max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100'>
          <Steps
            current={currentStep}
            items={REGISTRATION_STEPS}
            labelPlacement='vertical'
            className='modern-steps'
          />
        </div>

        {/* Form Container with modern card design */}
        <div className='max-w-5xl mx-auto'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12'>
            <Form
              form={form}
              layout='vertical'
              initialValues={{
                country: 'United States',
                services: [],
                specializations: [],
                operating_hours: getDefaultOperatingHours(),
              }}
            >
              {renderStepContent()}

              {/* Modern Navigation Buttons */}
              <div className='flex justify-between mt-12 pt-8 border-t border-gray-100'>
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  size='large'
                  icon={<ArrowLeftOutlined />}
                  className='!h-12 !px-8 disabled:opacity-50'
                >
                  Previous
                </Button>
                <Space size='middle'>
                  {currentStep < REGISTRATION_STEPS.length - 1 ? (
                    <Button
                      type='primary'
                      onClick={handleNext}
                      size='large'
                      icon={<ArrowRightOutlined />}
                      iconPosition='end'
                      className='!h-12 !px-8 bg-gradient-to-r from-indigo-600 to-indigo-500 border-0 hover:from-indigo-700 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all'
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type='primary'
                      icon={<CheckCircleOutlined />}
                      onClick={handleSubmit}
                      loading={loading}
                      size='large'
                      className='!h-12 !px-8 bg-gradient-to-r from-green-600 to-emerald-600 border-0 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all'
                    >
                      Submit Registration
                    </Button>
                  )}
                </Space>
              </div>
            </Form>
          </div>

          {/* Trust indicators */}
          <div className='mt-8 text-center'>
            <div className='flex items-center justify-center space-x-8 text-gray-500'>
              <div className='flex items-center space-x-2'>
                <CheckCircleOutlined className='text-green-500 text-xl' />
                <Text className='text-sm'>Secure & Encrypted</Text>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircleOutlined className='text-green-500 text-xl' />
                <Text className='text-sm'>Fast Approval</Text>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircleOutlined className='text-green-500 text-xl' />
                <Text className='text-sm'>24/7 Support</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ClinicRegister };
export default ClinicRegister;
