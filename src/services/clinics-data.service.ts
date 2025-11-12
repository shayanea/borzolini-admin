/**
 * Clinics Data Service
 * Handles clinic data normalization and validation
 */

import type { Clinic } from '@/types/clinics';

export const ClinicsDataService = {
  /**
   * Normalize clinics data ensuring all required fields have valid values
   */
  normalizeClinics: (clinics: Clinic[]): Clinic[] => {
    if (!Array.isArray(clinics)) {
      console.error('normalizeClinics received non-array data:', clinics);
      return [];
    }

    return clinics
      .filter(clinic => clinic && typeof clinic === 'object' && clinic.id)
      .map(clinic => {
        // Log any problematic clinics for debugging
        if (!clinic.name || !clinic.address || !clinic.phone || !clinic.email) {
          console.warn('Clinic missing required fields, applying defaults:', clinic);
        }

        return {
          ...clinic,
          name: clinic.name || 'Unknown Clinic',
          description: clinic.description || '',
          address: clinic.address || '',
          city: clinic.city || '',
          state: clinic.state || '',
          country: clinic.country || '',
          postal_code: clinic.postal_code || '',
          phone: clinic.phone || '',
          email: clinic.email || '',
          website: clinic.website || '',
          logo_url: clinic.logo_url || '',
          banner_url: clinic.banner_url || '',
          emergency_contact: clinic.emergency_contact || '',
          emergency_phone: clinic.emergency_phone || '',
          services: Array.isArray(clinic.services) ? clinic.services : [],
          specializations: Array.isArray(clinic.specializations) ? clinic.specializations : [],
          operating_hours: clinic.operating_hours || {},
          operatingHours: Array.isArray(clinic.operatingHours) ? clinic.operatingHours : [],
          staff: Array.isArray(clinic.staff) ? clinic.staff : [],
          photos: Array.isArray(clinic.photos) ? clinic.photos : [],
          reviews: Array.isArray(clinic.reviews) ? clinic.reviews : [],
          rating: typeof clinic.rating === 'number' ? clinic.rating : 0,
          totalReviews: typeof clinic.totalReviews === 'number' ? clinic.totalReviews : 0,
          is_active: clinic.is_active ?? true,
          facebook_url: clinic.facebook_url || '',
          twitter_url: clinic.twitter_url || '',
          instagram_url: clinic.instagram_url || '',
          linkedin_url: clinic.linkedin_url || '',
          youtube_url: clinic.youtube_url || '',
          tiktok_url: clinic.tiktok_url || '',
          createdAt: clinic.createdAt || new Date().toISOString(),
          updatedAt: clinic.updatedAt || new Date().toISOString(),
        };
      });
  },

  /**
   * Normalize a single clinic
   */
  normalizeClinic: (clinic: Clinic | null | undefined): Clinic | null => {
    if (!clinic || typeof clinic !== 'object' || !clinic.id) {
      return null;
    }

    const normalized = ClinicsDataService.normalizeClinics([clinic]);
    return normalized.length > 0 ? normalized[0] : null;
  },

  /**
   * Validate clinic data before submission
   */
  validateClinicData: (
    data: Partial<Clinic>
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim() === '') {
      errors.name = 'Clinic name is required';
    }

    if (!data.address || data.address.trim() === '') {
      errors.address = 'Address is required';
    }

    if (!data.city || data.city.trim() === '') {
      errors.city = 'City is required';
    }

    if (!data.country || data.country.trim() === '') {
      errors.country = 'Country is required';
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    }

    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Format clinic display name with location
   */
  formatClinicDisplayName: (clinic: Clinic): string => {
    return `${clinic.name} - ${clinic.city}, ${clinic.country}`;
  },

  /**
   * Calculate clinic rating summary
   */
  getClinicRatingSummary: (
    clinic: Clinic
  ): {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  } => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (clinic.reviews && Array.isArray(clinic.reviews)) {
      clinic.reviews.forEach(review => {
        const rating = Math.round(review.rating);
        if (rating >= 1 && rating <= 5) {
          distribution[rating]++;
        }
      });
    }

    return {
      averageRating: clinic.rating || 0,
      totalReviews: clinic.totalReviews || 0,
      ratingDistribution: distribution,
    };
  },

  /**
   * Check if clinic has social media presence
   */
  hasSocialMediaLinks: (clinic: Clinic): boolean => {
    return !!(
      clinic.facebook_url ||
      clinic.twitter_url ||
      clinic.instagram_url ||
      clinic.linkedin_url ||
      clinic.youtube_url ||
      clinic.tiktok_url
    );
  },

  /**
   * Get clinic operating status for a specific day
   */
  getOperatingStatusForDay: (
    clinic: Clinic,
    dayOfWeek: number
  ): { isOpen: boolean; openTime?: string; closeTime?: string } => {
    const dayOperatingHours = clinic.operatingHours?.find(oh => oh.dayOfWeek === dayOfWeek);

    if (!dayOperatingHours) {
      return { isOpen: false };
    }

    return {
      isOpen: !dayOperatingHours.isClosed,
      openTime: dayOperatingHours.openTime,
      closeTime: dayOperatingHours.closeTime,
    };
  },

  /**
   * Check if clinic is currently open
   */
  isCurrentlyOpen: (clinic: Clinic): boolean => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const status = ClinicsDataService.getOperatingStatusForDay(clinic, dayOfWeek);

    if (!status.isOpen || !status.openTime || !status.closeTime) {
      return false;
    }

    return currentTime >= status.openTime && currentTime <= status.closeTime;
  },
};
