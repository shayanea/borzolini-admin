/**
 * Users Data Service
 * Handles user data normalization and validation
 */

import type { User } from '@/types';

export const UsersDataService = {
  /**
   * Normalize users data ensuring all required fields have valid values
   */
  normalizeUsers: (users: User[]): User[] => {
    if (!Array.isArray(users)) {
      console.error('normalizeUsers received non-array data:', users);
      return [];
    }

    return users
      .filter(user => user && typeof user === 'object' && user.id)
      .map(user => {
        // Log any problematic users for debugging
        const isNotValid = !user.email || !user.firstName || !user.lastName;
        if (isNotValid) {
          console.warn('User missing required fields, applying defaults:', user);
        }

        return {
          ...user,
          email: user.email || '',
          phone: user.phone || '',
          firstName: user.firstName || 'Unknown',
          lastName: user.lastName || 'User',
          passwordHash: user.passwordHash || '',
          role: user.role || 'admin',
          avatar: user.avatar || '',
          dateOfBirth: user.dateOfBirth || '',
          address: user.address || '',
          city: user.city || '',
          postalCode: user.postalCode || '',
          country: user.country || '',
          preferredLanguage: user.preferredLanguage || 'en',
          timezone: user.timezone || 'UTC',
          gender: user.gender || '',
          emergencyContactName: user.emergencyContactName || '',
          emergencyContactPhone: user.emergencyContactPhone || '',
          emergencyContactRelationship: user.emergencyContactRelationship || '',
          medicalHistory: user.medicalHistory || '',
          allergies: user.allergies || '',
          medications: user.medications || '',
          insuranceProvider: user.insuranceProvider || '',
          insurancePolicyNumber: user.insurancePolicyNumber || '',
          insuranceGroupNumber: user.insuranceGroupNumber || '',
          insuranceExpiryDate: user.insuranceExpiryDate || '',
          notes: user.notes || '',
          isEmailVerified: user.isEmailVerified ?? false,
          isPhoneVerified: user.isPhoneVerified ?? false,
          isActive: user.isActive ?? true,
          refreshToken: user.refreshToken || '',
          refreshTokenExpiresAt: user.refreshTokenExpiresAt || '',
          emailVerificationToken: user.emailVerificationToken || '',
          emailVerificationExpiresAt: user.emailVerificationExpiresAt || '',
          phoneVerificationOTP: user.phoneVerificationOTP || '',
          phoneVerificationExpiresAt: user.phoneVerificationExpiresAt || '',
          passwordResetToken: user.passwordResetToken || '',
          passwordResetExpiresAt: user.passwordResetExpiresAt || '',
          passwordUpdatedAt: user.passwordUpdatedAt || '',
          loginAttempts: user.loginAttempts ?? 0,
          lockedUntil: user.lockedUntil || '',
          lastLoginAt: user.lastLoginAt || '',
          profileCompletionPercentage: user.profileCompletionPercentage ?? 0,
          profileCompletion: user.profileCompletion ?? 0,
          accountStatus: user.accountStatus || 'active',
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
        };
      });
  },

  /**
   * Normalize a single user
   */
  normalizeUser: (user: User | null | undefined): User | null => {
    const isNotValid = !user || typeof user !== 'object' || !user.id;
    if (isNotValid) {
      return null;
    }

    const normalized = UsersDataService.normalizeUsers([user]);
    return normalized.length > 0 ? normalized[0] : null;
  },

  /**
   * Validate user data before submission
   */
  validateUserData: (data: Partial<User>): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (!data.firstName || data.firstName.trim() === '') {
      errors.firstName = 'First name is required';
    }

    if (!data.lastName || data.lastName.trim() === '') {
      errors.lastName = 'Last name is required';
    }

    if (!data.role) {
      errors.role = 'Role is required';
    }

    if (data.phone && !/^\+?[1-9]\d{1,14}$/.test(data.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Invalid phone number format';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Format user display name
   */
  formatUserDisplayName: (user: User): string => {
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  },

  /**
   * Get user initials for avatar
   */
  getUserInitials: (user: User): string => {
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || user.email?.charAt(0)?.toUpperCase() || '?';
  },

  /**
   * Check if user profile is complete
   */
  isProfileComplete: (user: User, requiredFields: string[] = []): boolean => {
    const defaultRequiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'address',
      'city',
      'country',
    ];

    const fieldsToCheck = requiredFields.length > 0 ? requiredFields : defaultRequiredFields;

    return fieldsToCheck.every(field => {
      const value = user[field as keyof User];
      return value !== undefined && value !== null && value !== '';
    });
  },

  /**
   * Calculate profile completion percentage
   */
  calculateProfileCompletion: (user: User): number => {
    const fields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'address',
      'city',
      'postalCode',
      'country',
      'avatar',
      'emergencyContactName',
      'emergencyContactPhone',
    ];

    const completedFields = fields.filter(field => {
      const value = user[field as keyof User];
      return value !== undefined && value !== null && value !== '';
    });

    return Math.round((completedFields.length / fields.length) * 100);
  },

  /**
   * Check if user account is locked
   */
  isAccountLocked: (user: User): boolean => {
    if (!user.lockedUntil) return false;

    const lockedUntilDate = new Date(user.lockedUntil);
    const now = new Date();

    return lockedUntilDate > now;
  },

  /**
   * Get user's age from date of birth
   */
  calculateUserAge: (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const isNotValid = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate());

    if (isNotValid) {
      age--;
    }

    return age;
  },

  /**
   * Check if user has insurance
   */
  hasInsurance: (user: User): boolean => {
    return !!(user.insuranceProvider && user.insurancePolicyNumber && user.insuranceExpiryDate);
  },

  /**
   * Check if insurance is expired
   */
  isInsuranceExpired: (user: User): boolean => {
    if (!user.insuranceExpiryDate) return false;

    const expiryDate = new Date(user.insuranceExpiryDate);
    const today = new Date();

    return expiryDate < today;
  },
};
