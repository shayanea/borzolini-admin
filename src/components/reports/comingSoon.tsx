import React from 'react';
import { Card, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ComingSoon: React.FC = () => {
  return (
    <Card className="admin-card">
      <div className="text-center py-8">
        <BarChartOutlined className="text-6xl text-text-light mb-4" />
        <Title level={3} className="!mb-2">
          Advanced Analytics Coming Soon
        </Title>
        <Text className="text-text-light">
          We're working on comprehensive analytics dashboards with interactive charts and real-time data.
        </Text>
      </div>
    </Card>
  );
};

export default ComingSoon;
