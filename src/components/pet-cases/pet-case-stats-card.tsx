// Pet Case Statistics Card Component
import {
  AlertOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Card, Col, Progress, Row, Statistic } from 'antd';
import { CASE_PRIORITY_COLORS, CASE_STATUS_COLORS, CaseStats } from '../../types/pet-cases';

interface PetCaseStatsCardProps {
  stats: CaseStats;
  loading?: boolean;
}

function PetCaseStatsCard({ stats, loading = false }: PetCaseStatsCardProps) {
  return (
    <Card loading={loading} className='mb-6'>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title='Total Cases'
            value={stats.total}
            prefix={<BarChartOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title='Resolved Cases'
            value={stats.resolved}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
            suffix={`/ ${stats.total}`}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title='Urgent Cases'
            value={stats.urgent}
            prefix={<AlertOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
            suffix={`/ ${stats.total}`}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title='Avg Resolution Time'
            value={stats.averageResolutionTime}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
            suffix='days'
            precision={1}
          />
        </Col>
      </Row>

      <div className='mt-6'>
        <h4 className='text-lg font-medium mb-4'>Case Status Distribution</h4>
        <Row gutter={[16, 16]}>
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={status}>
                <div className='text-center'>
                  <div className='text-sm text-gray-600 mb-1 capitalize'>
                    {status.replace('_', ' ')}
                  </div>
                  <Progress
                    type='circle'
                    percent={percentage}
                    format={() => `${count}`}
                    size={60}
                    strokeColor={CASE_STATUS_COLORS[status as keyof typeof CASE_STATUS_COLORS]}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      <div className='mt-6'>
        <h4 className='text-lg font-medium mb-4'>Case Priority Distribution</h4>
        <Row gutter={[16, 16]}>
          {Object.entries(stats.byPriority).map(([priority, count]) => {
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <Col xs={24} sm={12} md={6} key={priority}>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-gray-600 capitalize'>
                    {priority.replace('_', ' ')}
                  </span>
                  <span className='text-sm font-medium'>{count}</span>
                </div>
                <Progress
                  percent={percentage}
                  strokeColor={CASE_PRIORITY_COLORS[priority as keyof typeof CASE_PRIORITY_COLORS]}
                  size='small'
                />
              </Col>
            );
          })}
        </Row>
      </div>

      <div className='mt-6'>
        <h4 className='text-lg font-medium mb-4'>Case Type Distribution</h4>
        <Row gutter={[16, 16]}>
          {Object.entries(stats.byType).map(([type, count]) => {
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={type}>
                <div className='bg-gray-50 p-3 rounded'>
                  <div className='text-sm font-medium text-gray-900 capitalize'>
                    {type.replace('_', ' ')}
                  </div>
                  <div className='text-2xl font-bold text-blue-600'>{count}</div>
                  <div className='text-xs text-gray-500'>{percentage.toFixed(1)}% of total</div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </Card>
  );
}

export { PetCaseStatsCard };
export default PetCaseStatsCard;
