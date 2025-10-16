/**
 * Vital Signs Card for Pet Case View Modal
 */

import { EmptyStateVariants } from '@/components/common';
import type { ClinicPetCase } from '@/types/pet-cases';
import { Card, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';

interface VitalSignsCardProps {
  caseData: ClinicPetCase;
}

export const VitalSignsCard: FC<VitalSignsCardProps> = ({ caseData }) => {
  return (
    <Card title='Vital Signs' size='small'>
      {caseData.vital_signs ? (
        <Descriptions size='small' column={2}>
          {caseData.vital_signs.temperature && (
            <Descriptions.Item label='Temperature'>
              {caseData.vital_signs.temperature}°F
            </Descriptions.Item>
          )}
          {caseData.vital_signs.heart_rate && (
            <Descriptions.Item label='Heart Rate'>
              {caseData.vital_signs.heart_rate} bpm
            </Descriptions.Item>
          )}
          {caseData.vital_signs.respiratory_rate && (
            <Descriptions.Item label='Respiratory Rate'>
              {caseData.vital_signs.respiratory_rate} breaths/min
            </Descriptions.Item>
          )}
          {caseData.vital_signs.weight && (
            <Descriptions.Item label='Weight'>{caseData.vital_signs.weight} lbs</Descriptions.Item>
          )}
          {caseData.vital_signs.blood_pressure && (
            <Descriptions.Item label='Blood Pressure'>
              {caseData.vital_signs.blood_pressure.systolic}/
              {caseData.vital_signs.blood_pressure.diastolic}
            </Descriptions.Item>
          )}
          {caseData.vital_signs.recorded_at && (
            <Descriptions.Item label='Recorded At'>
              {dayjs(caseData.vital_signs.recorded_at).format('MMM DD, YYYY HH:mm')}
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <EmptyStateVariants.NoVitalSigns size='small' />
      )}
    </Card>
  );
};
