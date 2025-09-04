// Pet Cases Header Component
import {
  BarChartOutlined,
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Badge, Button, Space, Typography } from 'antd';
import React from 'react';
import { CaseStats } from '../../types/pet-cases';

const { Title } = Typography;

interface PetCasesHeaderProps {
  totalCases: number;
  selectedCount: number;
  stats?: CaseStats;
  loading?: boolean;
  onCreateCase: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onViewStats: () => void;
}

const PetCasesHeader: React.FC<PetCasesHeaderProps> = ({
  totalCases,
  selectedCount,
  stats,
  loading = false,
  onCreateCase,
  onExport,
  onRefresh,
  onViewStats,
}) => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
      <div>
        <Title level={3} className='mb-1'>
          Pet Cases Management
        </Title>
        <div className='flex items-center gap-4 text-gray-600'>
          <span>Total Cases: {totalCases}</span>
          {stats && (
            <>
              <Badge color='red' count={stats.urgent} showZero>
                <span>Urgent: {stats.urgent}</span>
              </Badge>
              <span>Resolved: {stats.resolved}</span>
              <span>Avg. Resolution: {stats.averageResolutionTime} days</span>
            </>
          )}
          {selectedCount > 0 && (
            <Badge color='blue' count={selectedCount}>
              <span>Selected: {selectedCount}</span>
            </Badge>
          )}
        </div>
      </div>

      <Space wrap>
        <Button
          type='text'
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
          title='Refresh data'
        >
          Refresh
        </Button>

        <Button icon={<BarChartOutlined />} onClick={onViewStats} disabled={!stats}>
          View Statistics
        </Button>

        <Button icon={<DownloadOutlined />} onClick={onExport} disabled={totalCases === 0}>
          Export Cases
        </Button>

        <Button type='primary' icon={<PlusOutlined />} onClick={onCreateCase}>
          Create Case
        </Button>
      </Space>
    </div>
  );
};

export default PetCasesHeader;
