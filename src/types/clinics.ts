export interface Clinic {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  website?: string;
  operatingHours: ClinicOperatingHours[];
  services: string[] | ClinicService[];
  staff: ClinicStaff[];
  photos: ClinicPhoto[];
  reviews: ClinicReview[];
  rating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  website?: string;
}

export interface UpdateClinicData {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

export interface ClinicsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
