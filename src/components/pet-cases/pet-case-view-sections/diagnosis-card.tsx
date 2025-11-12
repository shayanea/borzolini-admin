/**
 * Diagnosis & Treatment Card for Pet Case View Modal
 */

import type { ClinicPetCase } from '@/types/pet-cases';
import { Card } from 'antd';
import { FC } from 'react';

interface DiagnosisCardProps {
  caseData: ClinicPetCase;
}

export const DiagnosisCard: FC<DiagnosisCardProps> = ({ caseData }) => {
  return (
    <Card title='Diagnosis & Treatment' size='small'>
      <div className='space-y-4'>
        {caseData.diagnosis && (
          <div>
            <h4 className='font-medium text-gray-900 mb-2'>Diagnosis</h4>
            <p className='text-gray-700'>{caseData.diagnosis}</p>
          </div>
        )}

        {caseData.treatment_plan && (
          <div>
            <h4 className='font-medium text-gray-900 mb-2'>Treatment Plan</h4>
            <div className='space-y-3'>
              {caseData.treatment_plan.medications &&
                caseData.treatment_plan.medications.length > 0 && (
                  <div>
                    <h5 className='text-sm font-medium text-gray-800 mb-1'>Medications</h5>
                    <div className='space-y-1'>
                      {caseData.treatment_plan.medications.map((med, index) => (
                        <div key={index} className='bg-blue-50 p-2 rounded text-sm'>
                          <strong>{med.name}</strong> - {med.dosage}, {med.frequency}
                          {med.instructions && (
                            <div className='text-gray-600 mt-1'>{med.instructions}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {caseData.treatment_plan.procedures &&
                caseData.treatment_plan.procedures.length > 0 && (
                  <div>
                    <h5 className='text-sm font-medium text-gray-800 mb-1'>Procedures</h5>
                    <ul className='list-disc list-inside text-sm text-gray-700'>
                      {caseData.treatment_plan.procedures.map((procedure, index) => (
                        <li key={index}>{procedure}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {caseData.treatment_plan.follow_up_instructions && (
                <div>
                  <h5 className='text-sm font-medium text-gray-800 mb-1'>Follow-up Instructions</h5>
                  <p className='text-sm text-gray-700'>
                    {caseData.treatment_plan.follow_up_instructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {caseData.notes && (
          <div>
            <h4 className='font-medium text-gray-900 mb-2'>Additional Notes</h4>
            <p className='text-gray-700'>{caseData.notes}</p>
          </div>
        )}

        {caseData.resolution_notes && (
          <div>
            <h4 className='font-medium text-gray-900 mb-2'>Resolution Notes</h4>
            <p className='text-gray-700'>{caseData.resolution_notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
