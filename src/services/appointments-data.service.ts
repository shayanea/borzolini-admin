/**
 * Appointments Data Service
 * Handles data normalization and validation for appointments
 */

import type { Appointment } from '@/types';

/**
 * Normalize and validate appointment data
 * Ensures all required fields have default values
 */
export const normalizeAppointment = (appointment: Appointment): Appointment => {
  if (!appointment || typeof appointment !== 'object' || !appointment.id) {
    console.warn('Invalid appointment data:', appointment);
    // Return a minimal valid appointment object
    return {
      id: appointment?.id || '',
      priority: 'normal',
      status: 'pending',
      appointment_type: 'consultation',
      scheduled_date: new Date().toISOString(),
      duration_minutes: 30,
      notes: '',
      reason: '',
      symptoms: '',
      diagnosis: '',
      treatment_plan: '',
      prescriptions: [],
      follow_up_instructions: '',
      cost: 0,
      payment_status: 'pending',
      is_telemedicine: false,
      telemedicine_link: '',
      home_visit_address: '',
      is_home_visit: false,
      reminder_settings: {},
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: '',
      pet_id: '',
      clinic_id: '',
      staff_id: '',
      service_id: '',
    } as Appointment;
  }

  // Normalize appointment data with defaults
  return {
    ...appointment,
    priority: appointment.priority || 'normal',
    status: appointment.status || 'pending',
    appointment_type: appointment.appointment_type || 'consultation',
    scheduled_date: appointment.scheduled_date || new Date().toISOString(),
    duration_minutes: appointment.duration_minutes || 30,
    notes: appointment.notes || '',
    reason: appointment.reason || '',
    symptoms: appointment.symptoms || '',
    diagnosis: appointment.diagnosis || '',
    treatment_plan: appointment.treatment_plan || '',
    prescriptions: appointment.prescriptions || [],
    follow_up_instructions: appointment.follow_up_instructions || '',
    cost: appointment.cost || 0,
    payment_status: appointment.payment_status || 'pending',
    is_telemedicine: appointment.is_telemedicine || false,
    telemedicine_link: appointment.telemedicine_link || '',
    home_visit_address: appointment.home_visit_address || '',
    is_home_visit: appointment.is_home_visit || false,
    reminder_settings: appointment.reminder_settings || {},
    is_active: appointment.is_active ?? true,
    created_at: appointment.created_at || new Date().toISOString(),
    updated_at: appointment.updated_at || new Date().toISOString(),
    owner_id: appointment.owner_id || '',
    pet_id: appointment.pet_id || '',
    clinic_id: appointment.clinic_id || '',
    staff_id: appointment.staff_id || '',
    service_id: appointment.service_id || '',
  };
};

/**
 * Normalize an array of appointments
 * Filters out invalid appointments and normalizes valid ones
 */
export const normalizeAppointments = (appointments: any[]): Appointment[] => {
  if (!Array.isArray(appointments)) {
    console.error('Invalid appointments array:', appointments);
    return [];
  }

  return appointments
    .filter(appointment => {
      // Filter out completely invalid appointments
      if (!appointment || typeof appointment !== 'object') {
        return false;
      }
      if (!appointment.id) {
        console.warn('Appointment missing ID:', appointment);
        return false;
      }
      return true;
    })
    .map(appointment => {
      // Log warnings for appointments missing critical fields
      if (!appointment.priority || !appointment.status || !appointment.appointment_type) {
        console.warn('Appointment missing required fields:', {
          id: appointment.id,
          priority: appointment.priority,
          status: appointment.status,
          type: appointment.appointment_type,
        });
      }

      return normalizeAppointment(appointment);
    });
};

/**
 * Validate appointment data before sending to API
 */
export const validateAppointmentData = (data: Partial<Appointment>): boolean => {
  // Check required fields
  const requiredFields = ['pet_id', 'clinic_id', 'scheduled_date', 'appointment_type'];

  for (const field of requiredFields) {
    if (!data[field as keyof Appointment]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  return true;
};

/**
 * Appointments Data Service
 */
export const AppointmentsDataService = {
  normalizeAppointment,
  normalizeAppointments,
  validateAppointmentData,
};

export default AppointmentsDataService;
