import {
    BasicInfoCard,
    DiagnosisCard,
    OwnerInfoCard,
    PetInfoCard,
    SymptomsCard,
    VeterinarianInfoCard,
    VitalSignsCard,
} from './pet-case-view-sections';
// Pet Case View Modal Component
import { BaseModal } from '@/components/common';
import { Button, Divider, Space, Tabs } from 'antd';
import { useState } from 'react';

import type { ClinicPetCase } from '../../types/pet-cases';
import PetCaseTimeline from './pet-case-timeline';

const { TabPane } = Tabs;

interface PetCaseViewModalProps {
  caseData: ClinicPetCase | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (caseData: ClinicPetCase) => void;
  clinicId: string;
}

function PetCaseViewModal({
  caseData,
  visible,
  onClose,
  onEdit,
  clinicId,
}: PetCaseViewModalProps) {
  const [activeTab, setActiveTab] = useState('details');

  if (!caseData) return null;

  return (
    <BaseModal
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
      onOk={onClose}
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
    </BaseModal>
  );
}

export { PetCaseViewModal };
export default PetCaseViewModal;
