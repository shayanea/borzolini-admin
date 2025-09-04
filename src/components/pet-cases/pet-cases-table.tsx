// Pet Cases Table Component
import {
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  HeartOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Space, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { PetCasesService } from '../../services/pet-cases.service';
import { ClinicPetCase } from '../../types/pet-cases';

interface PetCasesTableProps {
  cases: ClinicPetCase[];
  loading: boolean;
  onViewCase: (caseData: ClinicPetCase) => void;
  onEditCase: (caseData: ClinicPetCase) => void;
  selectedRowKeys: string[];
  onSelectionChange: (selectedRowKeys: string[]) => void;
}

const PetCasesTable: React.FC<PetCasesTableProps> = ({
  cases,
  loading,
  onViewCase,
  onEditCase,
  selectedRowKeys,
  onSelectionChange,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const getStatusColor = (status: string) => PetCasesService.getStatusColor(status);
  const getPriorityColor = (priority: string) => PetCasesService.getPriorityColor(priority);
  const getStatusLabel = (status: string) => PetCasesService.getStatusLabel(status);
  const getPriorityLabel = (priority: string) => PetCasesService.getPriorityLabel(priority);
  const calculateDaysOpen = (createdAt: string) => PetCasesService.calculateDaysOpen(createdAt);

  const columns = [
    {
      title: 'Case #',
      dataIndex: 'case_number',
      key: 'case_number',
      width: 120,
      render: (caseNumber: string) => (
        <span className='font-mono text-sm font-medium'>{caseNumber}</span>
      ),
    },
    {
      title: 'Pet & Owner',
      key: 'pet_owner',
      width: 250,
      render: (record: ClinicPetCase) => (
        <div className='flex items-center space-x-3'>
          <Avatar src={record.pet?.photo_url} icon={<HeartOutlined />} size='small' />
          <div>
            <div className='font-medium text-sm'>{record.pet?.name || 'Unknown Pet'}</div>
            <div className='text-xs text-gray-500'>
              {record.pet?.species} {record.pet?.breed ? `• ${record.pet?.breed}` : ''}
            </div>
            <div className='text-xs text-gray-600'>
              {record.owner?.firstName} {record.owner?.lastName}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'case_type',
      key: 'case_type',
      width: 120,
      render: (caseType: string) => (
        <Tag color='blue'>{caseType.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{getPriorityLabel(priority)}</Tag>
      ),
    },
    {
      title: 'Vet',
      key: 'vet',
      width: 120,
      render: (record: ClinicPetCase) => (
        <div className='flex items-center space-x-2'>
          <Avatar size='small' icon={<UserOutlined />} />
          <span className='text-sm'>
            {record.veterinarian
              ? `${record.veterinarian.firstName} ${record.veterinarian.lastName}`
              : 'Unassigned'}
          </span>
        </div>
      ),
    },
    {
      title: 'Days Open',
      key: 'days_open',
      width: 100,
      render: (record: ClinicPetCase) => {
        const days = calculateDaysOpen(record.created_at);
        return (
          <div className='flex items-center space-x-1'>
            <ClockCircleOutlined className='text-gray-400' />
            <span className='text-sm'>{days}d</span>
          </div>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => (
        <span className='text-sm text-gray-600'>{dayjs(date).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (record: ClinicPetCase) => (
        <Space size='small'>
          <Tooltip title='View Details'>
            <Button
              type='text'
              size='small'
              icon={<EyeOutlined />}
              onClick={() => onViewCase(record)}
            />
          </Tooltip>
          <Tooltip title='Edit Case'>
            <Button
              type='text'
              size='small'
              icon={<EditOutlined />}
              onClick={() => onEditCase(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'timeline',
                  label: 'View Timeline',
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
            <Button type='text' size='small' icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: ClinicPetCase) => (
    <div className='p-4 bg-gray-50 rounded'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <h4 className='font-medium mb-2'>Case Details</h4>
          <div className='space-y-1 text-sm'>
            <p>
              <strong>Title:</strong> {record.title}
            </p>
            <p>
              <strong>Description:</strong> {record.description}
            </p>
            {record.diagnosis && (
              <p>
                <strong>Diagnosis:</strong> {record.diagnosis}
              </p>
            )}
            {record.notes && (
              <p>
                <strong>Notes:</strong> {record.notes}
              </p>
            )}
          </div>
        </div>
        <div>
          <h4 className='font-medium mb-2'>Symptoms</h4>
          <div className='space-y-2'>
            {record.initial_symptoms.length > 0 && (
              <div>
                <p className='text-sm font-medium text-gray-700'>Initial Symptoms:</p>
                <div className='flex flex-wrap gap-1 mt-1'>
                  {record.initial_symptoms.map((symptom, index) => (
                    <Tag key={index} color='orange'>
                      {symptom}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            {record.current_symptoms.length > 0 && (
              <div>
                <p className='text-sm font-medium text-gray-700'>Current Symptoms:</p>
                <div className='flex flex-wrap gap-1 mt-1'>
                  {record.current_symptoms.map((symptom, index) => (
                    <Tag key={index} color='blue'>
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
    onChange: (selectedRowKeys: React.Key[], _selectedRows: ClinicPetCase[]) => {
      onSelectionChange(selectedRowKeys as string[]);
    },
  };

  return (
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
    />
  );
};

export default PetCasesTable;
