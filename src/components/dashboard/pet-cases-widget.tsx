import { Badge, Button, Card, Spin, Table, Tag, Typography } from 'antd';
import { ExclamationCircleOutlined, FileTextOutlined, RightOutlined } from '@ant-design/icons';

import type { DashboardStats } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface PetCasesWidgetProps {
  stats: DashboardStats;
  loading?: boolean;
}

const PetCasesWidget: React.FC<PetCasesWidgetProps> = ({ stats, loading = false }) => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();

  const petCases = stats.petCases;

  // Show empty state if no pet cases data
  if (!petCases) {
    return null;
  }

  const handleViewAll = () => {
    navigate('/pet-cases');
  };

  const handleViewCase = (caseId: string) => {
    navigate(`/pet-cases?viewCase=${caseId}`);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      open: 'blue',
      in_progress: 'orange',
      pending_consultation: 'purple',
      pending_visit: 'indigo',
      under_observation: 'yellow',
      resolved: 'green',
      closed: 'gray',
      escalated: 'red',
    };
    return statusColors[status] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: Record<string, string> = {
      low: 'default',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
      emergency: 'red',
    };
    return priorityColors[priority] || 'default';
  };

  const columns = [
    {
      title: t('dashboard.petCasesWidget.caseNumber'),
      dataIndex: 'case_number',
      key: 'case_number',
      width: 100,
      render: (text: string) => <span className='font-mono text-xs'>{text}</span>,
    },
    {
      title: t('dashboard.petCasesWidget.title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string) => (
        <Text strong className='text-sm'>
          {text}
        </Text>
      ),
    },
    {
      title: t('dashboard.petCasesWidget.pet'),
      dataIndex: 'pet_name',
      key: 'pet_name',
      width: 120,
      render: (text: string) => <Text className='text-sm'>{text}</Text>,
    },
    {
      title: t('dashboard.petCasesWidget.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: t('dashboard.petCasesWidget.priority'),
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    },
  ];

  return (
    <Card
      title={
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div 
              className='w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white'
              style={{ backgroundColor: '#667eea' }}
            >
              <FileTextOutlined className='text-lg' />
            </div>
            <span className='text-lg font-semibold text-slate-800'>
              {t('dashboard.petCasesWidget.title')}
            </span>
          </div>
          <Badge 
            count={petCases.urgent} 
            overflowCount={99}
            style={{ 
              backgroundColor: '#ef4444',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
            }}
          >
            <Button
              type='text'
              size='small'
              icon={<ExclamationCircleOutlined />}
              className='text-red-600 font-medium'
            >
              {t('dashboard.petCasesWidget.urgent')}
            </Button>
          </Badge>
        </div>
      }
      className='border-0 shadow-lg hover:shadow-xl transition-shadow duration-300'
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
      }}
      extra={
        <Button 
          type='link' 
          size='small' 
          onClick={handleViewAll}
          className='font-medium text-blue-600 hover:text-blue-700'
        >
          {t('dashboard.petCasesWidget.viewAll')} <RightOutlined />
        </Button>
      }
    >
      {loading ? (
        <div className='flex justify-center py-8'>
          <Spin />
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Summary Stats */}
          <div className='grid grid-cols-4 gap-4'>
            <div 
              className='text-center p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer relative overflow-hidden bg-white'
              style={{
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <div 
                className='absolute inset-0 opacity-[0.02]'
                style={{ backgroundColor: '#667eea' }}
              />
              <div className='relative'>
                <div className='text-3xl font-bold text-blue-600'>{petCases.total}</div>
                <div className='text-xs text-slate-600 mt-2 font-medium'>
                  {t('dashboard.petCasesWidget.totalCases')}
                </div>
              </div>
            </div>
            
            <div 
              className='text-center p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer relative overflow-hidden bg-white'
              style={{
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <div 
                className='absolute inset-0 opacity-[0.02]'
                style={{ backgroundColor: '#ef4444' }}
              />
              <div className='relative'>
                <div className='text-3xl font-bold text-red-600'>{petCases.urgent}</div>
                <div className='text-xs text-slate-600 mt-2 font-medium'>
                  {t('dashboard.petCasesWidget.urgent')}
                </div>
              </div>
            </div>
            
            <div 
              className='text-center p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer relative overflow-hidden bg-white'
              style={{
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <div 
                className='absolute inset-0 opacity-[0.02]'
                style={{ backgroundColor: '#10b981' }}
              />
              <div className='relative'>
                <div className='text-3xl font-bold text-green-600'>{petCases.resolved}</div>
                <div className='text-xs text-slate-600 mt-2 font-medium'>
                  {t('dashboard.petCasesWidget.resolved')}
                </div>
              </div>
            </div>
            
            <div 
              className='text-center p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer relative overflow-hidden bg-white'
              style={{
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <div 
                className='absolute inset-0 opacity-[0.02]'
                style={{ backgroundColor: '#f97316' }}
              />
              <div className='relative'>
                <div className='text-3xl font-bold text-orange-600'>{petCases.inProgress}</div>
                <div className='text-xs text-slate-600 mt-2 font-medium'>
                  {t('dashboard.petCasesWidget.inProgress')}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Cases Table */}
          {petCases.recentCases && petCases.recentCases.length > 0 ? (
            <div>
              <Title level={5} className='mb-4 text-base font-semibold text-slate-800'>
                {t('dashboard.petCasesWidget.recentCases')}
              </Title>
              <div className='rounded-xl overflow-hidden border border-slate-200'>
                <Table
                  dataSource={petCases.recentCases.slice(0, 5)}
                  columns={columns}
                  pagination={false}
                  size='small'
                  rowKey='id'
                  onRow={record => ({
                    onClick: () => handleViewCase(record.id),
                    className: 'cursor-pointer hover:bg-slate-50 transition-colors duration-200',
                  })}
                />
              </div>
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 mb-4'>
                <FileTextOutlined className='text-4xl text-slate-300' />
              </div>
              <p className='text-slate-500 font-medium'>{t('dashboard.petCasesWidget.noPetCasesYet')}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PetCasesWidget;
