import {
  AppointmentInfoCard,
  ClinicStaffInfoCard,
  MedicalInfoCard,
  PetOwnerInfoCard,
} from './appointment-view-sections';
import { Button, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { APPOINTMENT_TYPE_LABELS } from '@/constants/appointments';
import type { Appointment } from '@/types';
import { AppointmentReviewsSection } from './appointment-reviews-section';
import { SaveOutlined } from '@ant-design/icons';
import { formatAppointmentType } from '@/utils/color-helpers';
import { useTranslation } from 'react-i18next';

export interface AppointmentViewModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onCancel: () => void;
  onUpdate?: (id: string, updates: Partial<Appointment>) => Promise<void>;
  loading?: boolean;
}

export const AppointmentViewModal: React.FC<AppointmentViewModalProps> = ({
  visible,
  appointment,
  onCancel,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Appointment>>({});
  const [saving, setSaving] = useState(false);

  // Initialize edited data when appointment changes
  useEffect(() => {
    if (appointment) {
      setEditedData({
        status: appointment.status,
        priority: appointment.priority,
        notes: appointment.notes,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        diagnosis: appointment.diagnosis,
        treatment_plan: appointment.treatment_plan,
        follow_up_instructions: appointment.follow_up_instructions,
      });
    }
  }, [appointment]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!appointment || !onUpdate) return;

    try {
      setSaving(true);
      await onUpdate(appointment.id, editedData);
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
    if (appointment) {
      setEditedData({
        status: appointment.status,
        priority: appointment.priority,
        notes: appointment.notes,
        reason: appointment.reason,
        symptoms: appointment.symptoms,
        diagnosis: appointment.diagnosis,
        treatment_plan: appointment.treatment_plan,
        follow_up_instructions: appointment.follow_up_instructions,
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

  if (!appointment) return null;

  return (
    <Modal
      title={t('modals.appointmentView.title')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      destroyOnHidden
    >
      <div className='space-y-6'>
        {/* Pet & Owner Information */}
        <PetOwnerInfoCard appointment={appointment} />

        {/* Appointment Information */}
        <AppointmentInfoCard
          appointment={appointment}
          isEditing={isEditing}
          editedData={editedData}
          onFieldChange={handleFieldChange}
          getFormattedType={getFormattedType}
        />

        {/* Clinic & Staff Information */}
        <ClinicStaffInfoCard appointment={appointment} />

        {/* Medical Information */}
        <MedicalInfoCard
          appointment={appointment}
          isEditing={isEditing}
          editedData={editedData}
          onFieldChange={handleFieldChange}
        />

        {/* Reviews Section - Only show for completed appointments */}
        {appointment.status === 'completed' && (
          <AppointmentReviewsSection
            appointmentId={appointment.id}
            appointmentType={appointment.appointment_type}
            isHomeVisit={appointment.is_home_visit}
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
    </Modal>
  );
};

export default AppointmentViewModal;
