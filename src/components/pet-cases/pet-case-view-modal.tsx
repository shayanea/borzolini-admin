// Pet Case View Modal Component
import { Button, Divider, Modal, Tabs } from 'antd';
import React, { useState } from 'react';
import type { ClinicPetCase } from '../../types/pet-cases';
import PetCaseTimeline from './pet-case-timeline';
import {
  BasicInfoCard,
  DiagnosisCard,
  OwnerInfoCard,
  PetInfoCard,
  SymptomsCard,
  VeterinarianInfoCard,
  VitalSignsCard,
} from './pet-case-view-sections';

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
            <BasicInfoCard caseData={caseData} />
            <Divider />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <PetInfoCard caseData={caseData} />
              <OwnerInfoCard caseData={caseData} />
              <VeterinarianInfoCard caseData={caseData} />
            </div>
          </div>
        </TabPane>

        <TabPane tab='Medical Details' key='medical'>
          <div className='space-y-6'>
            <SymptomsCard caseData={caseData} />
            <VitalSignsCard caseData={caseData} />
            <DiagnosisCard caseData={caseData} />
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
