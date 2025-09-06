import { Alert, Card, Col, Row, Tooltip } from 'antd';
// Performance Metrics Component with Trends and Insights
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  InfoCircleOutlined,
  RiseOutlined,
  UpOutlined,
} from '@ant-design/icons';

import { CaseStats } from '../../types/pet-cases';
import React from 'react';

interface PerformanceMetricsProps {
  stats: CaseStats;
  loading?: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ stats, loading = false }) => {
  const resolutionRate = stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0;
  const urgentRate = stats.total > 0 ? (stats.urgent / stats.total) * 100 : 0;
  const activeCases = stats.total - stats.resolved;

  // Performance indicators
  const getResolutionRateStatus = (rate: number) => {
    if (rate >= 80) return { status: 'success', icon: <CheckCircleOutlined />, color: '#52c41a' };
    if (rate >= 60)
      return { status: 'warning', icon: <ExclamationCircleOutlined />, color: '#faad14' };
    return { status: 'error', icon: <ExclamationCircleOutlined />, color: '#ff4d4f' };
  };

  const getUrgencyRateStatus = (rate: number) => {
    if (rate <= 20) return { status: 'success', icon: <CheckCircleOutlined />, color: '#52c41a' };
    if (rate <= 40)
      return { status: 'warning', icon: <ExclamationCircleOutlined />, color: '#faad14' };
    return { status: 'error', icon: <FireOutlined />, color: '#ff4d4f' };
  };

  const getResolutionTimeStatus = (time: number) => {
    if (time <= 3) return { status: 'success', icon: <DownOutlined />, color: '#52c41a' };
    if (time <= 7) return { status: 'warning', icon: <ClockCircleOutlined />, color: '#faad14' };
    return { status: 'error', icon: <UpOutlined />, color: '#ff4d4f' };
  };

  const resolutionStatus = getResolutionRateStatus(resolutionRate);
  const urgencyStatus = getUrgencyRateStatus(urgentRate);
  const timeStatus = getResolutionTimeStatus(stats.averageResolutionTime);

  // Generate insights
  const generateInsights = () => {
    const insights = [];

    if (resolutionRate >= 80) {
      insights.push({
        type: 'success',
        icon: <CheckCircleOutlined />,
        title: 'Excellent Resolution Rate',
        message: `Your ${resolutionRate.toFixed(1)}% resolution rate is outstanding! Keep up the great work.`,
      });
    } else if (resolutionRate < 60) {
      insights.push({
        type: 'error',
        icon: <ExclamationCircleOutlined />,
        title: 'Low Resolution Rate',
        message: `Your ${resolutionRate.toFixed(1)}% resolution rate needs improvement. Consider reviewing case management processes.`,
      });
    }

    if (urgentRate > 40) {
      insights.push({
        type: 'warning',
        icon: <FireOutlined />,
        title: 'High Urgency Rate',
        message: `${urgentRate.toFixed(1)}% of cases are urgent. Consider increasing staff capacity or improving triage.`,
      });
    } else if (urgentRate <= 20) {
      insights.push({
        type: 'success',
        icon: <CheckCircleOutlined />,
        title: 'Well-Managed Urgency',
        message: `Only ${urgentRate.toFixed(1)}% of cases are urgent. Your case management is well-balanced.`,
      });
    }

    if (stats.averageResolutionTime > 7) {
      insights.push({
        type: 'warning',
        icon: <ClockCircleOutlined />,
        title: 'Long Resolution Time',
        message: `Average resolution time of ${stats.averageResolutionTime.toFixed(1)} days is high. Consider process optimization.`,
      });
    } else if (stats.averageResolutionTime <= 3) {
      insights.push({
        type: 'success',
        icon: <DownOutlined />,
        title: 'Fast Resolution',
        message: `Excellent average resolution time of ${stats.averageResolutionTime.toFixed(1)} days!`,
      });
    }

    if (activeCases > stats.resolved) {
      insights.push({
        type: 'info',
        icon: <InfoCircleOutlined />,
        title: 'Active Case Load',
        message: `You have ${activeCases} active cases vs ${stats.resolved} resolved. Consider focusing on completion.`,
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className='space-y-6'>
      {/* Performance Indicators */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card className='h-full border-0 shadow-sm' loading={loading}>
            <div className='text-center'>
              <div
                className='inline-flex items-center justify-center w-12 h-12 rounded-full mb-3'
                style={{ backgroundColor: `${resolutionStatus.color}20` }}
              >
                <div style={{ color: resolutionStatus.color }}>{resolutionStatus.icon}</div>
              </div>
              <div className='text-2xl font-bold text-gray-900 mb-1'>
                {resolutionRate.toFixed(1)}%
              </div>
              <div className='text-sm text-gray-600 mb-2'>Resolution Rate</div>
              <div className='text-xs text-gray-500'>
                {resolutionStatus.status === 'success' && 'Excellent performance'}
                {resolutionStatus.status === 'warning' && 'Room for improvement'}
                {resolutionStatus.status === 'error' && 'Needs attention'}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className='h-full border-0 shadow-sm' loading={loading}>
            <div className='text-center'>
              <div
                className='inline-flex items-center justify-center w-12 h-12 rounded-full mb-3'
                style={{ backgroundColor: `${urgencyStatus.color}20` }}
              >
                <div style={{ color: urgencyStatus.color }}>{urgencyStatus.icon}</div>
              </div>
              <div className='text-2xl font-bold text-gray-900 mb-1'>{urgentRate.toFixed(1)}%</div>
              <div className='text-sm text-gray-600 mb-2'>Urgency Rate</div>
              <div className='text-xs text-gray-500'>
                {urgencyStatus.status === 'success' && 'Well managed'}
                {urgencyStatus.status === 'warning' && 'Moderate concern'}
                {urgencyStatus.status === 'error' && 'High priority'}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className='h-full border-0 shadow-sm' loading={loading}>
            <div className='text-center'>
              <div
                className='inline-flex items-center justify-center w-12 h-12 rounded-full mb-3'
                style={{ backgroundColor: `${timeStatus.color}20` }}
              >
                <div style={{ color: timeStatus.color }}>{timeStatus.icon}</div>
              </div>
              <div className='text-2xl font-bold text-gray-900 mb-1'>
                {stats.averageResolutionTime.toFixed(1)}
              </div>
              <div className='text-sm text-gray-600 mb-2'>Avg Resolution (days)</div>
              <div className='text-xs text-gray-500'>
                {timeStatus.status === 'success' && 'Very fast'}
                {timeStatus.status === 'warning' && 'Moderate speed'}
                {timeStatus.status === 'error' && 'Needs improvement'}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Insights and Recommendations */}
      {insights.length > 0 && (
        <Card
          title={
            <div className='flex items-center space-x-2'>
              <RiseOutlined className='text-blue-500' />
              <span className='text-lg font-semibold'>Insights & Recommendations</span>
            </div>
          }
          className='border-0 shadow-sm'
        >
          <div className='space-y-3'>
            {insights.map((insight, index) => (
              <Alert
                key={index}
                message={
                  <div className='flex items-start space-x-3'>
                    <div
                      className='flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5'
                      style={{
                        backgroundColor: `${insight.icon.props.style?.color || '#1890ff'}20`,
                      }}
                    >
                      <div style={{ color: insight.icon.props.style?.color || '#1890ff' }}>
                        {insight.icon}
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-gray-900 mb-1'>{insight.title}</div>
                      <div className='text-sm text-gray-600'>{insight.message}</div>
                    </div>
                  </div>
                }
                type={insight.type as any}
                showIcon={false}
                className='border-0 bg-gray-50'
              />
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card
        title={
          <div className='flex items-center space-x-2'>
            <InfoCircleOutlined className='text-green-500' />
            <span className='text-lg font-semibold'>Quick Actions</span>
          </div>
        }
        className='border-0 shadow-sm'
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Tooltip title='View all urgent cases that need immediate attention'>
              <div className='text-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer'>
                <FireOutlined className='text-2xl text-red-500 mb-2' />
                <div className='text-sm font-medium text-gray-900'>Urgent Cases</div>
                <div className='text-xs text-gray-500'>{stats.urgent} cases</div>
              </div>
            </Tooltip>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Tooltip title='View all active cases currently in progress'>
              <div className='text-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 cursor-pointer'>
                <ClockCircleOutlined className='text-2xl text-orange-500 mb-2' />
                <div className='text-sm font-medium text-gray-900'>Active Cases</div>
                <div className='text-xs text-gray-500'>{activeCases} cases</div>
              </div>
            </Tooltip>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Tooltip title='View all resolved cases for review'>
              <div className='text-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer'>
                <CheckCircleOutlined className='text-2xl text-green-500 mb-2' />
                <div className='text-sm font-medium text-gray-900'>Resolved Cases</div>
                <div className='text-xs text-gray-500'>{stats.resolved} cases</div>
              </div>
            </Tooltip>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Tooltip title='Generate detailed performance report'>
              <div className='text-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer'>
                <UpOutlined className='text-2xl text-blue-500 mb-2' />
                <div className='text-sm font-medium text-gray-900'>Performance Report</div>
                <div className='text-xs text-gray-500'>Generate</div>
              </div>
            </Tooltip>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
