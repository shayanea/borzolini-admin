// Case Type Distribution Component with Enhanced Visual Design
import {
  BugOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Tooltip } from 'antd';

import React from 'react';
import { CaseStats } from '../../types/pet-cases';

interface CaseTypeDistributionProps {
  stats: CaseStats;
  loading?: boolean;
}

const CaseTypeDistribution: React.FC<CaseTypeDistributionProps> = ({ stats, loading = false }) => {
  const typeIcons = {
    consultation: <UserOutlined />,
    follow_up: <CalendarOutlined />,
    emergency: <ExclamationCircleOutlined />,
    preventive: <HeartOutlined />,
    chronic_condition: <MedicineBoxOutlined />,
    post_surgery: <SettingOutlined />,
    behavioral: <BugOutlined />,
    nutritional: <FileTextOutlined />,
  };

  const typeColors = {
    consultation: '#1890ff',
    follow_up: '#52c41a',
    emergency: '#ff4d4f',
    preventive: '#13c2c2',
    chronic_condition: '#722ed1',
    post_surgery: '#fa8c16',
    behavioral: '#eb2f96',
    nutritional: '#faad14',
  };

  const typeDescriptions = {
    consultation: 'Initial consultation and assessment',
    follow_up: 'Follow-up appointments and check-ups',
    emergency: 'Urgent medical attention required',
    preventive: 'Routine health maintenance',
    chronic_condition: 'Ongoing medical conditions',
    post_surgery: 'Post-operative care and monitoring',
    behavioral: 'Behavioral issues and training',
    nutritional: 'Diet and nutrition counseling',
  };

  const typeEntries = Object.entries(stats.byType).filter(([, count]) => count > 0);

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTypeIcon = (type: string) => {
    return typeIcons[type as keyof typeof typeIcons] || <FileTextOutlined />;
  };

  const getTypeColor = (type: string) => {
    return typeColors[type as keyof typeof typeColors] || '#d9d9d9';
  };

  const getTypeDescription = (type: string) => {
    return typeDescriptions[type as keyof typeof typeDescriptions] || 'Case type description';
  };

  return (
    <Card
      title={
        <div className='flex items-center space-x-2'>
          <span className='text-lg font-semibold'>Case Type Distribution</span>
          <span className='text-sm text-gray-500'>({stats.total} total)</span>
        </div>
      }
      className='border-0 shadow-sm'
      loading={loading}
    >
      {typeEntries.length > 0 ? (
        <Row gutter={[16, 16]}>
          {typeEntries.map(([type, count]) => {
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            const typeLabel = getTypeLabel(type);
            const typeIcon = getTypeIcon(type);
            const typeColor = getTypeColor(type);
            const typeDescription = getTypeDescription(type);

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={type}>
                <Tooltip title={typeDescription} placement='top'>
                  <div
                    className='relative p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group'
                    style={{ borderLeftColor: typeColor, borderLeftWidth: '4px' }}
                  >
                    {/* Icon and Count */}
                    <div className='flex items-center justify-between mb-3'>
                      <div
                        className='flex items-center justify-center w-10 h-10 rounded-full text-white text-lg'
                        style={{ backgroundColor: typeColor }}
                      >
                        {typeIcon}
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-gray-900'>{count}</div>
                        <div className='text-xs text-gray-500'>
                          {count === 1 ? 'case' : 'cases'}
                        </div>
                      </div>
                    </div>

                    {/* Type Label */}
                    <div className='mb-2'>
                      <div className='text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors'>
                        {typeLabel}
                      </div>
                    </div>

                    {/* Percentage Bar */}
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between text-xs'>
                        <span className='text-gray-500'>Percentage</span>
                        <span className='font-medium text-gray-700'>{percentage.toFixed(1)}%</span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='h-2 rounded-full transition-all duration-300'
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: typeColor,
                          }}
                        />
                      </div>
                    </div>

                    {/* Hover Effect Indicator */}
                    <div
                      className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                      style={{ color: typeColor }}
                    >
                      <PlusOutlined className='text-sm' />
                    </div>
                  </div>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className='text-center py-12 text-gray-500'>
          <FileTextOutlined className='text-4xl mb-4' />
          <div className='text-lg font-medium mb-2'>No Cases Found</div>
          <div className='text-sm'>No cases have been assigned to any type yet</div>
        </div>
      )}

      {/* Summary Stats */}
      {typeEntries.length > 0 && (
        <div className='mt-6 pt-4 border-t border-gray-200'>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>{typeEntries.length}</div>
                <div className='text-sm text-gray-500'>Active Types</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>
                  {Math.max(...typeEntries.map(([, count]) => count))}
                </div>
                <div className='text-sm text-gray-500'>Most Common</div>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>
                  {typeEntries.length > 0
                    ? (
                        typeEntries.reduce((sum, [, count]) => sum + count, 0) / typeEntries.length
                      ).toFixed(1)
                    : '0'}
                </div>
                <div className='text-sm text-gray-500'>Avg per Type</div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
};

export default CaseTypeDistribution;
