import { Alert, Typography, Divider, Tag, Space, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  ShareAltOutlined,
  StarOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

import type { ClinicRegistrationValues } from './types';
import type { FormInstance } from 'antd';

const { Text, Title, Paragraph } = Typography;

interface ReviewStepProps {
  form: FormInstance<ClinicRegistrationValues>;
}

interface SocialMediaLink {
  platform: string;
  fieldName: keyof ClinicRegistrationValues;
  icon: React.ReactNode;
  color: string;
}

const SOCIAL_MEDIA_PLATFORMS: SocialMediaLink[] = [
  { platform: 'Facebook', fieldName: 'facebook_url', icon: '📘', color: 'blue' },
  { platform: 'Twitter', fieldName: 'twitter_url', icon: '🐦', color: 'cyan' },
  { platform: 'Instagram', fieldName: 'instagram_url', icon: '📷', color: 'magenta' },
  { platform: 'LinkedIn', fieldName: 'linkedin_url', icon: '💼', color: 'blue' },
  { platform: 'YouTube', fieldName: 'youtube_url', icon: '▶️', color: 'red' },
  { platform: 'TikTok', fieldName: 'tiktok_url', icon: '🎵', color: 'purple' },
];

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: string;
}> = ({ icon, label, value, color = 'indigo' }) => {
  if (!value) return null;
  return (
    <div className='flex items-start gap-3'>
      <div className={`mt-1 text-${color}-500 text-xl`}>{icon}</div>
      <div className='flex-1'>
        <Text type='secondary' className='text-sm block'>
          {label}
        </Text>
        <Text className='text-base font-medium'>{value}</Text>
      </div>
    </div>
  );
};

