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
          <div className='flex items-center gap-2'>
            <FileTextOutlined className='text-primary-navy' />
            <Title level={5} className='mb-0'>
              {t('dashboard.petCasesWidget.title')}
            </Title>
          </div>
          <Badge count={petCases.urgent} overflowCount={99}>
            <Button
              type='text'
              size='small'
              icon={<ExclamationCircleOutlined />}
              className='text-red-600'
            >
              {t('dashboard.petCasesWidget.urgent')}
            </Button>
          </Badge>
        </div>
      }
      className='admin-card'
      extra={
        <Button type='link' size='small' onClick={handleViewAll}>
          {t('dashboard.petCasesWidget.viewAll')} <RightOutlined />
        </Button>
      }
    >
      {loading ? (
        <div className='flex justify-center py-8'>
          <Spin />
        </div>
      ) : (
        <div className='space-y-4'>
          {/* Summary Stats */}
          <div className='grid grid-cols-4 gap-3'>
            <div className='text-center p-3 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>{petCases.total}</div>
              <div className='text-xs text-gray-600 mt-1'>
                {t('dashboard.petCasesWidget.totalCases')}
              </div>
            </div>
            <div className='text-center p-3 bg-red-50 rounded-lg'>
              <div className='text-2xl font-bold text-red-600'>{petCases.urgent}</div>
              <div className='text-xs text-gray-600 mt-1'>
                {t('dashboard.petCasesWidget.urgent')}
              </div>
            </div>
            <div className='text-center p-3 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>{petCases.resolved}</div>
              <div className='text-xs text-gray-600 mt-1'>
                {t('dashboard.petCasesWidget.resolved')}
              </div>
            </div>
            <div className='text-center p-3 bg-orange-50 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>{petCases.inProgress}</div>
              <div className='text-xs text-gray-600 mt-1'>
                {t('dashboard.petCasesWidget.inProgress')}
              </div>
            </div>
          </div>

          {/* Recent Cases Table */}
          {petCases.recentCases && petCases.recentCases.length > 0 ? (
            <div>
              <Title level={5} className='mb-3 text-sm'>
                {t('dashboard.petCasesWidget.recentCases')}
              </Title>
              <Table
                dataSource={petCases.recentCases.slice(0, 5)}
                columns={columns}
                pagination={false}
                size='small'
                rowKey='id'
                onRow={record => ({
                  onClick: () => handleViewCase(record.id),
                  className: 'cursor-pointer hover:bg-gray-50',
                })}
              />
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <FileTextOutlined className='text-4xl mb-2' />
              <p>{t('dashboard.petCasesWidget.noPetCasesYet')}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PetCasesWidget;
