import { Avatar, Button, Dropdown, Space, Table, Tag, Tooltip } from 'antd';
// Pet Cases Table Component
import {
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  HeartOutlined,
  MoreOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

import { ClinicPetCase } from '../../types/pet-cases';
import { PetCasesService } from '../../services/pet-cases/pet-cases.service';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface PetCasesTableProps {
  cases: ClinicPetCase[];
  loading: boolean;
  onViewCase: (caseData: ClinicPetCase) => void;
  onEditCase: (caseData: ClinicPetCase) => void;
  selectedRowKeys: string[];
  onSelectionChange: (selectedRowKeys: string[]) => void;
}

function PetCasesTable({
  cases,
  loading,
  onViewCase,
  onEditCase,
  selectedRowKeys,
  onSelectionChange,
}: PetCasesTableProps) {
  const { t } = useTranslation('components');
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const getStatusColor = (status: string) => PetCasesService.getStatusColor(status);
  const getPriorityColor = (priority: string) => PetCasesService.getPriorityColor(priority);
  const getStatusLabel = (status: string) => PetCasesService.getStatusLabel(status);
  const getPriorityLabel = (priority: string) => PetCasesService.getPriorityLabel(priority);
  const calculateDaysOpen = (createdAt: string) => PetCasesService.calculateDaysOpen(createdAt);

  const columns = [
    {
      title: t('petCasesTable.caseNumber'),
      dataIndex: 'case_number',
      key: 'case_number',
      width: 120,
      render: (caseNumber: string) => (
        <div className='font-mono text-sm font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md inline-block'>
          {caseNumber}
        </div>
      ),
    },
    {
      title: t('petCasesTable.petOwner'),
      key: 'pet_owner',
      width: 280,
      render: (record: ClinicPetCase) => (
        <div className='flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow'>
          <Avatar 
            src={record.pet?.photo_url} 
            icon={<HeartOutlined />} 
            size={40}
            className='border-2 border-slate-200'
            style={{ backgroundColor: '#667eea' }}
          />
          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-sm text-slate-800 truncate'>
              {record.pet?.name || t('petCasesTable.unknownPet')}
            </div>
            <div className='text-xs text-slate-600 flex items-center gap-1'>
              <span className='truncate'>{record.pet?.species}</span>
              {record.pet?.breed && (
                <span>• {record.pet?.breed}</span>
              )}
            </div>
            <div className='text-xs font-medium text-slate-700'>
              {record.owner?.firstName} {record.owner?.lastName}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('petCasesTable.type'),
      dataIndex: 'case_type',
      key: 'case_type',
      width: 180,
      render: (caseType: string) => (
        <Tag 
          className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
          style={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #93c5fd',
          }}
        >
          {caseType.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('petCasesTable.status'),
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: (status: string) => {
        const color = getStatusColor(status);
        const statusColors = {
          blue: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
          orange: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
          purple: { bg: '#ede9fe', text: '#7c3aed', border: '#d8b4fe' },
          indigo: { bg: '#e0e7ff', text: '#4338ca', border: '#a5b4fc' },
          yellow: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
          green: { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' },
          gray: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
          red: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
        };
        
        const style = statusColors[color as keyof typeof statusColors] || statusColors.gray;
        
        return (
          <Tag 
            className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
            style={{
              backgroundColor: style.bg,
              color: style.text,
              border: `1px solid ${style.border}`,
            }}
          >
            {getStatusLabel(status)}
          </Tag>
        );
      },
    },
    {
      title: t('petCasesTable.priority'),
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (priority: string) => {
        const color = getPriorityColor(priority);
        const priorityColors = {
          default: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
          blue: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
          orange: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
          red: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
        };
        
        const style = priorityColors[color as keyof typeof priorityColors] || priorityColors.default;
        
        return (
          <Tag 
            className='!border-0 !px-3 !py-1.5 !rounded-full font-bold shadow-sm'
            style={{
              backgroundColor: style.bg,
              color: style.text,
              border: `1px solid ${style.border}`,
            }}
          >
            {getPriorityLabel(priority)}
          </Tag>
        );
      },
    },
    {
      title: t('petCasesTable.vet'),
      key: 'vet',
      width: 220,
      render: (record: ClinicPetCase) => (
        <div className='flex items-center space-x-3 p-2 rounded-lg bg-white border border-slate-100 hover:shadow-sm transition-shadow'>
          <Avatar 
            size={32} 
            icon={<UserOutlined />} 
            className='border-2 border-slate-200'
            style={{ backgroundColor: '#06b6d4' }}
          />
          <span className='text-sm font-medium text-slate-800'>
            {record.veterinarian
              ? `${record.veterinarian.firstName} ${record.veterinarian.lastName}`
              : t('petCasesTable.unassigned')}
          </span>
        </div>
      ),
    },
    {
      title: t('petCasesTable.daysOpen'),
      key: 'days_open',
      width: 120,
      render: (record: ClinicPetCase) => {
        const days = calculateDaysOpen(record.created_at);
        const isOverdue = days > 7;
        
        return (
          <div className={`flex items-center space-x-2 p-2 rounded-lg ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
            <ClockCircleOutlined className={`text-sm ${isOverdue ? 'text-red-500' : 'text-blue-500'}`} />
            <span className={`text-sm font-medium ${isOverdue ? 'text-red-700' : 'text-blue-700'}`}>
              {days}d
            </span>
          </div>
        );
      },
    },
    {
      title: t('petCasesTable.created'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => (
        <div className='text-sm text-slate-600 font-medium'>
          {dayjs(date).format('MMM DD, YYYY')}
        </div>
      ),
    },
    {
      title: t('petCasesTable.actions'),
      key: 'actions',
      width: 140,
      fixed: 'right' as const,
      render: (record: ClinicPetCase) => (
        <Space size='middle' className='p-2'>
          <Tooltip title={t('petCasesTable.viewDetails')}>
            <Button
              type='text'
              size='small'
              icon={<EyeOutlined className='text-blue-500' />}
              onClick={() => onViewCase(record)}
              className='hover:bg-blue-50 rounded-full p-2 transition-colors'
            />
          </Tooltip>
          <Tooltip title={t('petCasesTable.editCase')}>
            <Button
              type='text'
              size='small'
              icon={<EditOutlined className='text-green-500' />}
              onClick={() => onEditCase(record)}
              className='hover:bg-green-50 rounded-full p-2 transition-colors'
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'timeline',
                  label: t('petCasesTable.viewTimeline'),
                  onClick: () => {
                    setExpandedRowKeys(prev =>
                      prev.includes(record.id)
                        ? prev.filter(id => id !== record.id)
                        : [...prev, record.id]
                    );
                  },
                },
              ],
            }}
            trigger={['click']}
          >
            <Button 
              type='text' 
              size='small' 
              icon={<MoreOutlined className='text-slate-500' />} 
              className='hover:bg-slate-50 rounded-full p-2 transition-colors'
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: ClinicPetCase) => (
    <div className='p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <h4 className='font-semibold text-slate-800 text-lg flex items-center gap-2'>
            <FileTextOutlined className='text-slate-500' />
            {t('petCasesTable.caseDetails')}
          </h4>
          <div className='space-y-3 text-sm'>
            <div className='flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm'>
              <span className='font-medium text-slate-600 min-w-[80px]'>Title:</span>
              <span className='text-slate-800'>{record.title}</span>
            </div>
            <div className='flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm'>
              <span className='font-medium text-slate-600 min-w-[80px]'>Description:</span>
              <span className='text-slate-800'>{record.description}</span>
            </div>
            {record.diagnosis && (
              <div className='flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm'>
                <span className='font-medium text-slate-600 min-w-[80px]'>Diagnosis:</span>
                <span className='text-slate-800 font-medium'>{record.diagnosis}</span>
              </div>
            )}
            {record.notes && (
              <div className='flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm'>
                <span className='font-medium text-slate-600 min-w-[80px]'>Notes:</span>
                <span className='text-slate-800'>{record.notes}</span>
              </div>
            )}
          </div>
        </div>
        <div className='space-y-4'>
          <h4 className='font-semibold text-slate-800 text-lg flex items-center gap-2'>
            <HeartOutlined className='text-red-500' />
            {t('petCasesTable.symptoms')}
          </h4>
          <div className='space-y-3'>
            {record.initial_symptoms.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <ClockCircleOutlined className='text-orange-500' />
                  {t('petCasesTable.initialSymptoms')}:
                </p>
                <div className='flex flex-wrap gap-2'>
                  {record.initial_symptoms.map((symptom, index) => (
                    <Tag 
                      key={index} 
                      className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
                      style={{
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        border: '1px solid #fcd34d',
                      }}
                    >
                      {symptom}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            {record.current_symptoms.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <ClockCircleOutlined className='text-blue-500' />
                  {t('petCasesTable.currentSymptoms')}:
                </p>
                <div className='flex flex-wrap gap-2'>
                  {record.current_symptoms.map((symptom, index) => (
                    <Tag 
                      key={index} 
                      className='!border-0 !px-3 !py-1.5 !rounded-full font-medium shadow-sm'
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        border: '1px solid #93c5fd',
                      }}
                    >
                      {symptom}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      onSelectionChange(selectedRowKeys as string[]);
    },
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden'>
      <Table
        columns={columns}
        dataSource={cases}
        loading={loading}
        rowKey='id'
        pagination={false}
        scroll={{ x: 1200 }}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpandedRowsChange: keys => setExpandedRowKeys(keys as string[]),
        }}
        rowSelection={rowSelection}
        size='middle'
        className='pet-cases-table'
        rowClassName='hover:bg-slate-50 transition-colors duration-200'
        locale={{
          emptyText: (
            <div className='text-center py-8'>
              <HeartOutlined className='text-4xl text-slate-300 mb-2' />
              <div className='text-slate-500'>{t('petCasesTable.noCases')}</div>
            </div>
          ),
        }}
      />
    </div>
  );
}

export { PetCasesTable };
export default PetCasesTable;
