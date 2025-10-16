import type { OperatingHours } from '@/types';

export interface ClinicRegistrationValues {
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
