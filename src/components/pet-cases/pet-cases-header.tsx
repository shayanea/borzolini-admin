import { Badge, Button, Space, Typography } from 'antd';
// Pet Cases Header Component
import {
  BarChartOutlined,
  DownloadOutlined,
  FileTextOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

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
  viewAllCases?: boolean;
  clinicName?: string;
}

function PetCasesHeader({
  totalCases,
  selectedCount,
  stats,
  loading = false,
  onCreateCase,
  onExport,
  onRefresh,
  onViewStats,
  viewAllCases = false,
  clinicName,
}: PetCasesHeaderProps) {
  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6'>
      {/* Header Title */}
      <div className='flex items-center gap-3 mb-4'>
        <div 
          className='w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-white'
          style={{ backgroundColor: '#667eea' }}
        >
          <FileTextOutlined className='text-xl' />
        </div>
        <div>
          <Title level={3} className='mb-1 text-slate-800 !tracking-tight'>
            Pet Cases Management
          </Title>
          <div className='flex items-center gap-2'>
            {viewAllCases && (
              <Badge 
                className='!border-0 !px-3 !py-1 !rounded-full font-medium shadow-sm'
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  border: '1px solid #93c5fd',
                }}
              >
                All Clinics
              </Badge>
            )}
            {clinicName && !viewAllCases && (
              <Badge 
                className='!border-0 !px-3 !py-1 !rounded-full font-medium shadow-sm'
                style={{
                  backgroundColor: '#d1fae5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                }}
              >
                {clinicName}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className='flex flex-wrap items-center gap-6 mb-6 text-sm'>
        <div className='flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200'>
          <span className='font-semibold text-slate-700'>Total Cases:</span>
          <span className='font-bold text-slate-800'>{totalCases}</span>
        </div>
        
        {stats && (
          <>
            <div className='flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200'>
              <span className='font-semibold text-red-700'>Urgent:</span>
              <span className='font-bold text-red-800'>{stats.urgent}</span>
            </div>
            
            <div className='flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200'>
              <span className='font-semibold text-green-700'>Resolved:</span>
              <span className='font-bold text-green-800'>{stats.resolved}</span>
            </div>
            
            <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200'>
              <span className='font-semibold text-blue-700'>Avg. Resolution:</span>
              <span className='font-bold text-blue-800'>{stats.averageResolutionTime} days</span>
            </div>
          </>
        )}
        
        {selectedCount > 0 && (
          <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200'>
            <Badge 
              count={selectedCount} 
              style={{ 
                backgroundColor: '#dbeafe', 
                color: '#1e40af',
                boxShadow: '0 1px 3px rgba(30, 64, 175, 0.2)',
              }}
            />
            <span className='font-semibold text-blue-700'>Selected</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <Space wrap className='gap-3'>
        <Button
          type='text'
          icon={<ReloadOutlined className='text-slate-500' />}
          onClick={onRefresh}
          loading={loading}
          className='hover:bg-slate-50 rounded-full p-3 transition-colors'
          title='Refresh data'
          size='middle'
        >
          Refresh
        </Button>

        <Button 
          icon={<BarChartOutlined className='text-slate-500' />} 
          onClick={onViewStats} 
          disabled={!stats}
          className='hover:bg-slate-50 rounded-full px-4 py-2 transition-colors'
          size='middle'
        >
          View Statistics
        </Button>

        <Button 
          icon={<DownloadOutlined className='text-slate-500' />} 
          onClick={onExport} 
          disabled={totalCases === 0}
          className={`hover:bg-slate-50 rounded-full px-4 py-2 transition-colors ${totalCases === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          size='middle'
        >
          Export Cases
        </Button>

        <Button 
          type='primary' 
          icon={<PlusOutlined />} 
          onClick={onCreateCase}
          className='h-10 px-5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300'
          style={{
            backgroundColor: '#667eea',
            border: 'none',
          }}
          size='middle'
        >
          Create Case
        </Button>
      </Space>
    </div>
  );
}

export { PetCasesHeader };
export default PetCasesHeader;
