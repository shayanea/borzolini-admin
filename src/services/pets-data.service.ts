/**
 * Pets Data Service
 * Handles pet data normalization and validation
 */

import type { Pet } from './pets.service';

export const PetsDataService = {
  /**
   * Normalize pets data ensuring all required fields have valid values
   */
  normalizePets: (pets: Pet[]): Pet[] => {
    if (!Array.isArray(pets)) {
      console.error('normalizePets received non-array data:', pets);
      return [];
    }

    return pets
      .filter(pet => pet && typeof pet === 'object' && pet.id)
      .map(pet => {
        // Log any problematic pets for debugging
        if (!pet.name || !pet.species || !pet.gender) {
          console.warn('Pet missing required fields, applying defaults:', pet);
        }

        return {
          ...pet,
          name: pet.name || 'Unknown',
          species: pet.species || 'other',
          breed: pet.breed || '',
          gender: pet.gender || 'male',
          date_of_birth: pet.date_of_birth || new Date().toISOString(),
          weight: pet.weight || '0',
          size: pet.size || 'medium',
          color: pet.color || '',
          microchip_number: pet.microchip_number || '',
          is_spayed_neutered: pet.is_spayed_neutered ?? false,
          is_vaccinated: pet.is_vaccinated ?? false,
          medical_history: pet.medical_history || '',
          behavioral_notes: pet.behavioral_notes || '',
          dietary_requirements: pet.dietary_requirements || '',
          allergies: Array.isArray(pet.allergies) ? pet.allergies : [],
          medications: Array.isArray(pet.medications) ? pet.medications : [],
          emergency_contact: pet.emergency_contact || '',
          emergency_phone: pet.emergency_phone || '',
          photo_url: pet.photo_url || '',
          is_active: pet.is_active ?? true,
          created_at: pet.created_at || new Date().toISOString(),
          updated_at: pet.updated_at || new Date().toISOString(),
          owner_id: pet.owner_id || '',
          owner: pet.owner || {
            id: '',
            email: '',
            phone: '',
            firstName: 'Unknown',
            lastName: 'Owner',
            passwordHash: '',
            role: 'admin',
            avatar: '',
            dateOfBirth: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
            preferredLanguage: 'en',
            timezone: 'UTC',
            gender: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelationship: '',
            medicalHistory: '',
            allergies: '',
            medications: '',
            isEmailVerified: false,
            isPhoneVerified: false,
            isActive: false,
            loginAttempts: 0,
            profileCompletionPercentage: 0,
            accountStatus: 'inactive',
            createdAt: '',
            updatedAt: '',
          },
        };
      });
  },

  /**
   * Normalize a single pet
   */
  normalizePet: (pet: Pet | null | undefined): Pet | null => {
    if (!pet || typeof pet !== 'object' || !pet.id) {
      return null;
    }

    const normalized = PetsDataService.normalizePets([pet]);
    return normalized.length > 0 ? normalized[0] : null;
  },

  /**
   * Validate pet data before submission
   */
  validatePetData: (data: Partial<Pet>): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim() === '') {
      errors.name = 'Pet name is required';
    }

    if (!data.species) {
      errors.species = 'Species is required';
    }

    if (!data.gender) {
      errors.gender = 'Gender is required';
    }

    if (!data.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required';
    }

    if (!data.size) {
      errors.size = 'Size is required';
    }

    if (!data.emergency_contact || data.emergency_contact.trim() === '') {
      errors.emergency_contact = 'Emergency contact is required';
    }

    if (!data.emergency_phone || data.emergency_phone.trim() === '') {
      errors.emergency_phone = 'Emergency phone is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Calculate pet age from date of birth
   */
  calculateAge: (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  },

  /**
   * Format pet display name (Name - Species)
   */
  formatPetDisplayName: (pet: Pet): string => {
    return `${pet.name} - ${pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}`;
  },

  /**
   * Check if pet requires vaccination update
   */
  needsVaccinationUpdate: (pet: Pet, monthsThreshold: number = 12): boolean => {
    if (!pet.is_vaccinated || !pet.updated_at) return true;

    const lastUpdate = new Date(pet.updated_at);
    const today = new Date();
    const monthsSinceUpdate = (today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    return monthsSinceUpdate >= monthsThreshold;
  },
};
