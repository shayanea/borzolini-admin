import { BaseModal } from '@/components/common';
import { Alert, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import {
	AppointmentInfoCard,
	ClinicStaffInfoCard,
	MedicalInfoCard,
	PetOwnerInfoCard,
} from './appointment-view-sections';

import { APPOINTMENT_TYPE_LABELS } from '@/constants/appointments';
import type { Appointment } from '@/types';
import { formatAppointmentType } from '@/utils/color-helpers';
import { SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AppointmentReviewsSection } from './appointment-reviews-section';

export interface AppointmentViewModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onCancel: () => void;
  onUpdate?: (id: string, updates: Partial<Appointment>) => Promise<void>;
  loading?: boolean;
}

export function AppointmentViewModal({
  visible,
  appointment,
  onCancel,
  onUpdate,
}: AppointmentViewModalProps) {
  const { t } = useTranslation('components');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Appointment>>({});
  const [saving, setSaving] = useState(false);

  // MOCK: Inject flags for demonstration purposes since backend doesn't support them yet
  // We'll deterministically assign flags based on ID length or char code to be consistent
  const getMockFlags = (id?: string) => {
    if (!id) return [];
    const flags: string[] = [];
    if (id.charCodeAt(0) % 2 === 0) flags.push('payment_issue');
    if (id.charCodeAt(id.length - 1) % 3 === 0) flags.push('aggressive');
    if (id.length % 5 === 0) flags.push('sms_only');
    return flags;
  };

  const displayAppointment = appointment
    ? {
        ...appointment,
        pet: appointment.pet
          ? {
              ...appointment.pet,
              flags: appointment.pet.flags || getMockFlags(appointment.pet.id),
            }
          : undefined,
      }
    : null;

  // Initialize edited data when appointment changes
  useEffect(() => {
    if (displayAppointment) {
      setEditedData({
        status: displayAppointment.status,
        priority: displayAppointment.priority,
        notes: displayAppointment.notes,
        reason: displayAppointment.reason,
        symptoms: displayAppointment.symptoms,
        diagnosis: displayAppointment.diagnosis,
        treatment_plan: displayAppointment.treatment_plan,
        follow_up_instructions: displayAppointment.follow_up_instructions,
      });
    }
  }, [displayAppointment]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!displayAppointment || !onUpdate) return;

    try {
      setSaving(true);
      await onUpdate(displayAppointment.id, editedData);
      setIsEditing(false);
      message.success(t('modals.appointmentView.appointmentUpdatedSuccess'));
    } catch (error) {
      message.error(t('modals.appointmentView.appointmentUpdateFailed'));
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset edited data to original values
    if (displayAppointment) {
      setEditedData({
        status: displayAppointment.status,
        priority: displayAppointment.priority,
        notes: displayAppointment.notes,
        reason: displayAppointment.reason,
        symptoms: displayAppointment.symptoms,
        diagnosis: displayAppointment.diagnosis,
        treatment_plan: displayAppointment.treatment_plan,
        follow_up_instructions: displayAppointment.follow_up_instructions,
      });
    }
  };

  const getFormattedType = (type: string) => {
    if (!type) return t('modals.appointmentView.unknown');
    return (
      APPOINTMENT_TYPE_LABELS[type as keyof typeof APPOINTMENT_TYPE_LABELS] ||
      formatAppointmentType(type)
    );
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  if (!displayAppointment) return null;

  const hasAggressiveFlag = displayAppointment.pet?.flags?.includes('aggressive');

  return (
    <BaseModal
      title={t('modals.appointmentView.title')}
      open={visible}
      onCancel={onCancel}
      onOk={isEditing ? handleSave : onCancel}
      footer={null}
      width={900}
      destroyOnHidden
    >
      <div className='space-y-6'>
        {/* Alerts for flagged patients */}
        {hasAggressiveFlag && (
          <Alert
            message='⚠️ ALERT: Aggressive Pet'
            description='This patient has been flagged as aggressive. Please handle with care and check safety protocols before proceeding.'
            type='error'
            showIcon
            className='mb-4 border-red-200 bg-red-50'
          />
        )}

        {/* Pet & Owner Information */}
        <PetOwnerInfoCard appointment={displayAppointment} />

        {/* Appointment Information */}
        <AppointmentInfoCard
          appointment={displayAppointment}
          isEditing={isEditing}
          editedData={editedData}
          onFieldChange={handleFieldChange}
          getFormattedType={getFormattedType}
        />

        {/* Clinic & Staff Information */}
        <ClinicStaffInfoCard appointment={displayAppointment} />

        {/* Medical Information */}
        <MedicalInfoCard
          appointment={displayAppointment}
          isEditing={isEditing}
          editedData={editedData}
          onFieldChange={handleFieldChange}
        />

        {/* Reviews Section - Only show for completed appointments */}
        {displayAppointment.status === 'completed' && (
          <AppointmentReviewsSection
            appointmentId={displayAppointment.id}
            appointmentType={displayAppointment.appointment_type}
            isHomeVisit={displayAppointment.is_home_visit}
            onViewReview={reviewId => {
              // You could implement a review details modal here
              console.log('View review:', reviewId);
            }}
          />
        )}

        {/* Action Buttons */}
        <div className='flex justify-end space-x-2 pt-4 border-t'>
          {!isEditing ? (
            <>
              <Button onClick={onCancel}>{t('modals.appointmentView.close')}</Button>
              {onUpdate && (
                <Button type='primary' onClick={handleEdit}>
                  {t('modals.appointmentView.editCriticalFields')}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={handleCancel}>{t('modals.appointmentView.cancel')}</Button>
              <Button
                type='primary'
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
                className='bg-primary-navy border-primary-navy'
              >
                {t('modals.appointmentView.saveChanges')}
              </Button>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

export default AppointmentViewModal;