const SocialMediaSection: React.FC<{ form: FormInstance<ClinicRegistrationValues> }> = ({
  form,
}) => {
  const socialMediaLinks = SOCIAL_MEDIA_PLATFORMS.map(({ platform, fieldName, icon, color }) => ({
    platform,
    icon,
    color,
    url: form.getFieldValue(fieldName),
  })).filter(link => link.url);

  if (socialMediaLinks.length === 0) {
    return (
      <div className='text-center py-6 text-gray-400'>
        <ShareAltOutlined className='text-3xl mb-2' />
        <div>No social media profiles added</div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      {socialMediaLinks.map(({ platform, url, icon }) => (
        <div
          key={platform}
          className='flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200'
        >
          <span className='text-2xl'>{icon}</span>
          <div className='flex-1 min-w-0'>
            <Text strong className='block'>
              {platform}
            </Text>
            <Text type='secondary' className='text-xs truncate block'>
              {url}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
};

const OperatingHoursSection: React.FC<{ form: FormInstance<ClinicRegistrationValues> }> = ({
  form,
}) => {
  const operatingHours = form.getFieldValue('operating_hours') || {};
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: Record<string, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  return (
    <div className='grid grid-cols-1 gap-2'>
      {days.map(day => {
        const hours = operatingHours[day];
        const isClosed = hours?.closed;
        return (
          <div
            key={day}
            className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'
          >
            <Text strong className='w-16'>
              {dayLabels[day]}
            </Text>
            {isClosed ? (
              <Tag color='default'>Closed</Tag>
            ) : (
              <Text type='secondary'>
                {hours?.open} - {hours?.close}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  const services = form.getFieldValue('services') || [];
  const specializations = form.getFieldValue('specializations') || [];

  return (
    <div className='space-y-8'>
      {/* Section Header */}
      <div className='border-l-4 border-green-500 pl-4'>
        <Title level={3} className='!mb-1'>
          Review & Submit
        </Title>
        <Text type='secondary'>
          Please review all the information below before submitting your clinic registration. You
          can go back to edit any section if needed.
        </Text>
      </div>

      <Alert
        message='What happens next?'
        description='After submission, our team will review your clinic registration within 24-48 hours. You will receive an email notification once approved, and your clinic will be visible to pet owners on our platform.'
        type='success'
        showIcon
        icon={<SafetyOutlined />}
        className='rounded-lg'
      />

      {/* Basic Information */}
      <div className='bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100'>
        <Title level={5} className='!mb-4 flex items-center gap-2'>
          <ShopOutlined className='text-indigo-500' />
          Basic Information
        </Title>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <InfoItem
            icon={<ShopOutlined />}
            label='Clinic Name'
            value={form.getFieldValue('name')}
          />
          <InfoItem
            icon={<PhoneOutlined />}
            label='Phone Number'
            value={form.getFieldValue('phone')}
          />
          <InfoItem icon={<MailOutlined />} label='Email' value={form.getFieldValue('email')} />
          <InfoItem
            icon={<GlobalOutlined />}
            label='Website'
            value={form.getFieldValue('website') || 'Not provided'}
          />
        </div>
        {form.getFieldValue('description') && (
          <>
            <Divider className='my-4' />
            <div>
              <Text type='secondary' className='text-sm block mb-2'>
                Description
              </Text>
              <Paragraph className='!mb-0 text-gray-700'>
                {form.getFieldValue('description')}
              </Paragraph>
            </div>
          </>
        )}
      </div>

      {/* Location */}
      <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100'>
        <Title level={5} className='!mb-4 flex items-center gap-2'>
          <EnvironmentOutlined className='text-green-500' />
          Location
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <InfoItem
              icon={<EnvironmentOutlined />}
              label='Address'
              value={form.getFieldValue('address')}
              color='green'
            />
          </Col>
          <Col xs={24} md={12}>
            <InfoItem
              icon={<EnvironmentOutlined />}
              label='City'
              value={form.getFieldValue('city')}
              color='green'
            />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem
              icon={<EnvironmentOutlined />}
              label='State/Province'
              value={form.getFieldValue('state') || 'Not provided'}
              color='green'
            />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem
              icon={<EnvironmentOutlined />}
              label='Country'
              value={form.getFieldValue('country')}
              color='green'
            />
          </Col>
          <Col xs={24} md={8}>
            <InfoItem
              icon={<EnvironmentOutlined />}
              label='Postal Code'
              value={form.getFieldValue('postal_code') || 'Not provided'}
              color='green'
            />
          </Col>
        </Row>
      </div>

      {/* Services & Specializations */}
      <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100'>
        <Title level={5} className='!mb-4 flex items-center gap-2'>
          <MedicineBoxOutlined className='text-purple-500' />
          Services & Specializations
        </Title>
        <div className='space-y-4'>
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <MedicineBoxOutlined className='text-blue-500' />
              <Text strong>Services Offered</Text>
            </div>
            {services.length > 0 ? (
              <Space size={[8, 8]} wrap>
                {services.map((service: string) => (
                  <Tag key={service} color='blue' className='px-3 py-1'>
                    {service}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type='secondary'>No services selected</Text>
            )}
          </div>
          <Divider className='my-4' />
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <StarOutlined className='text-purple-500' />
              <Text strong>Specializations</Text>
            </div>
            {specializations.length > 0 ? (
              <Space size={[8, 8]} wrap>
                {specializations.map((spec: string) => (
                  <Tag key={spec} color='purple' className='px-3 py-1'>
                    {spec}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type='secondary'>No specializations selected</Text>
            )}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className='bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100'>
        <Title level={5} className='!mb-4 flex items-center gap-2'>
          <ShareAltOutlined className='text-orange-500' />
          Social Media Profiles
        </Title>
        <SocialMediaSection form={form} />
      </div>

      {/* Operating Hours */}
      <div className='bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl p-6 border border-cyan-100'>
        <Title level={5} className='!mb-4 flex items-center gap-2'>
          <ClockCircleOutlined className='text-cyan-500' />
          Operating Hours
        </Title>
        <OperatingHoursSection form={form} />
      </div>

      {/* Final CTA */}
      <Alert
        message={
          <div className='flex items-center gap-2'>
            <CheckCircleOutlined className='text-xl' />
            <span className='font-semibold'>Ready to submit?</span>
          </div>
        }
        description='By clicking "Submit Registration" below, you confirm that all information provided is accurate and agree to our terms of service.'
        type='info'
        className='rounded-lg border-2 border-indigo-200'
      />
    </div>
  );
};
