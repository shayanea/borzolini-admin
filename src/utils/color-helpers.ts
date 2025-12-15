/**
 * Color Helper Utilities
 * Centralized color mapping functions for consistent UI styling across the application
 */

import {
    APPOINTMENT_PRIORITY_COLORS,
    APPOINTMENT_STATUS_COLORS,
} from '@/constants/appointments';
import {
    PET_GENDER_COLORS,
    PET_SIZE_COLORS,
    PET_SPECIES_COLORS,
} from '@/constants/pets';

/**
 * Get color for pet species tag
 */
export const getPetSpeciesColor = (species: string): string => {
  return PET_SPECIES_COLORS[species.toLowerCase() as keyof typeof PET_SPECIES_COLORS] || 'default';
};

/**
 * Get color for pet gender tag
 */
export const getPetGenderColor = (gender: string): string => {
  return PET_GENDER_COLORS[gender.toLowerCase() as keyof typeof PET_GENDER_COLORS] || 'default';
};

/**
 * Get color for pet size tag
 */
export const getPetSizeColor = (size: string): string => {
  return PET_SIZE_COLORS[size.toLowerCase() as keyof typeof PET_SIZE_COLORS] || 'default';
};

/**
 * Get color for appointment status tag
 */
export const getAppointmentStatusColor = (status: string): string => {
  return APPOINTMENT_STATUS_COLORS[status as keyof typeof APPOINTMENT_STATUS_COLORS] || 'default';
};

/**
 * Get color for appointment priority tag
 */
export const getAppointmentPriorityColor = (priority: string): string => {
  return APPOINTMENT_PRIORITY_COLORS[priority as keyof typeof APPOINTMENT_PRIORITY_COLORS] || 'default';
};

/**
 * Format appointment type for display
 */
export const formatAppointmentType = (type: string): string => {
  if (!type) return 'Unknown';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Capitalize first letter of a string
 */
export const capitalizeFirst = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format enum-style string to readable label
 * Example: 'some_enum_value' -> 'Some Enum Value'
 */
export const formatEnumLabel = (value: string): string => {
  if (!value) return '';
  return value
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

/**
 * Convert Hex color to RGBA
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Get styles for dynamic tags/badges based on a base color
 */
export const getStylesForColor = (color: string) => {
    // If color is a named color (legacy fallback), return null or default styles
    if (!color.startsWith('#')) {
        return {
             backgroundColor: '#f3f4f6',
             color: '#374151',
             border: '1px solid #d1d5db'
        }
    }

    return {
        backgroundColor: hexToRgba(color, 0.15),
        color: color,
        border: `1px solid ${hexToRgba(color, 0.3)}`,
    };
};

