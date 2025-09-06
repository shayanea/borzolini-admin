import { Card, Col, Progress, Row } from 'antd';
// Interactive Charts Component for Pet Cases Statistics
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

import { CaseStats } from '../../types/pet-cases';
import React from 'react';

interface InteractiveChartsProps {
  stats: CaseStats;
  loading?: boolean;
}

const InteractiveCharts: React.FC<InteractiveChartsProps> = ({ stats, loading = false }) => {
  const statusIcons = {
    open: <PlayCircleOutlined />,
    in_progress: <ClockCircleOutlined />,
    pending_consultation: <QuestionCircleOutlined />,
    pending_visit: <ClockCircleOutlined />,
    under_observation: <PauseCircleOutlined />,
    resolved: <CheckCircleOutlined />,
    closed: <StopOutlined />,
    escalated: <ExclamationCircleOutlined />,
  };

  const priorityIcons = {
    low: <StopOutlined />,
    normal: <PlayCircleOutlined />,
    high: <ExclamationCircleOutlined />,
    urgent: <FireOutlined />,
    emergency: <FireOutlined />,
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      open: '#1890ff',
      in_progress: '#fa8c16',
      pending_consultation: '#722ed1',
      pending_visit: '#531dab',
      under_observation: '#faad14',
      resolved: '#52c41a',
      closed: '#8c8c8c',
      escalated: '#ff4d4f',
    };
    return colorMap[status] || '#d9d9d9';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      low: '#8c8c8c',
      normal: '#1890ff',
      high: '#fa8c16',
      urgent: '#ff4d4f',
      emergency: '#cf1322',
    };
    return colorMap[priority] || '#d9d9d9';
  };

  const statusEntries = Object.entries(stats.byStatus).filter(([_, count]) => count > 0);
  const priorityEntries = Object.entries(stats.byPriority).filter(([_, count]) => count > 0);

  return (
    <Row gutter={[24, 24]}>
      {/* Case Status Distribution */}
      <Col xs={24} lg={12}>
        <Card
          title={
            <div className='flex items-center space-x-2'>
              <span className='text-lg font-semibold'>Case Status Distribution</span>
              <span className='text-sm text-gray-500'>({stats.total} total)</span>
            </div>
          }
          className='h-full border-0 shadow-sm'
          loading={loading}
        >
          <div className='space-y-4'>
            {statusEntries.length > 0 ? (
              statusEntries.map(([status, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const statusLabel = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <div key={status} className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-2 min-w-0 flex-1'>
                      <div
                        className='flex items-center justify-center w-8 h-8 rounded-full text-white text-sm'
                        style={{ backgroundColor: getStatusColor(status) }}
                      >
                        {statusIcons[status as keyof typeof statusIcons]}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='text-sm font-medium text-gray-900 truncate'>
                          {statusLabel}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {count} {count === 1 ? 'case' : 'cases'}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3 min-w-0'>
                      <div className='text-right min-w-0'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className='w-24'>
                        <Progress
                          percent={percentage}
                          strokeColor={getStatusColor(status)}
                          size='small'
                          showInfo={false}
                          className='mb-0'
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <ExclamationCircleOutlined className='text-4xl mb-2' />
                <div>No cases with current status</div>
              </div>
            )}
          </div>
        </Card>
      </Col>

      {/* Case Priority Distribution */}
      <Col xs={24} lg={12}>
        <Card
          title={
            <div className='flex items-center space-x-2'>
              <span className='text-lg font-semibold'>Case Priority Distribution</span>
              <span className='text-sm text-gray-500'>({stats.total} total)</span>
            </div>
          }
          className='h-full border-0 shadow-sm'
          loading={loading}
        >
          <div className='space-y-4'>
            {priorityEntries.length > 0 ? (
              priorityEntries.map(([priority, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                const priorityLabel = priority
                  .replace('_', ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <div key={priority} className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-2 min-w-0 flex-1'>
                      <div
                        className='flex items-center justify-center w-8 h-8 rounded-full text-white text-sm'
                        style={{ backgroundColor: getPriorityColor(priority) }}
                      >
                        {priorityIcons[priority as keyof typeof priorityIcons]}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='text-sm font-medium text-gray-900 truncate'>
                          {priorityLabel}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {count} {count === 1 ? 'case' : 'cases'}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3 min-w-0'>
                      <div className='text-right min-w-0'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className='w-24'>
                        <Progress
                          percent={percentage}
                          strokeColor={getPriorityColor(priority)}
                          size='small'
                          showInfo={false}
                          className='mb-0'
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <ExclamationCircleOutlined className='text-4xl mb-2' />
                <div>No cases with current priority</div>
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default InteractiveCharts;
