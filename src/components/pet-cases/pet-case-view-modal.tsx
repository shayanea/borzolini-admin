// Pet Case View Modal Component
import {
  AlertOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions, Divider, Modal, Space, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { PetCasesService } from '../../services/pet-cases.service';
import { ClinicPetCase } from '../../types/pet-cases';
import PetCaseTimeline from './pet-case-timeline';

const { TabPane } = Tabs;

interface PetCaseViewModalProps {
  caseData: ClinicPetCase | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (caseData: ClinicPetCase) => void;
  clinicId: string;
}

const PetCaseViewModal: React.FC<PetCaseViewModalProps> = ({
  caseData,
  visible,
  onClose,
  onEdit,
  clinicId,
}) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!caseData) return null;

  const getStatusColor = (status: string) => PetCasesService.getStatusColor(status);
  const getPriorityColor = (priority: string) => PetCasesService.getPriorityColor(priority);
  const getStatusLabel = (status: string) => PetCasesService.getStatusLabel(status);
  const getPriorityLabel = (priority: string) => PetCasesService.getPriorityLabel(priority);
  const calculateDaysOpen = (createdAt: string) => PetCasesService.calculateDaysOpen(createdAt);

  const renderBasicInfo = () => (
    <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
      <Descriptions.Item label='Case Number'>
        <span className='font-mono font-medium'>{caseData.case_number}</span>
      </Descriptions.Item>

      <Descriptions.Item label='Status'>
        <Tag color={getStatusColor(caseData.status)}>{getStatusLabel(caseData.status)}</Tag>
      </Descriptions.Item>

      <Descriptions.Item label='Priority'>
        <Tag color={getPriorityColor(caseData.priority)}>{getPriorityLabel(caseData.priority)}</Tag>
      </Descriptions.Item>

      <Descriptions.Item label='Case Type'>
        <Tag color='blue'>{caseData.case_type.replace('_', ' ').toUpperCase()}</Tag>
      </Descriptions.Item>

      <Descriptions.Item label='Created'>
        {dayjs(caseData.created_at).format('MMM DD, YYYY HH:mm')}
      </Descriptions.Item>

      <Descriptions.Item label='Days Open'>
        <Space>
          <ClockCircleOutlined />
          <span>{calculateDaysOpen(caseData.created_at)} days</span>
        </Space>
      </Descriptions.Item>

      {caseData.resolved_at && (
        <Descriptions.Item label='Resolved At'>
          {dayjs(caseData.resolved_at).format('MMM DD, YYYY HH:mm')}
        </Descriptions.Item>
      )}

      {caseData.closed_at && (
        <Descriptions.Item label='Closed At'>
          {dayjs(caseData.closed_at).format('MMM DD, YYYY HH:mm')}
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  const renderPetInfo = () => (
    <Card title='Pet Information' size='small'>
      <div className='flex items-center space-x-4 mb-4'>
        <Avatar src={caseData.pet?.photo_url} icon={<HeartOutlined />} size={64} />
        <div>
          <h3 className='text-lg font-medium'>{caseData.pet?.name || 'Unknown Pet'}</h3>
          <p className='text-gray-600'>
            {caseData.pet?.species} {caseData.pet?.breed ? `• ${caseData.pet?.breed}` : ''}
          </p>
          {caseData.pet?.age && (
            <p className='text-sm text-gray-500'>Age: {caseData.pet.age} years old</p>
          )}
          {caseData.pet?.gender && (
            <p className='text-sm text-gray-500'>Gender: {caseData.pet.gender}</p>
          )}
        </div>
      </div>

      <Descriptions size='small' column={2}>
        <Descriptions.Item label='Weight'>
          {caseData.pet?.weight ? `${caseData.pet.weight} lbs` : 'Not specified'}
        </Descriptions.Item>
        <Descriptions.Item label='Size'>
          {caseData.pet?.size ? caseData.pet.size.toUpperCase() : 'Not specified'}
        </Descriptions.Item>
        <Descriptions.Item label='Color'>
          {caseData.pet?.color || 'Not specified'}
        </Descriptions.Item>
        <Descriptions.Item label='Microchip'>
          {caseData.pet?.microchip_number || 'Not specified'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  const renderOwnerInfo = () => (
    <Card title='Owner Information' size='small'>
      <div className='flex items-center space-x-4 mb-4'>
        <Avatar icon={<UserOutlined />} size={48} />
        <div>
          <h3 className='text-lg font-medium'>
            {caseData.owner?.firstName} {caseData.owner?.lastName}
          </h3>
          <p className='text-gray-600'>{caseData.owner?.email}</p>
          {caseData.owner?.phone && <p className='text-sm text-gray-500'>{caseData.owner.phone}</p>}
        </div>
      </div>
    </Card>
  );

  const renderVetInfo = () => (
    <Card title='Veterinarian' size='small'>
      {caseData.veterinarian ? (
        <div className='flex items-center space-x-4'>
          <Avatar icon={<UserOutlined />} size={48} />
          <div>
            <h3 className='text-lg font-medium'>
              Dr. {caseData.veterinarian.firstName} {caseData.veterinarian.lastName}
            </h3>
          </div>
        </div>
      ) : (
        <div className='text-center text-gray-500 py-4'>
          <UserOutlined className='text-2xl mb-2' />
          <p>No veterinarian assigned</p>
        </div>
      )}
    </Card>
  );

  const renderSymptoms = () => (
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

        {caseData.initial_symptoms.length === 0 && caseData.current_symptoms.length === 0 && (
          <div className='text-center text-gray-500 py-4'>
            <AlertOutlined className='text-2xl mb-2' />
            <p>No symptoms recorded</p>
          </div>
        )}
      </div>
    </Card>
  );

  const renderVitalSigns = () => (
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
        <div className='text-center text-gray-500 py-4'>
          <MedicineBoxOutlined className='text-2xl mb-2' />
          <p>No vital signs recorded</p>
        </div>
      )}
    </Card>
  );

  const renderDiagnosis = () => (
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

  return (
    <Modal
      title={
        <div className='flex items-center justify-between'>
          <span>Case Details - {caseData.case_number}</span>
          <Space>
            <Button onClick={() => onEdit(caseData)}>Edit Case</Button>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab='Overview' key='overview'>
          <div className='space-y-6'>
            {renderBasicInfo()}
            <Divider />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {renderPetInfo()}
              {renderOwnerInfo()}
              {renderVetInfo()}
            </div>
          </div>
        </TabPane>

        <TabPane tab='Medical Details' key='medical'>
          <div className='space-y-6'>
            {renderSymptoms()}
            {renderVitalSigns()}
            {renderDiagnosis()}
          </div>
        </TabPane>

        <TabPane tab='Timeline' key='timeline'>
          <PetCaseTimeline caseId={caseData.id} clinicId={clinicId} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default PetCaseViewModal;
