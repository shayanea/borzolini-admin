import { Card, Col, Progress, Row, Statistic } from 'antd';

import type { KeyMetricsProps } from '@/types/reports';

const KeyMetrics = ({ metrics }: KeyMetricsProps) => {
  return (
    <Row gutter={[24, 24]}>
      {metrics.map(metric => (
        <Col xs={24} sm={12} lg={6} key={metric.key}>
          <Card className='admin-card'>
            <Statistic
              title={metric.title}
              value={metric.value}
              prefix={metric.prefix}
              suffix={metric.suffix}
              valueStyle={{ color: metric.color }}
            />
            <Progress
              percent={metric.progress}
              showInfo={false}
              strokeColor={metric.color}
              className='mt-2'
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { KeyMetrics };
export default KeyMetrics;
