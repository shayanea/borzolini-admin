export interface Clinic {
  id: string;
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
  operating_hours?: Record<string, OperatingHours>;
  operatingHours: ClinicOperatingHours[];
  staff: ClinicStaff[];
  photos: ClinicPhoto[];
  reviews: ClinicReview[];
  rating: number;
  totalReviews: number;
  is_active: boolean;
  // Social Media Fields
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface ClinicOperatingHours {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface ClinicService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
}

export interface ClinicStaff {
  id: string;
  userId: string;
  role: 'veterinarian' | 'nurse' | 'receptionist' | 'technician';
  specialization?: string;
  isActive: boolean;
  joinedAt: string;
}

export interface ClinicPhoto {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface ClinicReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateClinicData {
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
  services?: string[];
  specializations?: string[];
  operating_hours?: Record<string, OperatingHours>;
  // Social Media Fields
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}

export interface UpdateClinicData {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  services?: string[];
  specializations?: string[];
  operating_hours?: Record<string, OperatingHours>;
  is_active?: boolean;
  // Social Media Fields
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
}

export interface ClinicsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  city?: string;
  state?: string;
  is_verified?: boolean;
  isActive?: boolean;
  services?: string;
  specializations?: string;
  rating_min?: number;
  rating_max?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
