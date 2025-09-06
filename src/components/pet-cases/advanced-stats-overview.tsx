// Advanced Statistics Overview Component
import {
  AlertOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

import { CaseStats } from '../../types/pet-cases';
import React from 'react';

interface AdvancedStatsOverviewProps {
  stats: CaseStats;
  loading?: boolean;
}

const AdvancedStatsOverview: React.FC<AdvancedStatsOverviewProps> = ({
  stats,
  loading = false,
}) => {
  const resolutionRate = stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0;
  const urgentRate = stats.total > 0 ? (stats.urgent / stats.total) * 100 : 0;
  const activeCases = stats.total - stats.resolved;

  return (
    <div className='space-y-6'>
      {/* Key Metrics Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className='h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200'
            loading={loading}
          >
            <Statistic
              title={
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Total Cases</span>
                  <BarChartOutlined className='text-blue-500' />
                </div>
              }
              value={stats.total}
              valueStyle={{
                color: '#1890ff',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
              suffix={
                <div className='text-sm text-gray-500 ml-1'>
                  {stats.total === 1 ? 'case' : 'cases'}
                </div>
              }
            />
            <div className='mt-2 text-xs text-gray-500'>All time cases</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className='h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200'
            loading={loading}
          >
            <Statistic
              title={
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Resolved Cases</span>
                  <CheckCircleOutlined className='text-green-500' />
                </div>
              }
              value={stats.resolved}
              valueStyle={{
                color: '#52c41a',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
              suffix={
                <div className='text-sm text-gray-500 ml-1'>({resolutionRate.toFixed(1)}%)</div>
              }
            />
            <div className='mt-2 text-xs text-gray-500'>Successfully closed</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className='h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200'
            loading={loading}
          >
            <Statistic
              title={
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Active Cases</span>
                  <ExclamationCircleOutlined className='text-orange-500' />
                </div>
              }
              value={activeCases}
              valueStyle={{
                color: '#fa8c16',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
              suffix={<div className='text-sm text-gray-500 ml-1'>ongoing</div>}
            />
            <div className='mt-2 text-xs text-gray-500'>Currently in progress</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className='h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200'
            loading={loading}
          >
            <Statistic
              title={
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Urgent Cases</span>
                  <AlertOutlined className='text-red-500' />
                </div>
              }
              value={stats.urgent}
              valueStyle={{
                color: '#ff4d4f',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
              suffix={<div className='text-sm text-gray-500 ml-1'>({urgentRate.toFixed(1)}%)</div>}
            />
            <div className='mt-2 text-xs text-gray-500'>Require immediate attention</div>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className='h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200'
            loading={loading}
          >
            <Statistic
              title={
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Avg Resolution Time</span>
                  <ClockCircleOutlined className='text-yellow-500' />
                </div>
              }
              value={stats.averageResolutionTime}
              valueStyle={{
                color: '#faad14',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
              suffix={<div className='text-sm text-gray-500 ml-1'>days</div>}
              precision={1}
            />
            <div className='mt-2 text-xs text-gray-500'>Average time to resolution</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            className='h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200'
            loading={loading}
          >
            <Statistic
              title={
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Resolution Rate</span>
                  <UpOutlined className='text-green-500' />
                </div>
              }
              value={resolutionRate}
              valueStyle={{
                color:
                  resolutionRate >= 80 ? '#52c41a' : resolutionRate >= 60 ? '#faad14' : '#ff4d4f',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
              suffix={<div className='text-sm text-gray-500 ml-1'>%</div>}
              precision={1}
            />
            <div className='mt-2 text-xs text-gray-500'>Cases successfully resolved</div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            className='h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200'
            loading={loading}
          >
            <Statistic
              title={
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>Urgency Rate</span>
                  <RiseOutlined className='text-red-500' />
                </div>
              }
              value={urgentRate}
              valueStyle={{
                color: urgentRate <= 20 ? '#52c41a' : urgentRate <= 40 ? '#faad14' : '#ff4d4f',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
              suffix={<div className='text-sm text-gray-500 ml-1'>%</div>}
              precision={1}
            />
            <div className='mt-2 text-xs text-gray-500'>Cases requiring urgent attention</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedStatsOverview;
