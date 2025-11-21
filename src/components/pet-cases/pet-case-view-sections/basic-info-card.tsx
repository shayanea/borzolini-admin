/**
 * Basic Info Card for Pet Case View Modal
 */

import { PetCasesService } from '@/services/pet-cases';
import type { ClinicPetCase } from '@/types/pet-cases';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Descriptions, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';

interface BasicInfoCardProps {
  caseData: ClinicPetCase;
}

export const BasicInfoCard: FC<BasicInfoCardProps> = ({ caseData }) => {
  const getStatusColor = (status: string) => PetCasesService.getStatusColor(status);
  const getPriorityColor = (priority: string) => PetCasesService.getPriorityColor(priority);
  const getStatusLabel = (status: string) => PetCasesService.getStatusLabel(status);
  const getPriorityLabel = (priority: string) => PetCasesService.getPriorityLabel(priority);
  const calculateDaysOpen = (createdAt: string) => PetCasesService.calculateDaysOpen(createdAt);

  return (
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
};
