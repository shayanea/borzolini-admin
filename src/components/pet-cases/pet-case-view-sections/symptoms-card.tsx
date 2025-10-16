/**
 * Symptoms Card for Pet Case View Modal
 */

import { EmptyStateVariants } from '@/components/common';
import type { ClinicPetCase } from '@/types/pet-cases';
import { Card, Tag } from 'antd';
import { FC } from 'react';

interface SymptomsCardProps {
  caseData: ClinicPetCase;
}

export const SymptomsCard: FC<SymptomsCardProps> = ({ caseData }) => {
  const hasSymptoms = caseData.initial_symptoms.length > 0 || caseData.current_symptoms.length > 0;

  return (
    <Card title='Symptoms' size='small'>
      <div className='space-y-4'>
        {caseData.initial_symptoms.length > 0 && (
          <div>
            <h4 className='font-medium text-gray-900 mb-2'>Initial Symptoms</h4>
            <div className='flex flex-wrap gap-2'>
              {caseData.initial_symptoms.map((symptom, index) => (
                <Tag key={index} color='orange'>
                  {symptom}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {caseData.current_symptoms.length > 0 && (
          <div>
            <h4 className='font-medium text-gray-900 mb-2'>Current Symptoms</h4>
            <div className='flex flex-wrap gap-2'>
              {caseData.current_symptoms.map((symptom, index) => (
                <Tag key={index} color='blue'>
                  {symptom}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {!hasSymptoms && <EmptyStateVariants.NoSymptoms size='small' />}
      </div>
    </Card>
  );
};
