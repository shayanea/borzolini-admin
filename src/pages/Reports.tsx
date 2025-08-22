import React from 'react';
import { Card, Typography, Button, Space, Row, Col, Statistic, Progress } from 'antd';
import { BarChartOutlined, DownloadOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            Reports & Analytics
          </Title>
          <Text className="text-text-light">
            View clinic performance metrics and generate reports
          </Text>
        </div>
        
        <Space>
          <Button icon={<FilterOutlined />}>
            Filters
          </Button>
          <Button icon={<DownloadOutlined />} type="primary" className="bg-primary-navy border-primary-navy">
            Export Report
          </Button>
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card">
            <Statistic
              title="Total Revenue"
              value={45680}
              prefix="$"
              valueStyle={{ color: '#059669' }}
            />
            <Progress percent={75} showInfo={false} strokeColor="#059669" className="mt-2" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card">
            <Statistic
              title="Appointments"
              value={89}
              valueStyle={{ color: '#3b82f6' }}
            />
            <Progress percent={60} showInfo={false} strokeColor="#3b82f6" className="mt-2" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card">
            <Statistic
              title="New Patients"
              value={23}
              valueStyle={{ color: '#fca311' }}
            />
            <Progress percent={45} showInfo={false} strokeColor="#fca311" className="mt-2" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-card">
            <Statistic
              title="Satisfaction"
              value={4.8}
              suffix="/5"
              valueStyle={{ color: '#8b5cf6' }}
            />
            <Progress percent={96} showInfo={false} strokeColor="#8b5cf6" className="mt-2" />
          </Card>
        </Col>
      </Row>

      {/* Report Categories */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Financial Reports" className="admin-card">
            <Space direction="vertical" className="w-full" size="middle">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Monthly Revenue Report</div>
                    <div className="text-sm text-text-light">Detailed financial breakdown</div>
                  </div>
                  <DownloadOutlined className="text-primary-navy" />
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Analytics</div>
                    <div className="text-sm text-text-light">Payment methods and trends</div>
                  </div>
                  <DownloadOutlined className="text-primary-navy" />
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Operational Reports" className="admin-card">
            <Space direction="vertical" className="w-full" size="middle">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Appointment Analytics</div>
                    <div className="text-sm text-text-light">Scheduling and capacity analysis</div>
                  </div>
                  <DownloadOutlined className="text-primary-navy" />
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-navy cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Staff Performance</div>
                    <div className="text-sm text-text-light">Productivity and efficiency metrics</div>
                  </div>
                  <DownloadOutlined className="text-primary-navy" />
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Coming Soon */}
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
    </div>
  );
};

export default Reports;
